import os
import httpx
from fastapi import APIRouter, Query
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
USDA_API_KEY = os.getenv("USDA_API_KEY")

@router.get("/search-food/")
async def search_food(query: str = Query(..., description="Food name to search")):
    """Search for foods using the USDA FoodData Central API"""
    url = f"https://api.nal.usda.gov/fdc/v1/foods/search"
    params = {"api_key": USDA_API_KEY, "query": query}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()

    return data
