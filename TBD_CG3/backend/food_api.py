import os
import asyncio
import httpx
from fastapi import APIRouter, Query
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

router = APIRouter()
USDA_API_KEY = os.getenv("USDA_API_KEY")

search_cache = {}
food_cache = {}
CACHE_DURATION = timedelta(hours=24)

# function to help with retrying API calls
async def fetch_with_retry(url: str, params: dict, max_retries: int = 3, retry_delay: float = 1.0):
    
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)
                
                print(f"API request to {url} (attempt {attempt + 1}): status {response.status_code}")
                
                if response.status_code == 200:
                    try:
                        return response.json()
                    except Exception as json_error:
                        print(f"JSON parse error: {json_error}, response: {response.text[:200]}")
                        if attempt < max_retries - 1:
                            await asyncio.sleep(retry_delay)
                            continue
                        raise
            
                elif response.status_code in [500, 502, 503] and attempt < max_retries - 1:
                    print(f"Got {response.status_code} error, retrying in {retry_delay}s...")
                    await asyncio.sleep(retry_delay)
                    continue
                
                else:
                    print(f"API error: {response.text[:200]}")
                    response.raise_for_status()
                    
        except httpx.TimeoutException:
            print(f"Timeout (attempt {attempt + 1})")
            if attempt < max_retries - 1:
                await asyncio.sleep(retry_delay)
                continue
            raise
        except httpx.HTTPError as e:
            if attempt < max_retries - 1:
                await asyncio.sleep(retry_delay)
                continue
            raise
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            if attempt < max_retries - 1:
                await asyncio.sleep(retry_delay)
                continue
            raise
    
    raise Exception("Max retries exceeded")


@router.get("/search-food/")
async def search_food(query: str = Query(..., description="Food name to search")):
    """Search for foods using the USDA FoodData Central API"""
    
    # Check cache first
    cache_key = query.lower().strip()
    if cache_key in search_cache:
        cached_data, cache_time = search_cache[cache_key]
        if datetime.now() - cache_time < CACHE_DURATION:
            print(f"Returning cached search results for '{query}'")
            return cached_data
    
    url = "https://api.nal.usda.gov/fdc/v1/foods/search"
    params = {"api_key": USDA_API_KEY, "query": query}

    try:
        data = await fetch_with_retry(url, params)
    except Exception as e:
        print(f"Failed to fetch search results for '{query}': {str(e)}")
        return []

    results = []
    for item in data.get("foods", []):
        results.append({
            "fdcId": item["fdcId"],
            "description": item["description"],
            "brandName": item.get("brandName"),
        })
    
    # Store cache
    search_cache[cache_key] = (results, datetime.now())
    
    return results


@router.get("/food-details/{fdc_id}")
async def get_food_details(fdc_id: int):
    
    if fdc_id in food_cache:
        cached_data, cache_time = food_cache[fdc_id]
        if datetime.now() - cache_time < CACHE_DURATION:
            print(f"Returning cached data for fdcId {fdc_id}")
            return cached_data
    
    url = f"https://api.nal.usda.gov/fdc/v1/food/{fdc_id}"
    params = {"api_key": USDA_API_KEY}

    try:
        data = await fetch_with_retry(url, params)
    except Exception as e:
        print(f"Failed to fetch food details for {fdc_id}: {str(e)}")
        return {
            "error": f"Unable to load food data: {str(e)}",
            "description": "Food data unavailable",
            "fdcId": fdc_id,
            "nutrients": []
        }

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

    result = {
        "description": data.get("description", "Unknown"),
        "fdcId": data.get("fdcId", fdc_id),
        "nutrients": filtered,
    }
    
    food_cache[fdc_id] = (result, datetime.now())
    
    return result