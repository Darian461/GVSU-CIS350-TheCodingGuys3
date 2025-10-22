from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

url = os.getenv("DATABASE_URL")
print("Connecting to:", url)

try:
    engine = create_engine(url)
    with engine.connect() as conn:
        print("✅ Connection successful!")
except Exception as e:
    print("❌ Connection failed:", e)

