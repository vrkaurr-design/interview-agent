from __future__ import annotations

from dataclasses import dataclass

from app.data.loader import DAYS_BY_NUMBER, TOTAL_COHORT_DAYS, get_module_for_day
from app.models.schemas import Candidate, CandidateMission, CurriculumDay


@dataclass(frozen=True)
class ProfileDay:
    day: int
    title: str
    attempts: int | None = None
    skipped: bool = False

    def prompt_label(self) -> str:
        if self.attempts:
            return f"Day {self.day} - {self.title} ({self.attempts} attempts)"
        return f"Day {self.day} - {self.title}"


@dataclass
class CandidateProfile:
    candidate_id: str
    name: str
    role: str
    strong_days: list[ProfileDay]
    shaky_days: list[ProfileDay]
    skipped_days: list[ProfileDay]
    modules_touched: list[str]
    first_try_ratio: float
    consistency: float
    raw_candidate: Candidate

    def to_prompt_context(self) -> str:
        def render_days(label: str, days: list[ProfileDay]) -> str:
            values = ", ".join(day.prompt_label() for day in days) if days else "None"
            return f"{label}: {values}."

        return "\n".join(
            [
                f"Candidate: {self.name} ({self.role}).",
                render_days("Strong (first-try)", self.strong_days),
                render_days("Shaky (3+ attempts)", self.shaky_days),
                render_days("Skipped", self.skipped_days),
                f"Modules touched: {', '.join(self.modules_touched) if self.modules_touched else 'None'}.",
                f"First-try ratio: {self.first_try_ratio:.2f}.",
                f"Consistency: {self.consistency:.2f}.",
            ]
        )


def _profile_day(day_number: int, mission: CandidateMission | None = None) -> ProfileDay:
    day = DAYS_BY_NUMBER.get(day_number)
    title = day.label if day else (mission.title if mission and mission.title else f"Day {day_number}")
    return ProfileDay(
        day=day_number,
        title=title,
        attempts=mission.attempts if mission else None,
        skipped=bool(mission.skipped) if mission else False,
    )


def _day_matches_mission(day: CurriculumDay, mission: CandidateMission) -> bool:
    module = (mission.module or "").lower()
    title = (mission.title or "").lower()
    haystack = f"{day.label} {day.description or ''}".lower()
    return bool(module and any(part in haystack for part in module.replace("js", ".js").split())) or (
        bool(title) and title in haystack
    )


def _expand_frontend_missions(candidate: Candidate) -> list[CandidateMission]:
    if candidate.missions:
        return candidate.missions

    missions: list[CandidateMission] = []
    for item in candidate.completedMissions:
        matched_days = [day.day for day in DAYS_BY_NUMBER.values() if _day_matches_mission(day, item)]
        if not matched_days:
            matched_days = [1]
        for index, day_number in enumerate(matched_days[:2]):
            missions.append(
                CandidateMission(
                    day=day_number,
                    title=DAYS_BY_NUMBER[day_number].label,
                    passed=bool(item.completed),
                    attempts=1 if item.completed else 3,
                    skipped=not bool(item.completed),
                    module=item.module,
                )
            )

    skipped_count = max(0, candidate.skippedTopicsCount - len([mission for mission in missions if mission.skipped]))
    for day_number in sorted(DAYS_BY_NUMBER):
        if skipped_count <= 0:
            break
        if all(mission.day != day_number for mission in missions):
            missions.append(
                CandidateMission(
                    day=day_number,
                    title=DAYS_BY_NUMBER[day_number].label,
                    skipped=True,
                    attempts=None,
                    passed=False,
                )
            )
            skipped_count -= 1

    return missions


def build_candidate_profile(candidate: Candidate) -> CandidateProfile:
    missions = _expand_frontend_missions(candidate)
    strong_days: list[ProfileDay] = []
    shaky_days: list[ProfileDay] = []
    skipped_days: list[ProfileDay] = []
    module_titles: list[str] = []

    for mission in missions:
        if mission.day is None:
            continue
        profile_day = _profile_day(mission.day, mission)
        module = get_module_for_day(mission.day)
        if module and module.title not in module_titles:
            module_titles.append(module.title)

        if mission.skipped:
            skipped_days.append(profile_day)
        elif mission.passed and mission.attempts == 1:
            strong_days.append(profile_day)
        elif mission.passed and mission.attempts is not None and mission.attempts >= 3:
            shaky_days.append(profile_day)

    if candidate.signals:
        completed = candidate.signals.missionsCompleted
        first_try = candidate.signals.missionsFirstTry
        commit_days = candidate.signals.commitDays
    else:
        completed = len([mission for mission in missions if mission.passed])
        first_try = len([mission for mission in missions if mission.passed and mission.attempts == 1])
        progress = candidate.cohortProgress or 0
        commit_days = round((float(progress) / 100) * TOTAL_COHORT_DAYS)

    return CandidateProfile(
        candidate_id=candidate.candidate_id,
        name=candidate.display_name,
        role=candidate.display_role,
        strong_days=strong_days,
        shaky_days=shaky_days,
        skipped_days=skipped_days,
        modules_touched=module_titles,
        first_try_ratio=(first_try / completed) if completed else 0.0,
        consistency=commit_days / TOTAL_COHORT_DAYS,
        raw_candidate=candidate,
    )
