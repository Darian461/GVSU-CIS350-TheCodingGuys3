from sqlalchemy import Column, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from .database import Base




class WeightLog(Base):
    __tablename__ = "weight_log"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("Users.id"), nullable=False)

    weight = Column(Float, nullable=False)

    # allow frontend to send date OR fallback to utcnow
    logged_at = Column(DateTime, default=datetime.utcnow)
