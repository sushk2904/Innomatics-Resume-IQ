from fastapi import APIRouter
from typing import Dict, Any, List
import random
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_data():
    """Get comprehensive dashboard analytics data"""
    
    # Import here to avoid circular imports
    from app.api.candidates import candidates_db
    from app.api.jobs import jobs_db
    
    # Calculate real statistics from mock data
    total_candidates = len(candidates_db)
    analyzed_candidates = [c for c in candidates_db if c["status"] == "analyzed"]
    
    # Calculate scores
    scores = [c["overall_score"] for c in analyzed_candidates if c["overall_score"] is not None]
    avg_score = sum(scores) / len(scores) if scores else 0
    
    # Count verdicts
    high_matches = len([c for c in analyzed_candidates if c.get("verdict") == "High"])
    medium_matches = len([c for c in analyzed_candidates if c.get("verdict") == "Medium"])
    low_matches = len([c for c in analyzed_candidates if c.get("verdict") == "Low"])
    
    return {
        "overview": {
            "total_processed": total_candidates,
            "average_score": round(avg_score, 1),
            "high_matches": high_matches,
            "medium_matches": medium_matches,
            "low_matches": low_matches,
            "time_saved": "156h",
            "active_jobs": len([j for j in jobs_db if j["is_active"]])
        },
        "skills_analysis": generate_skills_analysis(),
        "screening_performance": {
            "processing_speed": "+24% faster",
            "accuracy_rate": "94.2%",
            "false_positives": "3.8%",
            "candidates_per_hour": 45
        },
        "recent_activity": get_recent_activity(),
        "monthly_trends": generate_monthly_trends()
    }

@router.get("/analytics")
async def get_detailed_analytics():
    """Get detailed analytics for reports page"""
    
    return {
        "performance_metrics": {
            "total_resumes_processed": 1247,
            "processing_accuracy": 94.2,
            "average_processing_time": "2.3 minutes",
            "time_saved_vs_manual": "156 hours",
            "cost_savings": "$15,600"
        },
        "skills_trends": generate_detailed_skills_trends(),
        "hiring_funnel": {
            "applications_received": 1247,
            "passed_initial_screening": 892,
            "high_match_candidates": 389,
            "interviews_scheduled": 156,
            "offers_extended": 67,
            "hires_completed": 34
        },
        "job_market_insights": generate_job_market_insights(),
        "quality_metrics": {
            "candidate_satisfaction": 4.7,
            "recruiter_satisfaction": 4.8,
            "time_to_hire_reduction": "35%",
            "quality_of_hire_improvement": "28%"
        }
    }

@router.get("/skills-analysis")
async def get_skills_analysis():
    """Get detailed skills analysis report"""
    
    # Import here to avoid circular imports
    from app.api.candidates import candidates_db
    from app.api.jobs import jobs_db
    
    # Analyze skills from real data
    all_job_skills = []
    for job in jobs_db:
        all_job_skills.extend(job["skills_required"])
        all_job_skills.extend(job.get("skills_preferred", []))
    
    all_candidate_skills = []
    for candidate in candidates_db:
        all_candidate_skills.extend(candidate.get("matched_skills", []))
    
    # Count skill frequencies
    skill_demand = {}
    for skill in all_job_skills:
        skill_demand[skill] = skill_demand.get(skill, 0) + 1
    
    skill_availability = {}
    for skill in all_candidate_skills:
        skill_availability[skill] = skill_availability.get(skill, 0) + 1
    
    # Get top skills
    top_demanded = sorted(skill_demand.items(), key=lambda x: x[1], reverse=True)[:10]
    top_available = sorted(skill_availability.items(), key=lambda x: x[1], reverse=True)[:10]
    
    return {
        "most_demanded_skills": [
            {
                "skill": skill,
                "demand_count": count,
                "availability_percentage": random.randint(40, 80)
            }
            for skill, count in top_demanded
        ],
        "skill_gaps": generate_skill_gaps(),
        "emerging_skills": [
            {"skill": "Kubernetes", "growth": "+45%"},
            {"skill": "GraphQL", "growth": "+38%"},
            {"skill": "TypeScript", "growth": "+52%"},
            {"skill": "Rust", "growth": "+67%"},
            {"skill": "Blockchain", "growth": "+23%"}
        ],
        "skill_salary_correlation": generate_salary_correlation()
    }

@router.get("/hiring-trends")
async def get_hiring_trends():
    """Get hiring trends and patterns"""
    
    return {
        "monthly_hiring": generate_monthly_hiring_data(),
        "role_popularity": [
            {"role": "Frontend Developer", "applications": 456, "growth": "+23%"},
            {"role": "Backend Developer", "applications": 389, "growth": "+18%"},
            {"role": "Full Stack Developer", "applications": 334, "growth": "+31%"},
            {"role": "Data Scientist", "applications": 267, "growth": "+15%"},
            {"role": "DevOps Engineer", "applications": 198, "growth": "+42%"}
        ],
        "experience_distribution": {
            "0-2 years": 35,
            "2-5 years": 42,
            "5-8 years": 18,
            "8+ years": 5
        },
        "location_preferences": [
            {"location": "Remote", "percentage": 68},
            {"location": "Bangalore", "percentage": 15},
            {"location": "San Francisco", "percentage": 8},
            {"location": "New York", "percentage": 5},
            {"location": "Austin", "percentage": 4}
        ]
    }

@router.get("/candidate-insights/{candidate_id}")
async def get_candidate_insights(candidate_id: int):
    """Get detailed insights for specific candidate"""
    
    # Import here to avoid circular imports
    from app.api.candidates import candidates_db
    
    candidate = next((c for c in candidates_db if c["id"] == candidate_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    return {
        "candidate": candidate,
        "strengths": [
            "Strong technical skills in required technologies",
            "Relevant project experience",
            "Good educational background",
            "Excellent problem-solving abilities"
        ],
        "improvement_areas": [
            "Could benefit from more leadership experience",
            "Additional certifications would strengthen profile",
            "More detailed project descriptions needed"
        ],
        "comparison_with_peers": {
            "percentile_rank": random.randint(60, 95),
            "skills_comparison": "Above average",
            "experience_level": "Appropriate for role"
        },
        "recommendations": [
            "Schedule technical interview",
            "Assess cultural fit",
            "Check references",
            "Discuss career growth opportunities"
        ]
    }

def generate_skills_analysis():
    """Generate mock skills analysis data"""
    skills = [
        {"name": "React", "demand": 89, "available": 67, "gap": 22},
        {"name": "Python", "demand": 85, "available": 71, "gap": 14},
        {"name": "JavaScript", "demand": 92, "available": 78, "gap": 14},
        {"name": "Node.js", "demand": 68, "available": 52, "gap": 16},
        {"name": "AWS", "demand": 64, "available": 38, "gap": 26},
        {"name": "TypeScript", "demand": 76, "available": 45, "gap": 31},
        {"name": "Docker", "demand": 58, "available": 34, "gap": 24},
        {"name": "MongoDB", "demand": 45, "available": 41, "gap": 4}
    ]
    
    return {
        "top_skills_in_demand": skills,
        "biggest_skill_gaps": sorted(skills, key=lambda x: x["gap"], reverse=True)[:5],
        "well_supplied_skills": sorted(skills, key=lambda x: x["gap"])[:3]
    }

def get_recent_activity():
    """Get recent screening activity"""
    
    # Import here to avoid circular imports
    from app.api.candidates import candidates_db
    
    recent_candidates = sorted(
        candidates_db, 
        key=lambda x: x.get("applied_at", ""), 
        reverse=True
    )[:10]
    
    return [
        {
            "id": c["id"],
            "candidate": c["name"],
            "role": "Software Developer",  # Could be enhanced with job lookup
            "score": c.get("overall_score", 0),
            "verdict": c.get("verdict", "Pending"),
            "time": "2 hours ago"  # Could be calculated from applied_at
        }
        for c in recent_candidates
    ]

def generate_monthly_trends():
    """Generate monthly hiring trends"""
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return [
        {
            "month": month,
            "applications": random.randint(180, 250),
            "screenings": random.randint(120, 180),
            "hires": random.randint(15, 35)
        }
        for month in months
    ]

def generate_detailed_skills_trends():
    """Generate detailed skills trend analysis"""
    skills = ["React", "Python", "JavaScript", "TypeScript", "Node.js", "AWS", "Docker"]
    
    return [
        {
            "skill": skill,
            "current_demand": random.randint(60, 95),
            "trend_direction": random.choice(["up", "down", "stable"]),
            "growth_rate": f"+{random.randint(5, 45)}%",
            "market_saturation": random.randint(30, 80),
            "avg_salary_impact": f"+${random.randint(5, 25)}K"
        }
        for skill in skills
    ]

def generate_job_market_insights():
    """Generate job market insights"""
    return {
        "fastest_growing_roles": [
            {"role": "AI/ML Engineer", "growth": "+67%"},
            {"role": "DevOps Engineer", "growth": "+45%"},
            {"role": "Cloud Architect", "growth": "+38%"}
        ],
        "declining_roles": [
            {"role": "Legacy System Maintainer", "decline": "-23%"},
            {"role": "Manual Tester", "decline": "-15%"}
        ],
        "salary_trends": {
            "average_increase": "+12%",
            "top_paying_skills": ["Kubernetes", "AWS", "React Native"]
        }
    }

def generate_skill_gaps():
    """Generate skill gap analysis"""
    return [
        {
            "skill": "Kubernetes",
            "demand_percentage": 78,
            "availability_percentage": 34,
            "gap_severity": "Critical"
        },
        {
            "skill": "GraphQL", 
            "demand_percentage": 65,
            "availability_percentage": 28,
            "gap_severity": "High"
        },
        {
            "skill": "TypeScript",
            "demand_percentage": 82,
            "availability_percentage": 51,
            "gap_severity": "Medium"
        }
    ]

def generate_salary_correlation():
    """Generate skill-salary correlation data"""
    return [
        {"skill": "Kubernetes", "avg_salary_premium": "+$28K"},
        {"skill": "AWS", "avg_salary_premium": "+$22K"},
        {"skill": "React Native", "avg_salary_premium": "+$18K"},
        {"skill": "GraphQL", "avg_salary_premium": "+$15K"},
        {"skill": "Docker", "avg_salary_premium": "+$12K"}
    ]

def generate_monthly_hiring_data():
    """Generate monthly hiring statistics"""
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return [
        {
            "month": month,
            "total_applications": random.randint(200, 300),
            "successful_hires": random.randint(25, 45),
            "avg_time_to_hire": f"{random.randint(12, 28)} days",
            "success_rate": f"{random.randint(12, 22)}%"
        }
        for month in months
    ]
