# AI Interview Agent Backend

FastAPI service for the hackathon interview endpoint.

## API

`POST /api/interview`

Initial turn:

```json
{ "sessionId": "abc-123", "candidate": { "member": { "id": "u1", "name": "Ada", "jobRole": "AI Engineer" }, "missions": [], "signals": { "commitDays": 0, "missionsCompleted": 0, "missionsFirstTry": 0 } } }
```

Follow-up turn:

```json
{ "sessionId": "abc-123", "message": "My answer..." }
```

Response:

```json
{ "reply": "Question text", "done": false }
```

Final response:

```json
{
  "reply": "Thank you for completing this technical interview. The session evaluation report is ready.",
  "done": true,
  "feedback": {
    "summary": "...",
    "strengths": ["..."],
    "gaps": ["..."],
    "next": ["..."]
  }
}
```

The backend also returns an additive `dayFocus` field on question turns so the current frontend can update coverage.

## Local Run

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

`GEMINI_API_KEY` enables Gemini-generated questions and feedback. Without it, the service uses deterministic fallback questions so local demos still run.

Health check:

```bash
curl http://localhost:8000/health
```

Init example:

```bash
curl -X POST http://localhost:8000/api/interview \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"demo-1","candidate":{"member":{"id":"u1","name":"Ada Lovelace","jobRole":"AI Engineer","yearsExperience":4,"education":"BS"},"missions":[{"day":7,"title":"Embeddings Explained","passed":true,"attempts":1},{"day":27,"title":"Security","skipped":true}],"signals":{"commitDays":24,"missionsCompleted":1,"missionsFirstTry":1}}}'
```

## Deployment

Set environment variables on Railway or Cloud Run:

- `GEMINI_API_KEY`
- `ALLOWED_ORIGINS`
- `MODEL_NAME`
- `PORT`

Build from `backend/Dockerfile`.
