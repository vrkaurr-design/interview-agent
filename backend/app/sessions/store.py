from __future__ import annotations

import threading
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone

from app.models.schemas import ConversationTurn, Role
from app.services.profile import CandidateProfile, build_candidate_profile
from app.models.schemas import Candidate

SESSION_TTL = timedelta(hours=2)


class SessionNotFoundError(KeyError):
    pass


@dataclass
class InterviewSession:
    sessionId: str
    candidate_profile: CandidateProfile
    history: list[ConversationTurn] = field(default_factory=list)
    asked_days: set[int] = field(default_factory=set)
    question_count: int = 0
    started_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    done: bool = False
    awaiting_feedback: bool = False
    custom_curriculum: dict[int, str] = field(default_factory=dict)


class SessionStore:
    def __init__(self) -> None:
        self._sessions: dict[str, InterviewSession] = {}
        self._lock = threading.Lock()

    def sweep_expired(self, now: datetime | None = None) -> None:
        current = now or datetime.now(timezone.utc)
        with self._lock:
            stale_ids = [
                session_id
                for session_id, session in self._sessions.items()
                if current - session.started_at > SESSION_TTL
            ]
            for session_id in stale_ids:
                self._sessions.pop(session_id, None)

    def create(self, session_id: str, candidate: Candidate) -> InterviewSession:
        self.sweep_expired()
        profile = build_candidate_profile(candidate)
        session = InterviewSession(
            sessionId=session_id,
            candidate_profile=profile,
            custom_curriculum=profile.custom_curriculum
        )
        with self._lock:
            self._sessions[session_id] = session
        return session

    def get(self, session_id: str) -> InterviewSession | None:
        self.sweep_expired()
        with self._lock:
            return self._sessions.get(session_id)

    def require(self, session_id: str) -> InterviewSession:
        session = self.get(session_id)
        if session is None:
            raise SessionNotFoundError(f"Session {session_id} was not initialized")
        return session

    def append_turn(self, session_id: str, role: Role, content: str) -> None:
        with self._lock:
            session = self._sessions.get(session_id)
            if session is None:
                raise SessionNotFoundError(f"Session {session_id} was not initialized")
            session.history.append(ConversationTurn(role=role, content=content))

    def clear(self) -> None:
        with self._lock:
            self._sessions.clear()


SESSION_STORE = SessionStore()
