from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
import enum
from database import Base
from models.base import AuditMixin

class UserRole(enum.Enum):
    Admin = "Admin"
    Sales_Manager = "Sales Manager"
    Sales_Executive = "Sales Executive"
    HR_Executive = "HR Executive"
    Employee = "Employee"

class User(Base, AuditMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.Employee, nullable=False)
    
    employee_profile = relationship("Employee", back_populates="user", uselist=False, cascade="all, delete-orphan")
