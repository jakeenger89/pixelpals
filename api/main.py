from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routers.authenticator import authenticator
from routers.pixel import router as pixel_router
from routers import accounts

app = FastAPI()
app.include_router(authenticator.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.environ.get("CORS_HOST", "http://localhost:3000")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/launch-details")
def launch_details():
    return {
        "launch_details": {
            "module": 3,
            "week": 17,
            "day": 5,
            "hour": 19,
            "min": "00"
        }
    }


app.include_router(pixel_router)
app.include_router(accounts.router, prefix="", tags=["accounts"])
