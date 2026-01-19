from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.mongodb import connect_db, close_db
from app.routes import auth, assessments, users
from app.utils.cors import get_allowed_origins


@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_db()
    yield
    close_db()


app = FastAPI(title="AI Compass API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(assessments.router)


@app.get("/")
async def root():
    return {"message": "Welcome to AI Compass API"}


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "4001"))
    uvicorn.run(app, host=host, port=port)
