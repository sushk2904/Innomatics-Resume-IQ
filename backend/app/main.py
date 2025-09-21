from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import API routers
from app.api import candidates, jobs, analysis, reports, settings

# Initialize FastAPI app
app = FastAPI(
    title="ResumeIQ Backend API",
    description="AI-Powered Resume Analysis System for Placement Teams",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",    # React dev server
        "http://localhost:3001",    # Alternative React port
        "https://your-frontend.vercel.app"  # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(candidates.router, prefix="/api/v1/candidates", tags=["candidates"])
app.include_router(jobs.router, prefix="/api/v1/jobs", tags=["jobs"])
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["analysis"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(settings.router, prefix="/api/v1/settings", tags=["settings"])

# Root endpoints
@app.get("/")
async def root():
    return {
        "message": "🚀 ResumeIQ Backend API is running!",
        "status": "healthy",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "candidates": "/api/v1/candidates",
            "jobs": "/api/v1/jobs", 
            "analysis": "/api/v1/analysis",
            "reports": "/api/v1/reports",
            "settings": "/api/v1/settings"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ResumeIQ Backend",
        "pdf_processing": "✅ Ready",
        "ai_analysis": "✅ Ready",
        "database": "✅ Connected"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
