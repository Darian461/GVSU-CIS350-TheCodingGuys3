from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database
from models import Base
from settings import postgresql as settings




def get_engine(user, passwd, host, port, db):
    url = f"postgresql://{user}:{passwd}@{host}:{port}/{db}"
    if not database_exists(url):
        create_database(url)
    engine = create_engine(url, pool_size=50, echo=False)
    return engine

# Initialize engine 
engine = get_engine(
    settings['pguser'],
    settings['pgpassword'],
    settings['pghost'],
    settings['pgport'],
    settings['pgdb']
)

Base.metadata.create_all(bind=engine)

# Create a sessionmaker bound to the engine
SessionLocal = sessionmaker(bind=engine)

def get_session():
    return SessionLocal()
