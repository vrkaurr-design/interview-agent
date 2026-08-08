from __future__ import annotations

from app.data.loader import DAYS_BY_NUMBER, all_day_numbers
from app.models.schemas import ConversationTurn, StructuredTurn
from app.services.llm import generate_json, generate_text
from app.services.profile import CandidateProfile, ProfileDay
from app.sessions.store import InterviewSession

MIN_QUESTIONS = 8
MIN_DAYS = 4
MAX_QUESTIONS = 12


def select_opening_day(profile: CandidateProfile) -> int:
    if profile.strong_days:
        return profile.strong_days[0].day
    if profile.shaky_days:
        return profile.shaky_days[0].day
    if profile.skipped_days:
        return profile.skipped_days[0].day
    return all_day_numbers()[0]


def _day_title(day_number: int) -> str:
    day = DAYS_BY_NUMBER.get(day_number)
    return day.label if day else f"Day {day_number}"


def _candidate_day_pool(profile: CandidateProfile) -> list[ProfileDay]:
    seen: set[int] = set()
    ordered: list[ProfileDay] = []
    for day in profile.shaky_days + profile.skipped_days + profile.strong_days:
        if day.day not in seen:
            ordered.append(day)
            seen.add(day.day)
    for day_number in all_day_numbers():
        if day_number not in seen:
            ordered.append(ProfileDay(day=day_number, title=_day_title(day_number)))
            seen.add(day_number)
    return ordered


def deterministic_question(profile: CandidateProfile, asked_days: set[int], question_count: int) -> StructuredTurn:
    pool = _candidate_day_pool(profile)
    preferred = next((day for day in pool if day.day not in asked_days), pool[question_count % len(pool)])
    title = preferred.title
    if preferred.skipped:
        reply = (
            f"Let's dig into {title}, since that area was skipped in the mission history. "
            "How would you approach the core implementation and what failure mode would you watch for first?"
        )
    elif preferred.attempts and preferred.attempts >= 3:
        reply = (
            f"I want to revisit {title}, where the mission took a few attempts. "
            "Can you walk me through the concept and explain how you would debug a mistake in it?"
        )
    else:
        reply = (
            f"Let's build from {title}. "
            "What is the main engineering tradeoff in this topic, and how have you applied it in a real project?"
        )
    conclude = question_count + 1 >= MIN_QUESTIONS and len(asked_days | {preferred.day}) >= MIN_DAYS
    return StructuredTurn(reply=reply, day_focus=preferred.day, conclude=conclude)


def generate_opening_question(profile: CandidateProfile) -> str:
    opening_day = select_opening_day(profile)
    title = _day_title(opening_day)
    prompt = f"""
You are a senior engineer conducting a real technical interview.
Be conversational and curious, not robotic. Ask exactly one question.
Keep the reply to 2-4 sentences.

Candidate scouting report:
{profile.to_prompt_context()}

Interview requirements:
- Ask at least {MIN_QUESTIONS} questions across at least {MIN_DAYS} distinct curriculum days before concluding.
- Start with a strong day when possible so the candidate can establish confidence.
- Reference the actual mission/day title in the first question.

Open with a short greeting to {profile.name}, then ask the first question about Day {opening_day} - {title}.
"""
    try:
        return generate_text(prompt)
    except Exception:
        return (
            f"Hi {profile.name}, thanks for joining. I saw strong signal around Day {opening_day} - {title}, "
            "so let's start there: what is the key concept, and how would you explain the tradeoff to another engineer?"
        )


def _history_for_prompt(session: InterviewSession) -> str:
    if not session.history:
        return "No prior turns."
    return "\n".join(f"{turn.role}: {turn.content}" for turn in session.history)


def _turn_prompt(session: InterviewSession, candidate_message: str) -> str:
    valid_days = ", ".join(str(day) for day in all_day_numbers())
    return f"""
You are a senior engineer conducting a real technical interview.
Ask one natural follow-up question at a time. Keep responses to 2-4 sentences.
Do not announce question numbers or coverage requirements.

Candidate scouting report:
{session.candidate_profile.to_prompt_context()}

Conversation so far:
{_history_for_prompt(session)}

Latest candidate answer:
{candidate_message}

State:
- asked_days: {sorted(session.asked_days)}
- question_count: {session.question_count}
- valid curriculum days: {valid_days}
- minimum before conclusion: {MIN_QUESTIONS} questions and {MIN_DAYS} distinct days
- hard maximum: {MAX_QUESTIONS} questions

Instructions:
- If the latest answer is thin, evasive, or unclear, dig deeper on the same day.
- If the latest answer is strong, move to a new curriculum day.
- Prefer shaky and skipped days after the opening.
- Return JSON only with reply, day_focus, and conclude.
- day_focus must be one of the valid curriculum day integers.
- conclude can be true only when the minimum has been met or the hard maximum is reached.
"""


def generate_next_turn(session: InterviewSession, candidate_message: str) -> tuple[str, bool, int | None]:
    session.history.append(ConversationTurn(role="candidate", content=candidate_message))
    force_conclude = session.question_count >= MAX_QUESTIONS

    result: StructuredTurn
    if force_conclude:
        result = StructuredTurn(reply="That's helpful context, thank you.", day_focus=next(iter(session.asked_days or {1})), conclude=True)
    else:
        try:
            result = generate_json(_turn_prompt(session, candidate_message), StructuredTurn)
        except Exception:
            result = deterministic_question(session.candidate_profile, session.asked_days, session.question_count)

    if result.day_focus not in DAYS_BY_NUMBER:
        result.day_focus = deterministic_question(session.candidate_profile, session.asked_days, session.question_count).day_focus

    session.asked_days.add(result.day_focus)
    session.question_count += 1

    minimum_met = session.question_count >= MIN_QUESTIONS and len(session.asked_days) >= MIN_DAYS
    if session.question_count >= MAX_QUESTIONS:
        result.conclude = True
    if result.conclude and minimum_met:
        session.awaiting_feedback = True
        closing_reply = "That's really helpful context, thank you. I have enough to wrap up the interview."
        session.history.append(ConversationTurn(role="interviewer", content=closing_reply))
        return closing_reply, False, result.day_focus

    session.history.append(ConversationTurn(role="interviewer", content=result.reply))
    return result.reply, False, result.day_focus
