from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.user import User, UserRole
from models.hrm import Employee, LeaveRequest, LeaveStatus
from schemas.hrm import LeaveRequestCreate, LeaveRequestResponse, EmployeeProfileResponse
from api.dependencies import get_current_user, require_roles

router = APIRouter(prefix="/hrm", tags=["HRM"])

@router.get("/my-profile", response_model=EmployeeProfileResponse)
def get_my_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        employee = Employee(user_id=current_user.id, department=None, designation=current_user.role.value)
        db.add(employee)
        db.commit()
        db.refresh(employee)
    
    return {
        "id": employee.id,
        "department": employee.department,
        "designation": employee.designation,
        "joining_date": current_user.created_at,
        "full_name": current_user.full_name,
        "email": current_user.email
    }


@router.get("/employees", response_model=List[EmployeeProfileResponse])
def get_employees(db: Session = Depends(get_db), current_user: User = Depends(require_roles([UserRole.Admin, UserRole.HR_Executive]))):
    employees = db.query(Employee).all()
    result = []
    for emp in employees:
        result.append({
            "id": emp.id,
            "department": emp.department,
            "designation": emp.designation,
            "joining_date": emp.user.created_at,
            "full_name": emp.user.full_name,
            "email": emp.user.email
        })
    return result


@router.post("/leave-requests", response_model=LeaveRequestResponse)
def create_leave_request(leave_in: LeaveRequestCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        employee = Employee(user_id=current_user.id, department=None, designation=current_user.role.value)
        db.add(employee)
        db.commit()
        db.refresh(employee)
        
    db_leave = LeaveRequest(
        **leave_in.dict(),
        employee_id=employee.id,
        created_by=current_user.id
    )
    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)
    return db_leave

@router.get("/leave-requests", response_model=List[LeaveRequestResponse])
def list_leave_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role in [UserRole.Admin, UserRole.HR_Executive]:
        # HR/Admin can see all rules
        return db.query(LeaveRequest).all()
        
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        return []
    # Regular employees see only their requests
    return db.query(LeaveRequest).filter(LeaveRequest.employee_id == employee.id).all()

@router.post("/leave-requests/{leave_id}/approve")
def approve_leave_request(leave_id: int, status: str, db: Session = Depends(get_db), current_user: User = Depends(require_roles([UserRole.Admin, UserRole.HR_Executive]))):
    if status not in [LeaveStatus.Approved.value, LeaveStatus.Rejected.value]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be Approved or Rejected.")
        
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
        
    leave.status = status
    # Auditing the change could be setting updated_at (automatic) 
    # and possibly adding a 'handled_by' if we add to the schema later.
    db.commit()
    
    return {"message": f"Leave request {status.lower()} successfully."}
