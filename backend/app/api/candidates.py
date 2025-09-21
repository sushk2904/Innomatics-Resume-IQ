from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import List, Optional
import json
from datetime import datetime

router = APIRouter()

# Mock database for candidates
candidates_db = [
    {
        "id": 1,
        "name": "Sarah Johnson",
        "email": "sarah.johnson@email.com",
        "phone": "+1-555-0123",
        "location": "San Francisco, CA",
        "job_id": 1,
        "resume_filename": "sarah_resume.pdf",
        "overall_score": 92,
        "verdict": "High",
        "matched_skills": ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
        "missing_skills": ["Docker", "Kubernetes"],
        "status": "analyzed",
        "applied_at": "2024-01-15T10:30:00Z"
    },
    {
        "id": 2,
        "name": "Emily Rodriguez",
        "email": "emily.rodriguez@email.com", 
        "phone": "+1-555-0124",
        "location": "Austin, TX",
        "job_id": 1,
        "resume_filename": "emily_resume.pdf",
        "overall_score": 85,
        "verdict": "High",
        "matched_skills": ["React", "JavaScript", "Node.js", "CSS"],
        "missing_skills": ["TypeScript", "GraphQL"],
        "status": "analyzed",
        "applied_at": "2024-01-13T14:20:00Z"
    },
    {
        "id": 3,
        "name": "Michael Chen",
        "email": "michael.chen@email.com",
        "phone": "+1-555-0125", 
        "location": "New York, NY",
        "job_id": 2,
        "resume_filename": "michael_resume.pdf",
        "overall_score": 78,
        "verdict": "Medium",
        "matched_skills": ["Python", "Django", "SQL", "Git"],
        "missing_skills": ["React", "AWS"],
        "status": "analyzed",
        "applied_at": "2024-01-14T09:15:00Z"
    },
    {
        "id": 4,
        "name": "David Kim",
        "email": "david.kim@email.com",
        "phone": "+1-555-0126",
        "location": "Seattle, WA", 
        "job_id": 2,
        "resume_filename": "david_resume.pdf",
        "overall_score": 65,
        "verdict": "Medium",
        "matched_skills": ["Java", "Spring", "MySQL"],
        "missing_skills": ["React", "JavaScript"],
        "status": "analyzed",
        "applied_at": "2024-01-12T16:45:00Z"
    },
    {
        "id": 5,
        "name": "Lisa Wang",
        "email": "lisa.wang@email.com",
        "phone": "+1-555-0127",
        "location": "Los Angeles, CA",
        "job_id": 1,
        "resume_filename": "lisa_resume.pdf", 
        "overall_score": 45,
        "verdict": "Low",
        "matched_skills": ["HTML", "CSS", "JavaScript"],
        "missing_skills": ["React", "TypeScript", "Node.js"],
        "status": "analyzed",
        "applied_at": "2024-01-11T11:30:00Z"
    }
]

@router.get("/")
async def get_candidates(
    skip: int = 0,
    limit: int = 100,
    job_id: Optional[int] = None,
    status: Optional[str] = None
):
    """Get all candidates with filtering"""
    filtered_candidates = candidates_db.copy()
    
    # Filter by job_id if provided
    if job_id:
        filtered_candidates = [c for c in filtered_candidates if c["job_id"] == job_id]
    
    # Filter by status if provided
    if status:
        filtered_candidates = [c for c in filtered_candidates if c["status"] == status]
    
    # Apply pagination
    paginated = filtered_candidates[skip:skip + limit]
    
    return {
        "total": len(filtered_candidates),
        "candidates": paginated,
        "message": "Candidates retrieved successfully"
    }

@router.post("/upload")
async def upload_resume(
    name: str = Form(...),
    email: str = Form(...), 
    phone: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    job_id: int = Form(...),
    file: UploadFile = File(...)
):
    """Upload candidate resume"""
    
    # Validate file type
    if not file.filename.lower().endswith(('.pdf', '.docx', '.doc')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are allowed")
    
    # Check if candidate already exists
    existing = next((c for c in candidates_db if c["email"] == email), None)
    if existing:
        raise HTTPException(status_code=400, detail="Candidate with this email already exists")
    
    # Create new candidate
    candidate = {
        "id": len(candidates_db) + 1,
        "name": name,
        "email": email,
        "phone": phone,
        "location": location,
        "job_id": job_id,
        "resume_filename": file.filename,
        "overall_score": None,
        "verdict": None,
        "matched_skills": [],
        "missing_skills": [],
        "status": "uploaded",
        "applied_at": datetime.now().isoformat()
    }
    
    candidates_db.append(candidate)
    
    return {
        "message": "✅ Resume uploaded successfully",
        "candidate": candidate
    }

@router.get("/{candidate_id}")
async def get_candidate(candidate_id: int):
    """Get specific candidate"""
    candidate = next((c for c in candidates_db if c["id"] == candidate_id), None)
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    return candidate

@router.patch("/{candidate_id}/status")
async def update_candidate_status(candidate_id: int, status: str):
    """Update candidate status"""
    valid_statuses = ["uploaded", "analyzed", "shortlisted", "rejected", "hired"]
    
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    candidate = next((c for c in candidates_db if c["id"] == candidate_id), None)
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    candidate["status"] = status
    return {
        "message": f"✅ Status updated to {status}",
        "candidate": candidate
    }

@router.get("/stats/dashboard")
async def get_dashboard_stats():
    """Get dashboard statistics for candidate overview"""
    total = len(candidates_db)
    high_match = len([c for c in candidates_db if c.get("verdict") == "High"])
    medium_match = len([c for c in candidates_db if c.get("verdict") == "Medium"]) 
    low_match = len([c for c in candidates_db if c.get("verdict") == "Low"])
    
    # Calculate average score
    scores = [c["overall_score"] for c in candidates_db if c["overall_score"] is not None]
    avg_score = sum(scores) / len(scores) if scores else 0
    
    return {
        "total_candidates": total,
        "high_match": high_match,
        "medium_match": medium_match,
        "low_match": low_match,
        "processed_today": total,
        "avg_score": round(avg_score, 1)
    }

@router.delete("/{candidate_id}")
async def delete_candidate(candidate_id: int):
    """Delete a candidate"""
    global candidates_db
    candidate = next((c for c in candidates_db if c["id"] == candidate_id), None)
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    candidates_db = [c for c in candidates_db if c["id"] != candidate_id]
    
    return {"message": f"✅ Candidate {candidate['name']} deleted successfully"}
