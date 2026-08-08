# AI Interview Agent

Hackathon interview agent with a Next.js frontend and a FastAPI backend.

Backend docs: [backend/README.md](backend/README.md)

Prompt/history log: [PROMPTS.md](PROMPTS.md)

## Getting Started

Run the backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Run the frontend in another terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend reads `NEXT_PUBLIC_BACKEND_URL` from `frontend/.env.local` and posts interview turns to `http://localhost:8000/api/interview` by default.

## API

The live backend contract is:

```txt
POST /api/interview
```

Initial turn:

```json
{ "sessionId": "abc-123", "candidate": { "...": "candidate object" } }
```

Follow-up turns:

```json
{ "sessionId": "abc-123", "message": "candidate answer" }
```

The final response includes `feedback.summary`, `feedback.strengths`, `feedback.gaps`, and `feedback.next`.
