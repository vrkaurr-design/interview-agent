from __future__ import annotations

from app.models.schemas import InterviewFeedback
from app.services.llm import generate_json
from app.sessions.store import InterviewSession


def _fallback_feedback(session: InterviewSession) -> InterviewFeedback:
    profile = session.candidate_profile
    strong = profile.strong_days[0].prompt_label() if profile.strong_days else "the covered fundamentals"
    gap = (
        profile.shaky_days[0].prompt_label()
        if profile.shaky_days
        else profile.skipped_days[0].prompt_label()
        if profile.skipped_days
        else "one advanced curriculum area"
    )
    return InterviewFeedback(
        summary=(
            f"{profile.name} completed a personalized technical interview for the {profile.role} track. "
            "The session showed usable baseline knowledge, with the clearest signal coming from the answers that connected concepts to implementation tradeoffs."
        ),
        strengths=[
            f"Explained {strong} with enough structure to support follow-up discussion.",
            "Responded to multi-turn prompts in a practical engineering style.",
        ],
        gaps=[
            f"Needs more precise depth around {gap}.",
            "Should make debugging steps and failure modes more concrete when answers are challenged.",
        ],
        next=[
            f"Revisit {gap} and write a short implementation checklist.",
            "Practice answering with problem, tradeoff, implementation detail, and validation steps.",
        ],
    )


def _feedback_prompt(session: InterviewSession, strict: bool = False) -> str:
    transcript = "\n".join(f"{turn.role}: {turn.content}" for turn in session.history)
    strict_note = (
        "The previous response had an empty field. All arrays must contain at least one concise item."
        if strict
        else ""
    )
    return f"""
You are evaluating a technical interview transcript.
Return JSON matching this exact schema: summary string, strengths string array, gaps string array, next string array.

Grounding rules:
- summary: 2-3 sentences about this specific conversation.
- strengths: cite actual curriculum topics the candidate answered well in this interview.
- gaps: cite moments where answers were thin, evasive, or incorrect, especially shaky/skipped areas.
- next: concrete next steps tied to the actual gaps, capped at 3-5 items.
- Do not use generic praise.
- Each array must be non-empty.
{strict_note}

Candidate scouting report:
{session.candidate_profile.to_prompt_context()}

Transcript:
{transcript}
"""


def _is_complete(feedback: InterviewFeedback) -> bool:
    return bool(
        feedback.summary.strip()
        and feedback.strengths
        and feedback.gaps
        and feedback.next
        and all(item.strip() for item in feedback.strengths + feedback.gaps + feedback.next)
    )


def generate_feedback(session: InterviewSession) -> InterviewFeedback:
    for strict in (False, True):
        try:
            feedback = generate_json(_feedback_prompt(session, strict=strict), InterviewFeedback)
            if _is_complete(feedback):
                return feedback
        except Exception:
            continue
    return _fallback_feedback(session)
