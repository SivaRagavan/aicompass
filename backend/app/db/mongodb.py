import os
from pymongo import MongoClient, ASCENDING
from pymongo.database import Database

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("MONGODB_DB", "aicompass")

client: MongoClient | None = None
db: Database | None = None


def connect_db() -> None:
    global client, db
    client = MongoClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    db.users.create_index([("email", ASCENDING)], unique=True)
    db.assessments.create_index([("owner_id", ASCENDING)])
    db.assessments.create_index([("invite_token", ASCENDING)], unique=True)


def close_db() -> None:
    global client
    if client:
        client.close()


def get_db() -> Database:
    if db is None:
        raise RuntimeError("Database not initialized")
    return db
