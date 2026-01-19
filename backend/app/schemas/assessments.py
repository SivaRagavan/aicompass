from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, EmailStr


class ExecProfile(BaseModel):
    name: str
    title: str
    email: EmailStr


class Progress(BaseModel):
    completed_metrics: int
    total_metrics: int
    percent: int
    updated_at: datetime


class AssessmentCreate(BaseModel):
    company_name: str
    company_industry: Optional[str] = None
    company_size: Optional[str] = None
    invite_days: int = 30


class AssessmentResponse(BaseModel):
    id: str
    company_name: str
    company_industry: Optional[str] = None
    company_size: Optional[str] = None
    invite_token: str
    invite_expires_at: datetime
    status: str
    progress: Optional[Progress] = None


class AssessmentUpdate(BaseModel):
    status: Optional[str] = None
    invite_days: Optional[int] = None
    company_name: Optional[str] = None
    company_industry: Optional[str] = None
    company_size: Optional[str] = None


class InviteSnapshot(BaseModel):
    company_name: str
    company_industry: Optional[str] = None
    company_size: Optional[str] = None
    exec_profile: Optional[ExecProfile] = None
    selections: Optional[Any] = None
    scores: Optional[Any] = None
    responses: Optional[Any] = None
    progress: Optional[Progress] = None
    status: str


class InviteUpdate(BaseModel):
    status: Optional[str] = None
    company_name: Optional[str] = None
    company_industry: Optional[str] = None
    company_size: Optional[str] = None
    exec_profile: Optional[ExecProfile] = None
    selections: Optional[Any] = None
    scores: Optional[Any] = None
    responses: Optional[Any] = None
    progress: Optional[Progress] = None
