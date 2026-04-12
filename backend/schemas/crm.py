from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models.crm import LeadStatus

# Leads
class LeadBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class LeadUpdate(LeadBase):
    name: Optional[str] = None
    status: Optional[LeadStatus] = None

class LeadResponse(LeadBase):
    id: int
    status: LeadStatus
    assigned_to: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Activity History
class ActivityHistoryBase(BaseModel):
    description: str

class ActivityHistoryResponse(ActivityHistoryBase):
    id: int
    customer_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Customer
class CustomerBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None

class CustomerResponse(CustomerBase):
    id: int
    lead_id: int
    created_at: datetime
    updated_at: datetime
    activities: List[ActivityHistoryResponse] = []

    class Config:
        orm_mode = True
