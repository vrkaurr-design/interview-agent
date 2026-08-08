from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.models.schemas import Candidate, CurriculumDay, CurriculumModule

DATA_DIR = Path(__file__).resolve().parent
TOTAL_COHORT_DAYS = 31

DEFAULT_MODULES = [
    CurriculumModule(number=1, title="Environment & Tooling", start_day=1, end_day=3),
    CurriculumModule(number=2, title="Data Foundations", start_day=4, end_day=6),
    CurriculumModule(number=3, title="Embeddings & Vector Search", start_day=7, end_day=10),
    CurriculumModule(number=4, title="LLM Core, Prompting & Fine-Tuning", start_day=11, end_day=15),
    CurriculumModule(number=5, title="Chatbot Application Build", start_day=16, end_day=20),
    CurriculumModule(number=6, title="Agentic AI & MCP", start_day=21, end_day=24),
    CurriculumModule(number=7, title="Evaluation, Security & Deployment", start_day=25, end_day=28),
    CurriculumModule(number=8, title="Production & Capstone", start_day=29, end_day=31),
]


def _read_json(filename: str) -> Any:
    path = DATA_DIR / filename
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise RuntimeError(f"Missing required data file: {path}") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"Malformed JSON in {path}: {exc}") from exc


def _load_curriculum() -> tuple[list[CurriculumDay], list[CurriculumModule]]:
    raw = _read_json("curriculum.json")
    raw_days = raw.get("days", raw) if isinstance(raw, dict) else raw
    if not isinstance(raw_days, list):
        raise RuntimeError("curriculum.json must contain a days array or be a day array")

    days = [CurriculumDay.model_validate(item) for item in raw_days]
    if not days:
        raise RuntimeError("curriculum.json must include at least one day")

    raw_modules = raw.get("modules", []) if isinstance(raw, dict) else []
    modules: list[CurriculumModule] = []
    for index, item in enumerate(raw_modules, start=1):
        if "start_day" in item and "end_day" in item:
            modules.append(CurriculumModule(number=item.get("number", index), **item))
        elif "days" in item and isinstance(item["days"], list) and item["days"]:
            modules.append(
                CurriculumModule(
                    number=item.get("number", index),
                    title=item.get("title", f"Module {index}"),
                    start_day=min(item["days"]),
                    end_day=max(item["days"]),
                )
            )

    return days, modules or DEFAULT_MODULES


def _load_candidates() -> list[Candidate]:
    raw = _read_json("candidates.json")
    if not isinstance(raw, list):
        raise RuntimeError("candidates.json must be an array")
    return [Candidate.model_validate(item) for item in raw]


CURRICULUM_DAYS, CURRICULUM_MODULES = _load_curriculum()
DAYS_BY_NUMBER = {day.day: day for day in CURRICULUM_DAYS}
MODULES_BY_NUMBER = {module.number: module for module in CURRICULUM_MODULES}
CANDIDATES = _load_candidates()
CANDIDATES_BY_ID = {candidate.candidate_id: candidate for candidate in CANDIDATES}

for candidate in CANDIDATES:
    for mission in candidate.missions:
        if mission.day is not None and mission.day not in DAYS_BY_NUMBER:
            raise RuntimeError(
                f"Candidate {candidate.candidate_id} references unknown curriculum day {mission.day}"
            )


def get_day(day_number: int) -> CurriculumDay | None:
    return DAYS_BY_NUMBER.get(day_number)


def get_module_for_day(day_number: int) -> CurriculumModule | None:
    for module in CURRICULUM_MODULES:
        if module.includes(day_number):
            return module
    return None


def all_day_numbers() -> list[int]:
    return sorted(DAYS_BY_NUMBER)
