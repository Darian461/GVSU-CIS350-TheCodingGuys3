from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import models, schemas, auth
from .database import engine, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from . import food_api
from .weight_log_r import router as weight_router
from .food_log_r import router as log_router



models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(food_api.router)
app.include_router(weight_router, prefix="/weight", tags=["Weights"])
app.include_router(log_router, prefix="/food_log", tags=["Food_Log"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = auth.hash_password(user.password)
    new_user = models.User(username=user.username, email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    # Try matching either by email OR username
    db_user = (
        db.query(models.User)
        .filter(
            (models.User.email == user.identifier)
            | (models.User.username == user.identifier)
        )
        .first()
    )

    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth.create_access_token({"sub": str(db_user.id)})
    return {"access_token": token, "token_type": "bearer"}

