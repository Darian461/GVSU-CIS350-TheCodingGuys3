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
        "Energy": "Calories",
        "Total lipid (fat)": "Fat",
        "Fatty acids, total trans": "Trans Fat",
        "Fatty acids, total saturated": "Saturated Fat",
        "Carbohydrate, by difference": "Carbs",
        "Fiber, total dietary": "Fiber",
        "Sugars, total including NLEA": "Sugar",
        "Sugars, added": "Added Sugar",
        "Protein": "Protein",
        "Cholesterol": "Cholesterol",
        "Sodium, Na": "Sodium",
        "Vitamin A, RAE": "Vitamin A",
        "Vitamin C, total ascorbic acid": "Vitamin C",
        "Calcium, Ca": "Calcium",
        "Iron, Fe": "Iron",
        "Potassium, K": "Potassium",
        "Caffeine": "Caffeine",
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
