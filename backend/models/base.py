import datetime
from sqlalchemy import Column, DateTime, Integer, event

class AuditMixin:
    """Mixin for adding audit fields to models."""
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)
    created_by = Column(Integer, nullable=True)  # Populated manually in API routes via currentUser

    # Note: If we had a strict requirement for database-level logging of created_by,
    # we would need session events or passing the user to every model insertion. 
    # Having it filled out by API router logic is standard and simpler.
