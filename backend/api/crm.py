from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.user import User, UserRole
from models.crm import Customer
from schemas.crm import CustomerResponse
from api.dependencies import get_current_user, require_roles

router = APIRouter(prefix="/crm", tags=["CRM"])

@router.get("/customers", response_model=List[CustomerResponse])
def get_customers(db: Session = Depends(get_db), current_user: User = Depends(require_roles([UserRole.Admin, UserRole.Sales_Manager, UserRole.Sales_Executive]))):
    # Retrieve only personal customers for Sales Executives
    if current_user.role == UserRole.Sales_Executive:
        return db.query(Customer).filter(Customer.created_by == current_user.id).all()
        
    return db.query(Customer).all()
