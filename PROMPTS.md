# AI Interview Agent — Backend Prompt Suite

**How to use this file:** same pattern as your frontend suite — paste each PROMPT
block into your AI IDE in order, review the diff, then move to the next phase.
The notes above each block are for you, not the model.

This backend is being built for the **ABTalks Vibe Code Hackathon — "The
Interview Agent"** brief. Judging includes a Stage 2 authenticity review that
checks your prompt history against the implemented features, so keep this file
(with your actual run order and any deviations noted) as your `PROMPTS.md` — it
already doubles as your AI usage log.

---

## 0. Architecture Decision (read before running anything)

**Assumption I'm making, flag it if wrong:** a standalone **FastAPI** service,
separate from the Next.js frontend, deployed independently — matching the stack
you've used across ContractGuard, ChainSight, and DevScope Agent, and keeping the
backend LLM logic in Python where prompt iteration is faster than inside a Next.js
route handler. If you'd rather keep this inside `frontend/src/app/api/interview`
as a Next.js route (fewer moving parts for a single demo deploy), the phases
below still apply almost 1:1 — swap FastAPI routing for a Next.js route handler
and skip Phase 8's separate deployment step.

| Layer | Choice | Why |
|---|---|---|
| Framework | FastAPI (Python 3.11+) | matches your existing hackathon stack, fast to iterate |
| LLM | Gemini (flash-tier — use whatever model string you're currently defaulting to) | fast + cheap enough for multi-turn per session, structured JSON output support |
| Session state | In-memory dict keyed by `sessionId` | spec explicitly excludes persistent accounts/long-term history |
| Data | `curriculum.json` + `candidates.json` loaded once at startup | both provided as static hackathon assets, no DB needed |
| Validation | Pydantic models mirroring `technical-spec.md` exactly | request/response shape is judged automatically, must match byte-for-byte on field names |
| Deployment | Railway or Google Cloud Run | matches your existing pattern, both have a working live-demo URL fast |

**The contract you're building against** (from `technical-spec.md`, do not deviate):

```
POST /api/interview

# turn 1 — init
{ "sessionId": "abc-123", "candidate": { ...candidate object... } }
-> { "reply": "...", "done": false }

# turns 2..N
{ "sessionId": "abc-123", "message": "..." }
-> { "reply": "...", "done": false }

# final turn
-> { "reply": "...", "done": true,
     "feedback": { "summary": "...", "strengths": [], "gaps": [], "next": [] } }
```

**The curriculum shape you're reasoning over** — 8 modules spanning 31 days:

| # | Module | Days |
|---|---|---|
| 1 | Environment & Tooling | 1–3 |
| 2 | Data Foundations | 4–6 |
| 3 | Embeddings & Vector Search | 7–10 |
| 4 | LLM Core, Prompting & Fine-Tuning | 11–15 |
| 5 | Chatbot Application Build | 16–20 |
| 6 | Agentic AI & MCP | 21–24 |
| 7 | Evaluation, Security & Deployment | 25–28 |
| 8 | Production & Capstone | 29–31 |

Each day in `curriculum.json` carries a `title`, `type` (SETUP / BUILD / LEARN /
AI_CORE / SHIP_IT / OPTIMIZE / CAPSTONE), `tools[]`, and `objectives[]` — this is
your source of truth for what a question on "Day 23" is actually allowed to ask
about.

**The candidate shape you're personalizing against** — each candidate has
`member` (id, name, jobRole, yearsExperience, education), `missions[]` (each with
`day`, `title`, and either `passed` + `attempts`, or `skipped: true`), and
`signals` (`commitDays`, `missionsCompleted`, `missionsFirstTry`). This is what
makes the interview personalized rather than a generic quiz — high `attempts` on
a mission is a real signal of a shaky topic worth probing; `skipped` missions are
fair game to ask about directly ("I see you skipped Day 27 — how would you
approach input validation on an LLM-facing endpoint?"); a low `missionsFirstTry`
ratio relative to `missionsCompleted` suggests probing depth rather than breadth.

---

## Phase 1 — Project Scaffold

```
PROMPT:
Scaffold a new FastAPI backend for the AI Interview Agent hackathon project, as
a sibling directory to the existing `frontend/` folder (i.e. `interview-agent/
backend/`).

1. Structure:
   backend/
     app/
       main.py              # FastAPI app, CORS, router mount
       api/
         interview.py       # POST /api/interview route
       core/
         config.py          # env vars via pydantic-settings (GEMINI_API_KEY,
                             # ALLOWED_ORIGINS, MODEL_NAME, PORT)
       data/
         curriculum.json     # copy of the provided file
         candidates.json     # copy of the provided file
         loader.py           # loads + validates both JSON files at startup,
                             # raises a clear error if either is malformed
       models/
         schemas.py          # Pydantic models for the exact request/response
                             # contract in technical-spec.md
       services/             # filled in later phases
       sessions/             # filled in later phases
     requirements.txt
     .env.example
     Dockerfile
     README.md

2. In schemas.py, define:
   - CandidateMember, CandidateMission, CandidateSignals, Candidate (matching
     the actual candidates.json shape: member/missions/signals).
   - InterviewInitRequest (sessionId: str, candidate: Candidate)
   - InterviewTurnRequest (sessionId: str, message: str)
   - InterviewFeedback (summary: str, strengths: list[str], gaps: list[str],
     next: list[str])
   - InterviewResponse (reply: str, done: bool, feedback: InterviewFeedback |
     None = None) — feedback must be omitted (not null) from the JSON when None,
     use Pydantic's exclude_none on serialization.
   Accept a single POST body that can be EITHER the init shape OR the turn
   shape — use a Pydantic model with optional `candidate` and optional
   `message`, and validate in the route handler that exactly one is present
   per the technical spec's two request forms.

3. main.py: enable CORS for the frontend's origin (read from
   ALLOWED_ORIGINS env var, comma-separated, default to
   "http://localhost:3000"). Add a GET /health endpoint returning
   {"status": "ok"}.

4. requirements.txt: fastapi, uvicorn[standard], pydantic-settings,
   google-genai (or the current Gemini Python SDK package name), python-dotenv.

5. Confirm `uvicorn app.main:app --reload` starts cleanly and /health returns
   200.
```

---

## Phase 2 — Curriculum & Candidate Data Layer

```
PROMPT:
Build the data-access layer in app/data/loader.py and app/services/profile.py.

1. loader.py: on import, load curriculum.json and candidates.json into memory
   as typed structures (use the Pydantic models from Phase 1 plus a
   CurriculumDay / CurriculumModule model you add now). Build two lookup
   dicts: DAYS_BY_NUMBER (day int -> CurriculumDay) and
   CANDIDATES_BY_ID (member.id -> Candidate). Raise a startup error if any
   mission in candidates.json references a day number not present in
   curriculum.json.

2. profile.py: implement `build_candidate_profile(candidate: Candidate) ->
   CandidateProfile` that derives, from the raw candidate object:
   - `strong_days`: missions that were passed with attempts == 1 (first-try
     signal — genuinely understood, not just eventually passed)
   - `shaky_days`: missions that were passed with attempts >= 3 (struggled but
     got there — worth a follow-up to check real understanding)
   - `skipped_days`: missions marked skipped — fair to probe directly
   - `modules_touched`: which of the 8 curriculum modules the candidate's
     missions span, derived by mapping each mission's day number to its module
     via the module day-ranges in curriculum.json
   - `first_try_ratio`: signals.missionsFirstTry / signals.missionsCompleted
     (guard divide-by-zero)
   - `consistency`: signals.commitDays / total cohort days (31), as a rough
     "how steadily did they show up" signal

3. This profile object is what later phases will hand to the LLM as grounding
   context — it should read like a compact scouting report, not a raw JSON
   dump. Add a `to_prompt_context() -> str` method on CandidateProfile that
   renders it as short labeled lines (e.g. "Strong (first-try): Day 7 —
   Embeddings Explained, Day 23 — MCP. Shaky (3+ attempts): Day 12 — Prompt
   Engineering Fundamentals. Skipped: Day 28 — Docker & Kubernetes
   Deployment.") — this is what actually goes into the LLM system prompt in
   Phase 4.

4. Write a small standalone script (backend/scripts/check_profiles.py) that
   loads every candidate from candidates.json and prints their profile via
   to_prompt_context(), so you can eyeball that the derivation logic makes
   sense before it's wired into the interview flow.
```

---

## Phase 3 — Session State

```
PROMPT:
Build in-memory session management in app/sessions/store.py.

1. Define InterviewSession (dataclass or Pydantic model): sessionId,
   candidate_profile (from Phase 2), conversation history (list of {role:
   "interviewer"|"candidate", content: str}), asked_days (set[int] — which
   curriculum days have been questioned so far, used to enforce the "at least
   4 different days" minimum), question_count, started_at, and a `done: bool`
   flag.

2. SessionStore: a module-level dict[str, InterviewSession] with thread-safe
   get/create/update (a simple threading.Lock is enough — this doesn't need to
   survive a restart per the spec's "no persistent accounts" requirement).
   - `create(session_id, candidate) -> InterviewSession`
   - `get(session_id) -> InterviewSession | None`
   - `append_turn(session_id, role, content)`
   - Raise a clear 404-worthy exception if a turn request references a
     sessionId that was never initialized — the route handler in Phase 5
     translates this into an HTTP 404.

3. Add a basic TTL sweep: sessions older than 2 hours are evicted on each new
   request (iterate and drop stale entries) so a long-running demo instance
   doesn't leak memory across many test runs. Keep this simple, not a
   background thread — a hackathon demo doesn't need one.

4. Unit-test this in isolation (a quick pytest file is fine) before wiring it
   into the actual interview route — confirm create/get/append/evict all work
   as expected with a fake session id.
```

---

## Phase 4 — Interview Question Engine

```
PROMPT:
This is the core of the agent: app/services/interviewer.py.

Design goal: the interview should feel like a real technical interviewer who
already read the candidate's file, not a scripted quiz that happens to loop
through curriculum days.

1. Build `generate_opening_question(profile: CandidateProfile) -> str`:
   constructs a system prompt for Gemini that includes:
   - The interviewer's persona: a senior engineer conducting a real technical
     interview — conversational, curious, not robotic, asks ONE question at a
     time, keeps responses to 2-4 sentences (this is a chat interview, not an
     essay exchange).
   - The candidate's scouting report from `to_prompt_context()`.
   - The hard requirement: minimum 8 questions total across minimum 4 distinct
     curriculum days over the course of the interview, weighted toward the
     candidate's strong_days for the opening (start them somewhere they'll
     succeed, per real interview practice) before moving into shakier
     territory.
   - Instruct the model to open with a short greeting + first question about
     one of the candidate's strong_days, referencing the actual mission title
     so it's clear this is personalized, not generic.
   Returns the first `reply` string.

2. Build `generate_next_turn(session: InterviewSession, candidate_message: str)
   -> tuple[str, bool]` returning (reply, done):
   - Appends the candidate's message to session history.
   - Constructs a prompt containing: full conversation history so far, the
     candidate's scouting report, asked_days so far, question_count so far,
     and explicit instructions to:
     a. Generate ONE natural follow-up question that responds to what the
        candidate just said — if their answer was thin or evasive, dig deeper
        on the SAME day before moving on (this is what makes it feel like a
        real interview vs a fixed script); if it was strong, move to a new
        curriculum day.
     b. Prefer probing `shaky_days` and `skipped_days` as the interview
        progresses past the opening — that's where the signal actually is.
     c. Track toward but don't announce the 8-question/4-day minimum — the
        candidate should never see "Question 5 of 8."
     d. Once question_count >= 8 AND len(asked_days) >= 4 AND the model
        judges the conversation has covered enough ground, it may conclude —
        signal this by having the model return a special sentinel in its
        response (e.g. a JSON field `conclude: true`) rather than trying to
        parse natural language for "the interview is over."
   - Use Gemini's structured output mode (response_schema) for this call so
     you get back `{ "reply": str, "day_focus": int, "conclude": bool }`
     directly instead of parsing free text — day_focus lets you update
     asked_days deterministically in Python rather than guessing from prose.
   - Update session.asked_days, session.question_count, session.history.
   - If conclude is True, do NOT return the conclusion here — return done=False
     with a natural closing-feeling reply from the model (e.g. "That's really
     helpful context, thank you.") and set a session flag so the NEXT call
     triggers Phase 6's feedback generation instead of another question. This
     avoids cramming "here's your feedback" into the same turn as the last
     answer, which reads as abrupt in a real chat UI.

3. Add a hard safety net independent of the LLM's judgment: if question_count
   reaches 12 without the model concluding, force conclude=True anyway — a
   demo interview should never run unbounded.

4. Test manually via the check_profiles.py-style script from Phase 2: run a
   fake multi-turn exchange with canned candidate answers and confirm asked_days
   grows correctly and the question count logic behaves.
```

---

## Phase 5 — API Route Wiring

```
PROMPT:
Wire everything into the actual POST /api/interview route in
app/api/interview.py, matching technical-spec.md exactly.

1. Parse the incoming body against the flexible request model from Phase 1.
   - If `candidate` is present (and `message` is not): treat as init.
     - Look up or build the CandidateProfile (Phase 2) from the candidate
       payload — for the hackathon, use whatever candidate object was sent in
       the request body directly rather than requiring it to match an id in
       your local candidates.json, so judges can send their own test
       candidate objects per the spec's "any candidate.json schema" note.
     - Create the session (Phase 3), generate the opening question (Phase 4),
       return { reply, done: false }.
   - If `message` is present (and `candidate` is not): treat as a turn.
     - Look up the session; 404 with a clear error body if missing.
     - If the session is flagged as "awaiting feedback" (set at the end of
       Phase 4 step 2), generate feedback now (Phase 6) and return
       { reply, done: true, feedback }.
     - Otherwise call generate_next_turn, return { reply, done: false }.
   - If neither or both are present: return 422 with a clear validation error.

2. Wrap the Gemini call in try/except: on any LLM failure (timeout, rate
   limit, malformed structured output), retry once, then fall back to a
   deterministic canned question from the candidate's next un-asked
   strong_day/shaky_day rather than failing the whole request — a demo that
   errors out mid-interview is worse than one that degrades gracefully.

3. Log each turn's latency and the day_focus chosen (structured log line, not
   print) — useful for your own debugging and for the "AI usage log shows
   correspondence with implemented features" authenticity check.

4. Manually test the full flow with curl or httpie: init request, 8+ turns of
   fake candidate answers, confirm the final response matches the feedback
   schema exactly (summary: str, strengths: string[], gaps: string[], next:
   string[]).
```

---

## Phase 6 — Feedback Generation

```
PROMPT:
Build app/services/feedback.py — `generate_feedback(session: InterviewSession)
-> InterviewFeedback`.

1. Construct a prompt containing the full conversation transcript and the
   candidate's original scouting report, instructing the model to produce
   structured feedback via Gemini's response_schema matching InterviewFeedback
   exactly (summary: str, strengths: list[str], gaps: list[str], next:
   list[str]).

2. Grounding rules for the model, stated explicitly in the prompt:
   - `summary`: 2-3 sentences, an honest read on this specific conversation —
     not a generic "great job" template.
   - `strengths`: reference actual curriculum days/topics the candidate
     answered well in THIS interview, not just their pre-existing passed
     missions — the interview transcript is the evidence, not the candidate
     profile.
   - `gaps`: same — grounded in moments during the conversation where answers
     were thin, evasive, or wrong, especially on shaky_days/skipped_days that
     got probed.
   - `next`: concrete, actionable next steps tied to the actual gaps
     identified (e.g. "Revisit Day 27 — Security, Privacy & Guardrails, focus
     on prompt-injection mitigation" rather than "study more security").
   - Each array should contain concise, actionable points per the spec — cap
     each list at a sensible length (3-5 items) so it renders cleanly in the
     existing feedback UI (ScoreGauge/CompetencyRadar/StrengthsList/GapsList
     from your frontend build).

3. Add a validation step after the LLM call: if any of the four fields comes
   back empty, retry once with a stricter prompt reminding the model the
   schema requires non-empty arrays — the frontend's feedback page assumes at
   least one item per list.

4. Test against a few different fake transcripts (a strong performance, a weak
   one, a mixed one) and confirm the feedback actually differentiates —  if
   every test transcript gets similar boilerplate feedback, tighten the prompt
   grounding in step 2 rather than accepting it.
```

---

## Phase 7 — Frontend Integration

```
PROMPT:
Connect the existing Next.js frontend (already built) to this real backend
instead of its current mock /api/interview route.

1. In the frontend, add NEXT_PUBLIC_BACKEND_URL to .env.local pointing at the
   FastAPI backend (http://localhost:8000 in dev).

2. Update src/hooks/useInterviewSession.ts (or wherever the interview fetch
   logic lives) to call the real backend's POST /api/interview instead of the
   local Next.js mock route. Keep the request/response shape identical — this
   should require zero UI changes if the backend actually matches
   technical-spec.md, which is the point of building against that contract in
   Phase 1.

3. Confirm the CoverageSidebar's real-time curriculum coverage still updates
   correctly — it depends on knowing which curriculum day the current question
   is about, so make sure the backend's `day_focus` (Phase 4) is either
   surfaced in the response or inferable by the frontend the same way it was
   with the mock (check how the existing mock signaled this and match it, or
   add a lightweight `dayFocus` field to InterviewResponse alongside `reply`/
   `done` if the frontend needs it explicitly — this is an allowed additive
   field, the spec only constrains the required fields, not extra ones).

4. Run one full interview end-to-end through the actual UI (not curl) and
   confirm: opening question renders, follow-ups feel responsive, the
   coverage sidebar ticks up, and the feedback page renders real strengths/
   gaps/next items from Phase 6 instead of mock data.

5. Remove or clearly mark the old mock route (src/app/api/interview) as unused
   so there's no ambiguity for judges about which endpoint is actually live —
   the spec requires exactly one live endpoint at the given path.
```

---

## Phase 8 — Deployment & Submission Readiness

```
PROMPT:
Prepare the backend for the hackathon's required live demo URL and eligibility
checks.

1. Write backend/Dockerfile (python:3.11-slim base, install requirements,
   expose the PORT env var, run uvicorn app.main:app --host 0.0.0.0 --port
   $PORT).

2. Deploy to Railway (or Google Cloud Run, matching your usual pattern) — set
   GEMINI_API_KEY and ALLOWED_ORIGINS (the deployed frontend's actual origin,
   not localhost) as environment variables on the platform, not committed to
   the repo.

3. Update the frontend's NEXT_PUBLIC_BACKEND_URL for its own deployment
   (Vercel/Firebase Hosting) to point at the deployed backend URL. Redeploy
   the frontend.

4. Smoke-test the LIVE deployed frontend against the LIVE deployed backend —
   not localhost — since that's what judges will actually open. Run one full
   interview end-to-end on the live URLs.

5. Write backend/README.md covering: what this service does, the API
   contract, how to run locally, required env vars, and a curl example for
   the init request. Link it from the root README so a judge opening the repo
   cold can find it in one click.

6. Confirm eligibility checklist from the hackathon rules: repo is public,
   live demo URL is functional (test in an incognito window — cached auth or
   local-only CORS rules are a common last-minute failure), and this file
   (or an export of it plus your actual iteration history) is committed as
   PROMPTS.md at the repo root.
```

---

## Notes for the Live Steer Challenge

Stage 4 hands finalists an unseen feature request with 20 minutes to implement
it live, using whatever AI tools you used during the hackathon — which means
this exact prompt-suite workflow. Two things worth having ready beforehand,
since 20 minutes doesn't leave room to figure them out live:

- Know which phase file to reopen for common feature-request shapes: a new
  data signal → Phase 2 (profile.py); a change to how questions get selected
  or how many are asked → Phase 4; a change to the feedback shape or content →
  Phase 6; anything about the request/response JSON itself → Phase 1's schemas
  plus Phase 5's route.
- Keep Phase 4 and Phase 6's prompts open in a scratch file so you can paste a
  targeted one-line addition into the existing system prompt rather than
  reconstructing the whole prompt from scratch under time pressure.

---

## 9. Verification & Codebase Audit Log (August 8, 2026)

We ran a full verification of the implemented FastAPI backend against the Next.js frontend:

1. **Automated Tests**:
   - Executed `PYTHONPATH=. pytest` in the `backend` directory. All session management and TTL sweep tests passed successfully.
   - Executed `PYTHONPATH=. python scripts/smoke_interview.py`. Tested candidate profile loading, 8-question curriculum turn routing, fallback deterministic generation, and final structured feedback logic.

2. **Server Execution**:
   - Backend successfully listening on port `8000`.
   - Frontend successfully compiled (Turbopack Next.js 16.3.0) and listening on port `3000`.

3. **Browser E2E Walkthrough**:
   - Navigated the UI to select candidate **Sarah Connor**.
   - Completed an 8-turn technical dialogue covering React 19 core features, TypeScript Generics, Context API, Zustand, Chrome DevTools profiling, Webpack/Turbopack, and Virtual DOM.
   - Validated that the curriculum coverage checklist dynamically updated at each stage.
   - Verified that the final evaluation feedback report rendered correctly (Score: 64/100, Competency, specific strengths checkmarks, gaps, next steps, and saved successfully).

4. **Groq API Integration**:
   - Integrated Groq API (model: `llama-3.3-70b-versatile`) as an alternative high-performance LLM engine.
   - Updated `config.py` and `requirements.txt` to configure Groq credentials and package dependencies.
   - Added a dual-engine router in `llm.py` that dynamically executes completions via Groq if `GROQ_API_KEY` is provided, maintaining full fallback capabilities.
   - Verified integration logic via `test_groq.py` script and ran integration smoke tests successfully.

5. **Dynamic Topic & Custom Role Support**:
   - Upgraded the backend to support dynamic technical interviewing for any role (e.g. Python Backend Developer, Product Manager, etc.) instead of being locked to the 1..31 React days.
   - If a candidate with empty/no missions is initialized, the system calls Groq to generate a customized 8-day curriculum of core concepts for that candidate's specific `jobRole`.
   - Populated the session store with this dynamic curriculum and generated a realistic candidate scouting report (marking some generated days as passed/failed/skipped).
   - Structured the interviewer prompts to map numeric days to these custom topics, forcing the model to generate role-appropriate follow-up questions and final diagnostics.
   - Added a verification test in `smoke_custom_role.py` to confirm successful curriculum creation and E2E interviewing for any subject.