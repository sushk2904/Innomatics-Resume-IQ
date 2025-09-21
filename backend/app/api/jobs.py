from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    requirements: Optional[str] = None
    skills_required: List[str] = []
    skills_preferred: List[str] = []
    location: Optional[str] = None
    experience_min: int = 0
    experience_max: int = 10

class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    skills_required: Optional[List[str]] = None
    skills_preferred: Optional[List[str]] = None
    location: Optional[str] = None
    experience_min: Optional[int] = None
    experience_max: Optional[int] = None
    is_active: Optional[bool] = None

# Mock jobs database
jobs_db = [
    {
        "id": 1,
        "title": "Frontend Developer",
        "company": "Tech Corp",
        "description": "We are looking for a skilled React developer to join our dynamic team. The ideal candidate will have experience building responsive web applications using modern frontend technologies.",
        "requirements": "Bachelor's degree in Computer Science or related field. Strong problem-solving skills and attention to detail.",
        "skills_required": ["React", "JavaScript", "HTML", "CSS", "TypeScript"],
        "skills_preferred": ["Node.js", "GraphQL", "Docker", "AWS", "Jest"],
        "location": "Remote",
        "experience_min": 2,
        "experience_max": 5,
        "is_active": True,
        "created_at": "2024-01-10T09:00:00Z",
        "candidates_count": 3
    },
    {
        "id": 2,
        "title": "Python Developer",
        "company": "AI Solutions",
        "description": "Seeking an experienced Python developer for ML and backend development projects. You will work on cutting-edge AI applications and scalable web services.",
        "requirements": "3+ years of Python development experience. Experience with machine learning frameworks preferred.",
        "skills_required": ["Python", "Django", "PostgreSQL", "Git"],
        "skills_preferred": ["Machine Learning", "TensorFlow", "Docker", "Redis", "Celery"],
        "location": "Bangalore, India",
        "experience_min": 3,
        "experience_max": 7,
        "is_active": True,
        "created_at": "2024-01-08T14:30:00Z",
        "candidates_count": 2
    },
    {
        "id": 3,
        "title": "Full Stack Developer",
        "company": "StartupXYZ",
        "description": "Join our fast-growing startup as a full-stack developer. Work on both frontend and backend technologies to build innovative products.",
        "requirements": "Experience with both frontend and backend technologies. Startup mindset and ability to work in a fast-paced environment.",
        "skills_required": ["JavaScript", "React", "Node.js", "MongoDB"],
        "skills_preferred": ["TypeScript", "AWS", "Docker", "Redis"],
        "location": "San Francisco, CA",
        "experience_min": 1,
        "experience_max": 4,
        "is_active": True,
        "created_at": "2024-01-12T11:15:00Z",
        "candidates_count": 0
    }
]

@router.get("/")
async def get_jobs(skip: int = 0, limit: int = 100, is_active: Optional[bool] = None):
    """Get all job descriptions"""
    filtered_jobs = jobs_db.copy()
    
    # Filter by active status if provided
    if is_active is not None:
        filtered_jobs = [job for job in filtered_jobs if job["is_active"] == is_active]
    
    # Apply pagination
    paginated = filtered_jobs[skip:skip + limit]
    
    return {
        "total": len(filtered_jobs),
        "jobs": paginated
    }

@router.post("/")
async def create_job(job: JobCreate):
    """Create new job description"""
    new_job = {
        "id": len(jobs_db) + 1,
        **job.dict(),
        "is_active": True,
        "created_at": datetime.now().isoformat(),
        "candidates_count": 0
    }
    
    jobs_db.append(new_job)
    
    return {
        "message": "✅ Job created successfully",
        "job": new_job
    }

@router.get("/{job_id}")
async def get_job(job_id: int):
    """Get specific job"""
    job = next((j for j in jobs_db if j["id"] == job_id), None)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return job

@router.patch("/{job_id}")
async def update_job(job_id: int, job_update: JobUpdate):
    """Update job description"""
    job = next((j for j in jobs_db if j["id"] == job_id), None)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Update only provided fields
    update_data = job_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        job[field] = value
    
    return {
        "message": "✅ Job updated successfully",
        "job": job
    }

@router.delete("/{job_id}")
async def delete_job(job_id: int):
    """Delete job description"""
    global jobs_db
    job = next((j for j in jobs_db if j["id"] == job_id), None)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    jobs_db = [j for j in jobs_db if j["id"] != job_id]
    
    return {"message": f"✅ Job '{job['title']}' deleted successfully"}

@router.patch("/{job_id}/toggle-status")
async def toggle_job_status(job_id: int):
    """Toggle job active/inactive status"""
    job = next((j for j in jobs_db if j["id"] == job_id), None)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job["is_active"] = not job["is_active"]
    status = "activated" if job["is_active"] else "deactivated"
    
    return {
        "message": f"✅ Job {status} successfully",
        "job": job
    }

@router.get("/{job_id}/candidates")
async def get_job_candidates(job_id: int):
    """Get candidates for specific job"""
    # Import here to avoid circular imports
    from app.api.candidates import candidates_db
    
    job = next((j for j in jobs_db if j["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job_candidates = [c for c in candidates_db if c["job_id"] == job_id]
    
    return {
        "job": job,
        "total_candidates": len(job_candidates),
        "candidates": job_candidates
    }