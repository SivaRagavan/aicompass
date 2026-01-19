from __future__ import annotations

from datetime import datetime
from typing import Any, Optional


def now() -> datetime:
    return datetime.utcnow()


class UserDocument:
    @staticmethod
    def create(email: str, password: str) -> dict:
        return {
            "email": email,
            "password": password,
            "created_at": now(),
        }


class AssessmentDocument:
    @staticmethod
    def create(
        owner_id: str,
        company_name: str,
        invite_token: str,
        invite_expires_at: datetime,
        company_industry: Optional[str] = None,
        company_size: Optional[str] = None,
    ) -> dict:
        return {
            "owner_id": owner_id,
            "company_name": company_name,
            "company_industry": company_industry,
            "company_size": company_size,
            "invite_token": invite_token,
            "invite_expires_at": invite_expires_at,
            "status": "active",
            "created_at": now(),
            "updated_at": now(),
        }


class ExecProfileDocument:
    @staticmethod
    def create(name: str, title: str, email: str) -> dict:
        return {
            "name": name,
            "title": title,
            "email": email,
        }


class ProgressDocument:
    @staticmethod
    def create(
        completed_metrics: int,
        total_metrics: int,
        percent: int,
        updated_at: Optional[datetime] = None,
    ) -> dict:
        return {
            "completed_metrics": completed_metrics,
            "total_metrics": total_metrics,
            "percent": percent,
            "updated_at": updated_at or now(),
        }


class AssessmentUpdate:
    def __init__(self, payload: dict[str, Any]):
        self.payload = payload

    def set(self, key: str, value: Any) -> None:
        if value is not None:
            self.payload[key] = value

    def to_update(self) -> dict:
        self.payload["updated_at"] = now()
        return {"$set": self.payload}
