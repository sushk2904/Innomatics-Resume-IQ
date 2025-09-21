from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any, Optional
import random
import time
import asyncio
from datetime import datetime

router = APIRouter()

# Mock analysis results storage
analysis_results = {}

@router.post("/analyze/{candidate_id}")
async def analyze_resume(
    candidate_id: int, 
    job_id: int,
    background_tasks: BackgroundTasks
):
    """Trigger resume analysis for candidate"""
    
    # Import here to avoid circular imports
    from app.api.candidates import candidates_db
    from app.api.jobs import jobs_db
    
    # Validate candidate and job exist
    candidate = next((c for c in candidates_db if c["id"] == candidate_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    job = next((j for j in jobs_db if j["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Start background analysis
    background_tasks.add_task(perform_analysis, candidate_id, job_id)
    
    # Update candidate status
    candidate["status"] = "analyzing"
    
    return {
        "message": "🔄 Analysis started",
        "candidate_id": candidate_id,
        "job_id": job_id,
        "status": "analyzing",
        "estimated_time": "2-3 minutes"
    }

async def perform_analysis(candidate_id: int, job_id: int):
    """Perform AI analysis (background task)"""
    
    # Simulate analysis processing time
    await asyncio.sleep(2)
    
    # Import here to avoid circular imports
    from app.api.candidates import candidates_db
    from app.api.jobs import jobs_db
    
    candidate = next((c for c in candidates_db if c["id"] == candidate_id), None)
    job = next((j for j in jobs_db if j["id"] == job_id), None)
    
    if not candidate or not job:
        return
    
    # Generate realistic analysis results
    analysis_result = generate_analysis_result(candidate, job)
    
    # Store analysis results
    analysis_results[candidate_id] = analysis_result
    
    # Update candidate with analysis results
    candidate["overall_score"] = analysis_result["overall_score"]
    candidate["verdict"] = analysis_result["verdict"]
    candidate["matched_skills"] = analysis_result["matched_skills"]
    candidate["missing_skills"] = analysis_result["missing_skills"]
    candidate["status"] = "analyzed"

def generate_analysis_result(candidate: Dict, job: Dict) -> Dict[str, Any]:
    """Generate realistic analysis results"""
    
    # Simulate skill matching
    job_skills = set(skill.lower() for skill in job["skills_required"])
    candidate_skills = set(skill.lower() for skill in (candidate.get("matched_skills", []) or []))
    
    # Calculate scores
    skills_match = len(candidate_skills.intersection(job_skills)) / len(job_skills) if job_skills else 0
    
    # Generate scores with some randomness but based on skill matching
    base_score = (skills_match * 60) + random.uniform(20, 40)
    overall_score = min(100, max(30, base_score))
    
    # Determine verdict based on score
    if overall_score >= 75:
        verdict = "High"
    elif overall_score >= 50:
        verdict = "Medium"
    else:
        verdict = "Low"
    
    # Generate matched and missing skills
    matched_skills = list(candidate_skills.intersection(job_skills))
    missing_skills = list(job_skills - candidate_skills)
    
    # Add some randomness to skills if lists are empty
    if not matched_skills:
        matched_skills = random.sample(job["skills_required"], min(3, len(job["skills_required"])))
    if not missing_skills:
        all_skills = job["skills_required"] + (job.get("skills_preferred", []) or [])
        missing_skills = random.sample(all_skills, min(2, len(all_skills)))
    
    return {
        "candidate_id": candidate["id"],
        "job_id": job["id"],
        "overall_score": round(overall_score, 1),
        "hard_match_score": round(overall_score * 0.6, 1),
        "soft_match_score": round(overall_score * 0.4, 1),
        "matched_skills": matched_skills[:5],
        "missing_skills": missing_skills[:5],
        "verdict": verdict,
        "suggestions": generate_suggestions(verdict, missing_skills),
        "processing_time": 2.3,
        "skills_match_score": round(skills_match * 100, 1),
        "experience_match_score": round(random.uniform(60, 90), 1),
        "education_match_score": round(random.uniform(70, 95), 1),
        "projects_relevance_score": round(random.uniform(55, 85), 1),
        "analyzed_at": datetime.now().isoformat()
    }

def generate_suggestions(verdict: str, missing_skills: list) -> list:
    """Generate improvement suggestions based on analysis"""
    suggestions = []
    
    if verdict == "Low":
        suggestions.extend([
            "Focus on developing core technical skills mentioned in job requirements",
            "Add more relevant project experience to your resume",
            "Consider obtaining relevant certifications to strengthen your profile"
        ])
    elif verdict == "Medium":
        suggestions.extend([
            "Highlight specific achievements with quantifiable results",
            "Add more details about your role in team projects"
        ])
    else:  # High
        suggestions.append("Excellent match! Consider highlighting leadership experience")
    
    if missing_skills:
        skills_str = ", ".join(missing_skills[:3])
        suggestions.append(f"Consider learning these in-demand skills: {skills_str}")
    
    suggestions.extend([
        "Ensure your resume format is ATS-friendly",
        "Include relevant keywords from the job description",
        "Add a professional summary highlighting your key strengths"
    ])
    
    return suggestions[:5]

@router.get("/results/{candidate_id}")
async def get_analysis_results(candidate_id: int):
    """Get analysis results for candidate"""
    
    # Import here to avoid circular imports
    from app.api.candidates import candidates_db
    
    candidate = next((c for c in candidates_db if c["id"] == candidate_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    if candidate["status"] == "analyzing":
        return {
            "status": "analyzing",
            "message": "🔄 Analysis in progress...",
            "candidate_id": candidate_id
        }
    
    if candidate["status"] != "analyzed":
        return {
            "status": "pending",
            "message": "Analysis not started yet",
            "candidate_id": candidate_id
        }
    
    # Get stored analysis results
    analysis_result = analysis_results.get(candidate_id)
    
    if not analysis_result:
        # If no stored results, create basic results from candidate data
        analysis_result = {
            "candidate_id": candidate_id,
            "overall_score": candidate.get("overall_score"),
            "verdict": candidate.get("verdict"),
            "matched_skills": candidate.get("matched_skills", []),
            "missing_skills": candidate.get("missing_skills", []),
            "status": "completed"
        }
    
    return {
        "status": "completed",
        "message": "✅ Analysis completed",
        "analysis": analysis_result
    }

@router.post("/batch-analyze")
async def batch_analyze_candidates(
    job_id: int,
    candidate_ids: list[int],
    background_tasks: BackgroundTasks
):
    """Analyze multiple candidates at once"""
    
    # Import here to avoid circular imports
    from app.api.candidates import candidates_db
    
    # Validate all candidates exist
    valid_candidates = []
    for candidate_id in candidate_ids:
        candidate = next((c for c in candidates_db if c["id"] == candidate_id), None)
        if candidate:
            valid_candidates.append(candidate_id)
    
    if not valid_candidates:
        raise HTTPException(status_code=404, detail="No valid candidates found")
    
    # Start batch analysis
    for candidate_id in valid_candidates:
        background_tasks.add_task(perform_analysis, candidate_id, job_id)
    
    return {
        "message": f"🔄 Batch analysis started for {len(valid_candidates)} candidates",
        "candidate_ids": valid_candidates,
        "job_id": job_id,
        "estimated_time": "3-5 minutes"
    }

@router.get("/summary/{job_id}")
async def get_analysis_summary(job_id: int):
    """Get analysis summary for a job"""
    
    # Import here to avoid circular imports
    from app.api.candidates import candidates_db
    from app.api.jobs import jobs_db
    
    job = next((j for j in jobs_db if j["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job_candidates = [c for c in candidates_db if c["job_id"] == job_id and c["status"] == "analyzed"]
    
    if not job_candidates:
        return {
            "job_id": job_id,
            "job_title": job["title"],
            "total_candidates": 0,
            "message": "No analyzed candidates found for this job"
        }
    
    # Calculate summary statistics
    scores = [c["overall_score"] for c in job_candidates if c["overall_score"] is not None]
    avg_score = sum(scores) / len(scores) if scores else 0
    
    verdict_counts = {}
    for candidate in job_candidates:
        verdict = candidate.get("verdict", "Unknown")
        verdict_counts[verdict] = verdict_counts.get(verdict, 0) + 1
    
    return {
        "job_id": job_id,
        "job_title": job["title"],
        "total_candidates": len(job_candidates),
        "average_score": round(avg_score, 1),
        "verdict_distribution": verdict_counts,
        "top_candidates": sorted(job_candidates, key=lambda x: x.get("overall_score", 0), reverse=True)[:5]
    }
