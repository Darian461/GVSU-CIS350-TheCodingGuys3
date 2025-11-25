from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from .database import get_db
from .auth import get_current_user_id

router = APIRouter()

# Add a food to daily log
@router.post("/", response_model=schemas.FoodLogResponse)
def add_food_log(
    data: schemas.FoodLogCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user_id)
):
    log = models.FoodLog(
        user_id=current_user["id"],
        **data.dict()
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


# Get today’s logs
@router.get("/today", response_model=List[schemas.FoodLogResponse])
def get_today_logs(db: Session = Depends(get_db), current_user = Depends(get_current_user_id)):
    from datetime import date
    today = date.today()
    logs = db.query(models.FoodLog).filter(
        models.FoodLog.user_id == current_user["id"],
        models.FoodLog.date == today
    ).all()
    return logs


# Get daily totals
@router.get("/today/totals")
def get_today_totals(db: Session = Depends(get_db), current_user = Depends(get_current_user_id)):
    from datetime import date
    today = date.today()

    logs = db.query(models.FoodLog).filter(
        models.FoodLog.user_id == current_user["id"],
        models.FoodLog.date == today
    ).all()

    totals = {
        "date": str(today),
        "total_calories": sum(log.calories for log in logs),
        "total_protein": sum(log.protein for log in logs),
        "total_carbs": sum(log.carbs for log in logs),
        "total_fat": sum(log.fat for log in logs),
        "items_logged": len(logs)
    }

    return totals

