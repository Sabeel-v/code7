from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from models.hrm import LeaveStatus

class EmployeeBase(BaseModel):
    department: Optional[str] = None
    designation: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    user_id: int

class EmployeeResponse(EmployeeBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class LeaveRequestBase(BaseModel):
    start_date: date
    end_date: date
    reason: str

class LeaveRequestCreate(LeaveRequestBase):
    pass

class LeaveRequestResponse(LeaveRequestBase):
    id: int
    employee_id: int
    status: LeaveStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
