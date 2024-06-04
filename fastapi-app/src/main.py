from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI

from src.service.user_service import loginUser


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger = logging.getLogger("uvicorn.access")
    handler = logging.StreamHandler()
    handler.setFormatter(
        logging.Formatter(
            """%(asctime)s %(levelname)s: %(message)s
            "trace":{"trace_id":"%(otelTraceID)s","span_id":"%(otelSpanID)s"}"""
        )
    )
    logger.addHandler(handler)
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/api/v1/user")
async def getUser(name: str, email: str, password: str):
    try:
        user = await loginUser(name, email, password)
        return user
    except Exception as err:
        print(err)
