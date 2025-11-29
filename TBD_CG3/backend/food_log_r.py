from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional 
from datetime import date, timedelta 
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
        "total_fiber": sum(log.fiber for log in logs),
        "total_trans_fat": sum(log.trans_fat for log in logs),
        "total_saturated_fat": sum(log.saturated_fat for log in logs),
        "total_sugar": sum(log.sugar for log in logs),
        "total_added_sugars": sum(log.added_sugars for log in logs),
        "total_cholesterol": sum(log.cholesterol for log in logs),
        "total_sodium": sum(log.sodium for log in logs),
        "total_calcium": sum(log.calcium for log in logs),
        "total_iron": sum(log.iron for log in logs),
        "total_potassium": sum(log.potassium for log in logs),
        "total_caffeine": sum(log.caffeine for log in logs),
        "items_logged": len(logs)
    }

    return totals

# Get daily historical data
@router.get("/history/daily-totals")
def get_daily_totals_history(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id)
):
    if end_date is None:
        end_date = date.today()
    if start_date is None:
        start_date = end_date - timedelta(days=30)
    
    logs = db.query(models.FoodLog).filter(
        models.FoodLog.user_id == current_user["id"],
        models.FoodLog.date >= start_date,
        models.FoodLog.date <= end_date
    ).all()
    
    # Aggregate by date
    daily_totals = {}
    for log in logs:
        date_str = str(log.date)
        if date_str not in daily_totals:
            daily_totals[date_str] = {
                "date": date_str,
                "calories": 0,
                "protein": 0,
                "carbs": 0,
                "fat": 0,
                "items_count": 0
            }
        
        daily_totals[date_str]["calories"] += log.calories * log.quantity
        daily_totals[date_str]["protein"] += log.protein * log.quantity
        daily_totals[date_str]["carbs"] += log.carbs * log.quantity
        daily_totals[date_str]["fat"] += log.fat * log.quantity
        daily_totals[date_str]["items_count"] += 1
    
    result = sorted(daily_totals.values(), key=lambda x: x["date"])
    return result

