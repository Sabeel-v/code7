from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.crm import Lead, LeadStatus
from models.hrm import LeaveRequest, LeaveStatus, Employee
from models.user import User, UserRole
from api.dependencies import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_exec = current_user.role == UserRole.Sales_Executive
    
    if is_exec:
        total_leads = db.query(Lead).filter(Lead.assigned_to == current_user.id).count()
        converted_leads = db.query(Lead).filter(Lead.assigned_to == current_user.id, Lead.status == LeadStatus.Converted).count()
        recent_leads = db.query(Lead).filter(Lead.assigned_to == current_user.id).order_by(Lead.id.desc()).limit(5).all()
    else:
        total_leads = db.query(Lead).count()
        converted_leads = db.query(Lead).filter(Lead.status == LeadStatus.Converted).count()
        recent_leads = db.query(Lead).order_by(Lead.id.desc()).limit(5).all()
        
    # Pending Leaves and Global Employees
    pending_leaves = db.query(LeaveRequest).filter(LeaveRequest.status == LeaveStatus.Pending).count()
    total_employees = db.query(Employee).count()
    
    # Mock Revenue based on Converted Leads
    revenue = f"${converted_leads * 1.5}k" if converted_leads > 0 else "$0"
    
    activities = []
    for lead in recent_leads:
        activities.append({
            "id": lead.id,
            "title": f"New Lead: {lead.company or lead.name}",
            "status": lead.status.value,
            "time": "Recently"
        })

    # HR Activities (Pending leaves requiring action)
    pending_leave_list = db.query(LeaveRequest).filter(LeaveRequest.status == LeaveStatus.Pending).order_by(LeaveRequest.id.desc()).limit(5).all()
    hr_activities = []
    for l in pending_leave_list:
        hr_activities.append({
            "id": l.id,
            "title": f"Leave: {l.leave_type} (Emp ID: {l.employee_id})",
            "status": l.status.value,
            "time": str(l.start_date)
        })
        
    return {
        "stats": {
            "total_leads": total_leads,
            "pending_leaves": pending_leaves,
            "converted": converted_leads,
            "revenue": revenue,
            "total_employees": total_employees
        },
        "recent_activities": activities,
        "hr_activities": hr_activities
    }
