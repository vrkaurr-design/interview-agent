from __future__ import annotations

import os
from dotenv import load_dotenv

load_dotenv()

from app.models.schemas import Candidate, ConversationTurn
from app.services.feedback import generate_feedback
from app.services.interviewer import generate_next_turn, generate_opening_question, select_opening_day
from app.sessions.store import SESSION_STORE


def main() -> None:
    print("--- Dynamic Custom Curriculum & Role Smoke Test ---")
    
    # Initialize a candidate with a custom role and empty missions
    candidate = Candidate.model_validate(
        {
            "member": {
                "id": "custom-candidate-1",
                "name": "Alex Py",
                "jobRole": "Python Backend Developer",
                "yearsExperience": 4,
                "education": "MS CS",
            },
            "missions": [],  # Empty missions to trigger dynamic curriculum generation
            "signals": {
                "commitDays": 18,
                "missionsCompleted": 0,
                "missionsFirstTry": 0
            }
        }
    )

    session = SESSION_STORE.create("custom-smoke-session", candidate)
    
    print("\nGenerated Custom Curriculum mapping:")
    for day, topic in sorted(session.custom_curriculum.items()):
        print(f"  Day {day}: {topic}")

    opening_day = select_opening_day(session.candidate_profile)
    session.asked_days.add(opening_day)
    session.question_count = 1
    
    opening = generate_opening_question(session.candidate_profile)
    session.history.append(ConversationTurn(role="interviewer", content=opening))
    print(f"\nAI (Opening question, Day {opening_day}):\n{opening}\n")

    # Run through 8 turns of dialogue
    for index in range(8):
        answer = (
            f"Regarding that topic, I usually implement it using standard practices, "
            f"considering memory/speed tradeoffs, and verifying the execution using python tests. Turn {index}."
        )
        print(f"Candidate: {answer}")
        
        reply, done, day_focus = generate_next_turn(session, answer)
        print(f"AI (Day {day_focus}): {reply}\n")
        
        if session.awaiting_feedback:
            print("AI wrapped up the session successfully.")
            break

    print("Generating Feedback Diagnostic Report...")
    feedback = generate_feedback(session)
    print("\n--- Diagnostic Feedback Report ---")
    print(feedback.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
