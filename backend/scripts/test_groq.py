from __future__ import annotations

import os
from dotenv import load_dotenv

# Load env variables from .env if present
load_dotenv()

from app.core.config import get_settings
from app.services.llm import generate_json, generate_text, LLMUnavailableError
from pydantic import BaseModel


class GroqEvalSchema(BaseModel):
    summary: str
    score: int
    strengths: list[str]


def main() -> None:
    settings = get_settings()
    print("Settings check:")
    print(f"  GROQ_API_KEY configured: {bool(settings.groq_api_key)}")
    print(f"  GROQ_MODEL_NAME: {settings.groq_model_name}")

    if not settings.groq_api_key:
        print("\nERROR: GROQ_API_KEY environment variable is not set.")
        print("Please run with: GROQ_API_KEY=your_key python scripts/test_groq.py")
        return

    print("\n--- Testing generate_text ---")
    try:
        reply = generate_text("Translate 'Hello, how are you?' into French. Output only the translation.")
        print(f"Result:\n{reply}")
    except Exception as exc:
        print(f"FAILED: {exc}")

    print("\n--- Testing generate_json ---")
    try:
        prompt = (
            "Evaluate a test candidate and output a JSON with fields: "
            "summary (string describing technical level), score (integer 0-100), and strengths (list of strings). "
            "Output JSON only."
        )
        data = generate_json(prompt, GroqEvalSchema)
        print(f"Parsed Result (Pydantic model validation successful):\n{data}")
    except Exception as exc:
        print(f"FAILED: {exc}")


if __name__ == "__main__":
    main()
