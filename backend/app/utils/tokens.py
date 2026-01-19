from bson import ObjectId


def generate_token() -> str:
    return ObjectId().binary.hex()
