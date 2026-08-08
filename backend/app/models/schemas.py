from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class CandidateMember(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    name: str
    jobRole: str | None = None
    yearsExperience: str | int | float | None = None
    education: str | None = None


class CandidateMission(BaseModel):
    model_config = ConfigDict(extra="allow")

    day: int | None = None
    title: str | None = None
    passed: bool | None = None
    attempts: int | None = None
    skipped: bool | None = None
    module: str | None = None
    completed: bool | None = None


class CandidateSignals(BaseModel):
    model_config = ConfigDict(extra="allow")

    commitDays: int = 0
    missionsCompleted: int = 0
    missionsFirstTry: int = 0


class Candidate(BaseModel):
    """Canonical candidate model with compatibility for the current frontend shape."""

    model_config = ConfigDict(extra="allow")

    member: CandidateMember | None = None
    missions: list[CandidateMission] = Field(default_factory=list)
    signals: CandidateSignals | None = None

    id: str | None = None
    name: str | None = None
    role: str | None = None
    experience: str | None = None
    cohortProgress: int | float | None = None
    completedMissions: list[CandidateMission] = Field(default_factory=list)
    learningSignals: dict[str, Any] | None = None
    skippedTopicsCount: int = 0

    @model_validator(mode="after")
    def ensure_identity(self) -> "Candidate":
        if self.member is None and not (self.id and self.name):
            raise ValueError("candidate must include either member or id/name fields")
        return self

    @property
    def candidate_id(self) -> str:
        return self.member.id if self.member else str(self.id)

    @property
    def display_name(self) -> str:
        return self.member.name if self.member else str(self.name)

    @property
    def display_role(self) -> str:
        if self.member and self.member.jobRole:
            return self.member.jobRole
        return self.role or "candidate"


class CurriculumDay(BaseModel):
    model_config = ConfigDict(extra="allow")

    day: int
    title: str | None = None
    topic: str | None = None
    type: str | None = None
    tools: list[str] = Field(default_factory=list)
    objectives: list[str] = Field(default_factory=list)
    description: str | None = None
    durationMinutes: int | None = None

    @property
    def label(self) -> str:
        return self.title or self.topic or f"Day {self.day}"


class CurriculumModule(BaseModel):
    model_config = ConfigDict(extra="allow")

    number: int
    title: str
    start_day: int
    end_day: int

    def includes(self, day: int) -> bool:
        return self.start_day <= day <= self.end_day


class InterviewRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sessionId: str
    candidate: Candidate | None = None
    message: str | None = None

    @model_validator(mode="after")
    def exactly_one_payload(self) -> "InterviewRequest":
        if (self.candidate is None) == (self.message is None):
            raise ValueError("provide exactly one of candidate or message")
        if self.message is not None and not self.message.strip():
            raise ValueError("message must not be empty")
        return self


InterviewInitRequest = InterviewRequest
InterviewTurnRequest = InterviewRequest


class InterviewFeedback(BaseModel):
    summary: str
    strengths: list[str]
    gaps: list[str]
    next: list[str]


class InterviewResponse(BaseModel):
    reply: str
    done: bool
    feedback: InterviewFeedback | None = None
    dayFocus: int | None = None


class StructuredTurn(BaseModel):
    reply: str
    day_focus: int
    conclude: bool = False


class CustomDayTopic(BaseModel):
    day: int
    topic: str
    description: str


class CustomCurriculumSchema(BaseModel):
    days: list[CustomDayTopic]


Role = Literal["interviewer", "candidate"]


class ConversationTurn(BaseModel):
    role: Role
    content: str
