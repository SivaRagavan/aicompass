import os


def get_allowed_origins() -> list[str]:
    origins = [
        "http://localhost:8001",
        "http://127.0.0.1:8001",
        "https://aicompass.co",
    ]
    extra = os.getenv("CLIENT_ORIGIN")
    if extra and extra not in origins:
        origins.append(extra)
    return origins
