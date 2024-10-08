from contextlib import asynccontextmanager
import logging
import sys
import math
from concurrent.futures import ProcessPoolExecutor

import uvicorn.config
import uvicorn.logging
from fastapi import FastAPI, HTTPException
import pyroscope

from src.service.user_service import loginUser


pyroscope.configure(application_name="driver-app-2-fastapi", server_address="http://pyroscope:4040")

@asynccontextmanager
async def configure_loggers(app: FastAPI):
    root_logger = logging.getLogger()
    formatter = uvicorn.logging.ColourizedFormatter(
        """%(asctime)s:%(msecs)03d %(levelprefix)s%(message)s
            "trace":{"trace_id":"%(otelTraceID)s","span_id":"%(otelSpanID)s"}""",
        "%Y-%m-%d %H:%M:%S",
        use_colors=True,
    )

    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setLevel(logging.DEBUG)
    stdout_handler.setFormatter(formatter)
    stdout_handler.addFilter(lambda record: record.levelno <= logging.INFO)

    stderr_handler = logging.StreamHandler(sys.stderr)
    stderr_handler.setLevel(logging.WARNING)
    stderr_handler.setFormatter(formatter)

    root_logger.addHandler(stdout_handler)
    root_logger.addHandler(stderr_handler)

    accessLogger = logging.getLogger("uvicorn.access")
    handler = accessLogger.handlers[0]
    handler.setFormatter(formatter)
    yield


app = FastAPI(lifespan=configure_loggers)

def task(arg):
    return sum([math.sqrt(i) for i in range(1,arg)])

@app.get("/test")
async def test():
    logging.info("Start")
    with ProcessPoolExecutor(8) as exe:
        results = exe.map(task, range(1,50000))
        logging.info("Done")

@app.get("/api/v1/user")
async def getUser(name: str, email: str, password: str):
    logging.info("Calling get UserAPI")
    try:
        user = await loginUser(name, email, password)
        return user
    except Exception as err:
        logging.error(err)
        raise HTTPException(detail=str(err), status_code=500) from err


@app.get("/health")
async def health():
    return {"health": "ok"}
