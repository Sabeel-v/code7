from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
import enum
from database import Base
from models.base import AuditMixin

class LeadStatus(str, enum.Enum):
    New = "New"
    Contacted = "Contacted"
    Qualified = "Qualified"
    Converted = "Converted"
    Lost = "Lost"

class Lead(Base, AuditMixin):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    status = Column(Enum(LeadStatus), default=LeadStatus.New, nullable=False)
    
    # Manager or Admin assigns default None -> assigned_to User (Sales Exec)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    assignee = relationship("User", foreign_keys=[assigned_to])
    customer = relationship("Customer", back_populates="lead", uselist=False)

class Customer(Base, AuditMixin):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), unique=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    
    lead = relationship("Lead", back_populates="customer")
    activities = relationship("ActivityHistory", back_populates="customer", cascade="all, delete-orphan")

class ActivityHistory(Base, AuditMixin):
    __tablename__ = "activity_history"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    description = Column(Text, nullable=False)
    
    customer = relationship("Customer", back_populates="activities")
