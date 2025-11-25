from sqlalchemy import Column, String, Float, ForeignKey, Date, DateTime
from pydantic import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from .database import Base, engine
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "Users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)


class FoodLogBase(BaseModel):
    food_name: str
    calories: float
    fat: float
    trans_fat: float | None = 0
    saturated_fat: float | None = 0
    carbs: float
    fiber: float | None = 0
    sugar: float | None = 0
    added_sugars: float | None = 0
    protein: float
    cholesterol: float | None = 0
    sodium: float | None = 0
    vitamin_a: float | None = 0
    vitamin_c: float | None = 0
    calcium: float | None = 0
    iron: float | None = 0
    potassium: float | None = 0
    caffeine: float | None = 0
    quantity: float = 1

class FoodLogCreate(FoodLogBase):
    pass

class FoodLogResponse(FoodLogBase):
    id: str
    date: str

    class Config:
        orm_mode = True

class FoodLog(Base):
    __tablename__ = "food_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("Users.id"))

    food_name = Column(String, nullable=False)
    calories = Column(Float, nullable=False)
    fat = Column(Float, nullable=False)
    trans_fat = Column(Float, nullable=True)
    saturated_fat = Column(Float, nullable=True)
    carbs = Column(Float, nullable=False)
    fiber = Column(Float, nullable=True)
    sugar = Column(Float, nullable=True)
    added_sugars = Column(Float, nullable=True)
    protein = Column(Float, nullable=False)
    cholesterol = Column(Float, nullable=True)
    sodium = Column(Float, nullable=True)
    vitamin_a = Column(Float, nullable=True)
    vitamin_c = Column(Float, nullable=True)
    calcium = Column(Float, nullable=True)
    iron = Column(Float, nullable=True)
    potassium = Column(Float, nullable=True)
    caffeine = Column(Float, nullable=True)

    quantity = Column(Float, nullable=False, default=1)
    date = Column(Date, default=lambda: datetime.utcnow().date())