from datetime import datetime, timedelta

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database

from app.db.mongodb import get_db
from app.db.models import AssessmentDocument, ExecProfileDocument, AssessmentUpdate
from app.schemas.assessments import (
    AssessmentCreate,
    AssessmentResponse,
    AssessmentUpdate as AssessmentUpdateSchema,
    InviteSnapshot,
    InviteUpdate,
)
from app.security import require_auth
from app.utils.tokens import generate_token

router = APIRouter(prefix="/api", tags=["assessments"])


@router.get("/assessments", response_model=list[AssessmentResponse])
async def list_assessments(
    user_id: str = Depends(require_auth),
    db: Database = Depends(get_db),
):
    assessments = list(
        db.assessments.find({"owner_id": user_id}).sort("created_at", -1)
    )
    return [
        AssessmentResponse(
            id=str(item["_id"]),
            company_name=item["company_name"],
            company_industry=item.get("company_industry"),
            company_size=item.get("company_size"),
            invite_token=item["invite_token"],
            invite_expires_at=item["invite_expires_at"],
            status=item.get("status", "active"),
            progress=item.get("progress"),
        )
        for item in assessments
    ]


@router.post("/assessments", response_model=AssessmentResponse)
async def create_assessment(
    payload: AssessmentCreate,
    user_id: str = Depends(require_auth),
    db: Database = Depends(get_db),
):
    invite_token = generate_token()
    expires_at = datetime.utcnow() + timedelta(days=payload.invite_days)

    document = AssessmentDocument.create(
        owner_id=user_id,
        company_name=payload.company_name,
        invite_token=invite_token,
        invite_expires_at=expires_at,
        company_industry=payload.company_industry,
        company_size=payload.company_size,
    )
    result = db.assessments.insert_one(document)

    return AssessmentResponse(
        id=str(result.inserted_id),
        company_name=payload.company_name,
        company_industry=payload.company_industry,
        company_size=payload.company_size,
        invite_token=invite_token,
        invite_expires_at=expires_at,
        status="active",
        progress=None,
    )


@router.get("/assessments/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: str,
    user_id: str = Depends(require_auth),
    db: Database = Depends(get_db),
):
    assessment = db.assessments.find_one({"_id": ObjectId(assessment_id)})
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    if assessment.get("owner_id") != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    return AssessmentResponse(
        id=str(assessment["_id"]),
        company_name=assessment["company_name"],
        company_industry=assessment.get("company_industry"),
        company_size=assessment.get("company_size"),
        invite_token=assessment["invite_token"],
        invite_expires_at=assessment["invite_expires_at"],
        status=assessment.get("status", "active"),
        progress=assessment.get("progress"),
    )


@router.patch("/assessments/{assessment_id}")
async def update_assessment(
    assessment_id: str,
    payload: AssessmentUpdateSchema,
    user_id: str = Depends(require_auth),
    db: Database = Depends(get_db),
):
    assessment = db.assessments.find_one({"_id": ObjectId(assessment_id)})
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    if assessment.get("owner_id") != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    update = AssessmentUpdate({})
    if payload.status is not None:
        update.set("status", payload.status)
    if payload.company_name is not None:
        update.set("company_name", payload.company_name)
    if payload.company_industry is not None:
        update.set("company_industry", payload.company_industry)
    if payload.company_size is not None:
        update.set("company_size", payload.company_size)
    if payload.invite_days is not None:
        update.set(
            "invite_expires_at",
            datetime.utcnow() + timedelta(days=payload.invite_days),
        )

    db.assessments.update_one({"_id": assessment["_id"]}, update.to_update())
    return {"ok": True}


@router.get("/invite/{token}", response_model=InviteSnapshot)
async def get_invite(token: str, db: Database = Depends(get_db)):
    assessment = db.assessments.find_one({"invite_token": token})
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    if assessment.get("status") != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Assessment cancelled"
        )
    if assessment.get("invite_expires_at") < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invite expired"
        )

    return InviteSnapshot(
        company_name=assessment["company_name"],
        company_industry=assessment.get("company_industry"),
        company_size=assessment.get("company_size"),
        exec_profile=assessment.get("exec_profile"),
        selections=assessment.get("selections"),
        scores=assessment.get("scores"),
        responses=assessment.get("responses"),
        progress=assessment.get("progress"),
        status=assessment.get("status", "active"),
    )


@router.patch("/invite/{token}")
async def update_invite(
    token: str, payload: InviteUpdate, db: Database = Depends(get_db)
):
    assessment = db.assessments.find_one({"invite_token": token})
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    if assessment.get("status") != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Assessment cancelled"
        )
    if assessment.get("invite_expires_at") < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invite expired"
        )

    update = AssessmentUpdate({})
    if payload.status == "completed":
        update.set("status", "completed")
    if payload.company_name is not None:
        update.set("company_name", payload.company_name)
    if payload.company_industry is not None:
        update.set("company_industry", payload.company_industry)
    if payload.company_size is not None:
        update.set("company_size", payload.company_size)
    if payload.exec_profile is not None:
        update.set(
            "exec_profile",
            ExecProfileDocument.create(
                name=payload.exec_profile.name,
                title=payload.exec_profile.title,
                email=payload.exec_profile.email,
            ),
        )
    if payload.selections is not None:
        update.set("selections", payload.selections)
    if payload.scores is not None:
        update.set("scores", payload.scores)
    if payload.responses is not None:
        update.set("responses", payload.responses)
    if payload.progress is not None:
        update.set(
            "progress",
            {
                "completed_metrics": payload.progress.completed_metrics,
                "total_metrics": payload.progress.total_metrics,
                "percent": payload.progress.percent,
                "updated_at": payload.progress.updated_at,
            },
        )

    db.assessments.update_one({"_id": assessment["_id"]}, update.to_update())
    return {"ok": True}
