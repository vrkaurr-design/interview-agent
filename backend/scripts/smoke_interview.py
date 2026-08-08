from __future__ import annotations

from app.data.loader import CANDIDATES
from app.services.feedback import generate_feedback
from app.services.interviewer import generate_next_turn, generate_opening_question, select_opening_day
from app.sessions.store import SESSION_STORE
from app.models.schemas import ConversationTurn


def main() -> None:
    session = SESSION_STORE.create("smoke-session", CANDIDATES[0])
    opening_day = select_opening_day(session.candidate_profile)
    session.asked_days.add(opening_day)
    session.question_count = 1
    opening = generate_opening_question(session.candidate_profile)
    session.history.append(ConversationTurn(role="interviewer", content=opening))
    print(f"AI: {opening}\n")

    for index in range(12):
        answer = f"I would approach this by explaining the tradeoffs, implementing it, then validating with tests. Turn {index}."
        print(f"Candidate: {answer}")
        reply, done, day_focus = generate_next_turn(session, answer)
        print(f"AI(day {day_focus}): {reply}\n")
        if session.awaiting_feedback:
            break

    feedback = generate_feedback(session)
    print(feedback.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
