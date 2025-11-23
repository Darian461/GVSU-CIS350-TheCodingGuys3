from pydantic import BaseModel
from uuid import UUID
from typing import List
from datetime import date

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    identifier: str  
    password: str

class UserOut(BaseModel):
    id: UUID
    username: str
    email: str

    class Config:
        from_attributes = True 

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
    id: UUID
    date: date

    model_config = {
        "from_attributes": True
    }