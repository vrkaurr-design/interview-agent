from __future__ import annotations

from app.data.loader import CANDIDATES
from app.services.profile import build_candidate_profile


def main() -> None:
    for candidate in CANDIDATES:
        print(build_candidate_profile(candidate).to_prompt_context())
        print()


if __name__ == "__main__":
    main()
