from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class WeightLogCreate(BaseModel):
    weight: float 

class WeightLogOut(BaseModel):
    id: UUID
    weight: float
    logged_at: datetime

    class Config:
        orm_mode = True