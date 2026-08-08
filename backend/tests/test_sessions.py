from __future__ import annotations

from datetime import datetime, timedelta, timezone

from app.models.schemas import Candidate
from app.sessions.store import SESSION_TTL, SessionStore


def fake_candidate() -> Candidate:
    return Candidate.model_validate(
        {
            "member": {
                "id": "abc",
                "name": "Test Candidate",
                "jobRole": "AI Engineer",
                "yearsExperience": 3,
                "education": "BS",
            },
            "missions": [
                {"day": 1, "title": "Setup", "passed": True, "attempts": 1},
                {"day": 12, "title": "Prompting", "passed": True, "attempts": 3},
                {"day": 27, "title": "Security", "skipped": True},
            ],
            "signals": {"commitDays": 20, "missionsCompleted": 2, "missionsFirstTry": 1},
        }
    )


def test_create_get_and_append() -> None:
    store = SessionStore()
    session = store.create("sess-1", fake_candidate())

    assert store.get("sess-1") is session
    assert session.candidate_profile.name == "Test Candidate"

    store.append_turn("sess-1", "candidate", "hello")
    assert session.history[-1].content == "hello"


def test_sweep_expired() -> None:
    store = SessionStore()
    session = store.create("sess-2", fake_candidate())
    session.started_at = datetime.now(timezone.utc) - SESSION_TTL - timedelta(seconds=1)

    store.sweep_expired()

    assert store.get("sess-2") is None
