from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy_utils import database_exists, create_database
from .settings import DATABASE_URL

Base = declarative_base()

# Create database if it doesn't exist
if not database_exists(DATABASE_URL):
    create_database(DATABASE_URL)

engine = create_engine(DATABASE_URL, pool_size=50, echo=False)
SessionLocal = sessionmaker(bind=engine)

def get_session():
    return SessionLocal()



