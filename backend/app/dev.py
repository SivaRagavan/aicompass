import os

import uvicorn


def main() -> None:
    host = os.getenv("HOST", "localhost")
    port = int(os.getenv("PORT", "4001"))
    uvicorn.run("app.main:app", host=host, port=port, reload=True)


if __name__ == "__main__":
    main()
