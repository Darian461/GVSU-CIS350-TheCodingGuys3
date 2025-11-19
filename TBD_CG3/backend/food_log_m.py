import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from .database import Base

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
