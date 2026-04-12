from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.user import User, UserRole
from models.crm import Lead, LeadStatus, Customer, ActivityHistory
from schemas.crm import LeadCreate, LeadUpdate, LeadResponse
from api.dependencies import get_current_user, require_roles

router = APIRouter(prefix="/leads", tags=["Leads"])

@router.post("/", response_model=LeadResponse)
def create_lead(lead: LeadCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_lead = Lead(**lead.dict(), created_by=current_user.id)
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.get("/", response_model=List[LeadResponse])
def get_leads(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Simple role-based filter could be implemented here
    # For now, return all leads
    return db.query(Lead).all()

@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(lead_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@router.put("/{lead_id}", response_model=LeadResponse)
def update_lead(lead_id: int, lead_in: LeadUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    for var, value in vars(lead_in).items():
        if value is not None:
            setattr(db_lead, var, value)
            
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.post("/{lead_id}/assign")
def assign_lead(lead_id: int, user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_roles([UserRole.Admin, UserRole.Sales_Manager]))):
    db_lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    user_to_assign = db.query(User).filter(User.id == user_id).first()
    if user_to_assign is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    db_lead.assigned_to = user_to_assign.id
    db.commit()
    return {"message": "Lead assigned successfully"}

@router.post("/{lead_id}/convert")
def convert_lead(lead_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_roles([UserRole.Admin, UserRole.Sales_Manager, UserRole.Sales_Executive]))):
    db_lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    if db_lead.status == LeadStatus.Converted:
        raise HTTPException(status_code=400, detail="Lead already converted")
        
    # Create new customer
    new_customer = Customer(
        lead_id=db_lead.id,
        name=db_lead.name,
        email=db_lead.email,
        phone=db_lead.phone,
        company=db_lead.company,
        created_by=current_user.id
    )
    db.add(new_customer)
    db.flush() # flush to get customer ID
    
    # Create Activity History
    activity = ActivityHistory(
        customer_id=new_customer.id,
        description=f"Lead {db_lead.name} was converted to customer by {current_user.full_name}.",
        created_by=current_user.id
    )
    db.add(activity)
    
    # Update lead status
    db_lead.status = LeadStatus.Converted
    db.commit()
    
    return {"message": "Lead converted to Customer successfully", "customer_id": new_customer.id}
