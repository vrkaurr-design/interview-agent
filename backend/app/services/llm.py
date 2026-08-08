from __future__ import annotations

import json
from typing import Any, TypeVar

from pydantic import BaseModel, ValidationError

from app.core.config import get_settings

T = TypeVar("T", bound=BaseModel)


class LLMUnavailableError(RuntimeError):
    pass


def _extract_json(text: str) -> str:
    stripped = text.strip()
    if stripped.startswith("```"):
        stripped = stripped.strip("`")
        if stripped.startswith("json"):
            stripped = stripped[4:]
    start = stripped.find("{")
    end = stripped.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError("LLM response did not contain a JSON object")
    return stripped[start : end + 1]


def generate_json(prompt: str, schema_model: type[T]) -> T:
    settings = get_settings()
    if not settings.gemini_api_key:
        raise LLMUnavailableError("GEMINI_API_KEY is not configured")

    try:
        from google import genai
    except ImportError as exc:
        raise LLMUnavailableError("google-genai is not installed") from exc

    client = genai.Client(api_key=settings.gemini_api_key)
    response = client.models.generate_content(
        model=settings.model_name,
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": schema_model,
        },
    )

    parsed = getattr(response, "parsed", None)
    if isinstance(parsed, schema_model):
        return parsed
    if isinstance(parsed, dict):
        return schema_model.model_validate(parsed)

    text = getattr(response, "text", "") or ""
    try:
        data: Any = json.loads(_extract_json(text))
        return schema_model.model_validate(data)
    except (json.JSONDecodeError, ValidationError, ValueError) as exc:
        raise RuntimeError(f"Gemini returned malformed structured output: {exc}") from exc


def generate_text(prompt: str) -> str:
    settings = get_settings()
    if not settings.gemini_api_key:
        raise LLMUnavailableError("GEMINI_API_KEY is not configured")

    try:
        from google import genai
    except ImportError as exc:
        raise LLMUnavailableError("google-genai is not installed") from exc

    client = genai.Client(api_key=settings.gemini_api_key)
    response = client.models.generate_content(model=settings.model_name, contents=prompt)
    text = getattr(response, "text", "") or ""
    if not text.strip():
        raise RuntimeError("Gemini returned an empty response")
    return text.strip()
