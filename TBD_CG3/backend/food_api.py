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

    # Return search results
    results = []
    for item in data.get("foods", []):
        results.append({
            "fdcId": item["fdcId"],
            "description": item["description"],
            "brandName": item.get("brandName"),
        })
    return results


@router.get("/food-details/{fdc_id}")
async def get_food_details(fdc_id: int):
    """Fetch nutrient info for a single food using its FDC ID"""
    url = f"https://api.nal.usda.gov/fdc/v1/food/{fdc_id}"
    params = {"api_key": USDA_API_KEY}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()

    # Nutrients list
    desired_nutrients = {
        "Energy": "calories",
        "Total lipid (fat)": "fat",
        "Fatty acids, total trans": "trans fat",
        "Fatty acids, total saturated": "saturated fat",
        "Carbohydrate, by difference": "carbs",
        "Fiber, total dietary": "fiber",
        "Sugars, total including NLEA": "sugar",
        "Sugars, added": "added sugar",
        "Protein": "protein",
        "Cholesterol": "cholesterol",
        "Sodium, Na": "sodium",
        "Vitamin A, RAE": "vitamin a",
        "Vitamin C, total ascorbic acid": "vitamin c",
        "Calcium, Ca": "calcium",
        "Iron, Fe": "iron",
        "Potassium, K": "potassium",
        "Caffeine": "caffeine",
    }

    filtered = []
    for nutrient in data.get("foodNutrients", []):
        name = nutrient.get("nutrient", {}).get("name", "")
        if name in desired_nutrients:
            filtered.append({
                "label": desired_nutrients[name],
                "amount": nutrient.get("amount"),
                "unit": nutrient.get("nutrient", {}).get("unitName"),
            })

    return {
        "description": data.get("description"),
        "fdcId": data.get("fdcId"),
        "nutrients": filtered,
    }
