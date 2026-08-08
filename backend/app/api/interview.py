from __future__ import annotations

import logging
import time
from collections.abc import Callable
from typing import TypeVar

from fastapi import APIRouter, HTTPException
from pydantic import ValidationError

from app.models.schemas import ConversationTurn, InterviewFeedback, InterviewRequest, InterviewResponse
from app.services.feedback import generate_feedback
from app.services.interviewer import generate_next_turn, generate_opening_question, select_opening_day
from app.sessions.store import SESSION_STORE, SessionNotFoundError

router = APIRouter()
logger = logging.getLogger("interview_agent")
T = TypeVar("T")


def _with_retry(operation: Callable[[], T]) -> T:
    try:
        return operation()
    except Exception as first_exc:
        logger.warning("llm_operation_retrying", exc_info=first_exc)
        return operation()


@router.post("/interview")
def post_interview(body: dict) -> dict:
    start = time.perf_counter()
    try:
        request = InterviewRequest.model_validate(body)
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    day_focus: int | None = None
    response: InterviewResponse

    try:
        if request.candidate is not None:
            session = SESSION_STORE.create(request.sessionId, request.candidate)
            day_focus = select_opening_day(session.candidate_profile)
            session.asked_days.add(day_focus)
            session.question_count = 1
            reply = _with_retry(lambda: generate_opening_question(session.candidate_profile))
            session.history.append(ConversationTurn(role="interviewer", content=reply))
            response = InterviewResponse(reply=reply, done=False, dayFocus=day_focus)
        else:
            session = SESSION_STORE.require(request.sessionId)
            if session.awaiting_feedback:
                session.history.append(ConversationTurn(role="candidate", content=request.message or ""))
                feedback = _with_retry(lambda: generate_feedback(session))
                session.done = True
                response = InterviewResponse(
                    reply="Thank you for completing this technical interview. The session evaluation report is ready.",
                    done=True,
                    feedback=feedback,
                )
            else:
                reply, done, day_focus = _with_retry(
                    lambda: generate_next_turn(session, request.message or "")
                )
                response = InterviewResponse(reply=reply, done=done, dayFocus=day_focus)
    except SessionNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    latency_ms = round((time.perf_counter() - start) * 1000)
    logger.info(
        "interview_turn",
        extra={
            "session_id": request.sessionId,
            "latency_ms": latency_ms,
            "day_focus": day_focus,
            "done": response.done,
        },
    )
    return response.model_dump(exclude_none=True)
