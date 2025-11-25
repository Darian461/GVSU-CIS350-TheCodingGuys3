from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .weight_log_m import WeightLog
from .weight_log_s import WeightLogCreate, WeightLogOut
from .auth import get_current_user_id
import uuid

router = APIRouter()

@router.post("/", response_model=WeightLogOut)
def log_weight(
    data: WeightLogCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id)
):
    log = WeightLog(
        id=uuid.uuid4(),
        user_id=current_user["id"],
        weight=data.weight
    )

    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.get("/", response_model=list[WeightLogOut])
def get_weight_history(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id)
):
    return (
        db.query(WeightLog)
        .filter(WeightLog.user_id == current_user["id"])
        .order_by(WeightLog.logged_at.desc())
        .all()
    )
