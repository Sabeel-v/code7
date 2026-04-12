from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from models.base import AuditMixin

class Employee(Base, AuditMixin):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    department = Column(String, nullable=True)
    designation = Column(String, nullable=True)

    user = relationship("User", back_populates="employee_profile")
    leave_requests = relationship("LeaveRequest", back_populates="employee", cascade="all, delete-orphan")

class LeaveStatus(str, __import__('enum').Enum):
    Pending = "Pending"
    Approved = "Approved"
    Rejected = "Rejected"

class LeaveRequest(Base, AuditMixin):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    start_date = Column(__import__('sqlalchemy').Date, nullable=False)
    end_date = Column(__import__('sqlalchemy').Date, nullable=False)
    reason = Column(String, nullable=False)
    status = Column(__import__('sqlalchemy').Enum(LeaveStatus), default=LeaveStatus.Pending, nullable=False)

    employee = relationship("Employee", back_populates="leave_requests")
