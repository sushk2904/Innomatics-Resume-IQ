from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional

router = APIRouter()

class UserProfile(BaseModel):
    full_name: str
    email: EmailStr
    role: str
    department: str
    phone: Optional[str] = None
    company: Optional[str] = None

class NotificationSettings(BaseModel):
    email_notifications: bool = True
    push_notifications: bool = True
    weekly_reports: bool = True
    candidate_status_updates: bool = True
    new_application_alerts: bool = True

class ScreeningSettings(BaseModel):
    min_score_threshold: int = 50
    auto_screening: bool = True
    ai_suggestions: bool = True
    auto_rejection_threshold: int = 30
    require_manual_review_above: int = 90

class SystemSettings(BaseModel):
    theme: str = "dark"
    language: str = "en"
    timezone: str = "UTC"
    items_per_page: int = 20

# Mock settings storage
current_settings = {
    "profile": {
        "full_name": "Recruiter Admin",
        "email": "admin@innomatics.in",
        "role": "Senior Recruiter",
        "department": "Human Resources",
        "phone": "+91-9876543210",
        "company": "Innomatics Research Labs"
    },
    "notifications": {
        "email_notifications": True,
        "push_notifications": True,
        "weekly_reports": True,
        "candidate_status_updates": True,
        "new_application_alerts": True
    },
    "screening": {
        "min_score_threshold": 65,
        "auto_screening": True,
        "ai_suggestions": True,
        "auto_rejection_threshold": 35,
        "require_manual_review_above": 85
    },
    "system": {
        "theme": "dark",
        "language": "en",
        "timezone": "Asia/Kolkata",
        "items_per_page": 25
    }
}

@router.get("/")
async def get_all_settings():
    """Get all settings"""
    return {
        "message": "Settings retrieved successfully",
        "settings": current_settings
    }

@router.get("/profile")
async def get_profile():
    """Get user profile settings"""
    return {
        "profile": current_settings["profile"]
    }

@router.patch("/profile")
async def update_profile(profile: UserProfile):
    """Update user profile"""
    # Validate email uniqueness (in real app, check against database)
    current_settings["profile"] = profile.dict()
    
    return {
        "message": "✅ Profile updated successfully",
        "profile": current_settings["profile"]
    }

@router.get("/notifications")
async def get_notification_settings():
    """Get notification settings"""
    return {
        "notifications": current_settings["notifications"]
    }

@router.patch("/notifications")
async def update_notifications(settings: NotificationSettings):
    """Update notification settings"""
    current_settings["notifications"] = settings.dict()
    
    return {
        "message": "✅ Notification settings updated successfully",
        "settings": current_settings["notifications"]
    }

@router.get("/screening")
async def get_screening_settings():
    """Get screening and AI settings"""
    return {
        "screening": current_settings["screening"]
    }

@router.patch("/screening") 
async def update_screening_settings(settings: ScreeningSettings):
    """Update screening and AI settings"""
    
    # Validate threshold ranges
    if not (0 <= settings.min_score_threshold <= 100):
        raise HTTPException(status_code=400, detail="Min score threshold must be between 0 and 100")
    
    if not (0 <= settings.auto_rejection_threshold <= 100):
        raise HTTPException(status_code=400, detail="Auto rejection threshold must be between 0 and 100")
    
    if not (0 <= settings.require_manual_review_above <= 100):
        raise HTTPException(status_code=400, detail="Manual review threshold must be between 0 and 100")
    
    if settings.auto_rejection_threshold >= settings.min_score_threshold:
        raise HTTPException(status_code=400, detail="Auto rejection threshold must be less than min score threshold")
    
    current_settings["screening"] = settings.dict()
    
    return {
        "message": "✅ Screening settings updated successfully",
        "settings": current_settings["screening"]
    }

@router.get("/system")
async def get_system_settings():
    """Get system preferences"""
    return {
        "system": current_settings["system"]
    }

@router.patch("/system")
async def update_system_settings(settings: SystemSettings):
    """Update system preferences"""
    
    # Validate settings
    valid_themes = ["light", "dark", "auto"]
    if settings.theme not in valid_themes:
        raise HTTPException(status_code=400, detail=f"Theme must be one of: {valid_themes}")
    
    valid_languages = ["en", "es", "fr", "de", "hi"]
    if settings.language not in valid_languages:
        raise HTTPException(status_code=400, detail=f"Language must be one of: {valid_languages}")
    
    if not (5 <= settings.items_per_page <= 100):
        raise HTTPException(status_code=400, detail="Items per page must be between 5 and 100")
    
    current_settings["system"] = settings.dict()
    
    return {
        "message": "✅ System settings updated successfully",
        "settings": current_settings["system"]
    }

@router.post("/reset-to-defaults")
async def reset_settings_to_defaults():
    """Reset all settings to default values"""
    
    default_settings = {
        "profile": {
            "full_name": "Recruiter Admin",
            "email": "admin@innomatics.in",
            "role": "Recruiter",
            "department": "Human Resources",
            "phone": None,
            "company": "Innomatics Research Labs"
        },
        "notifications": {
            "email_notifications": True,
            "push_notifications": True,
            "weekly_reports": True,
            "candidate_status_updates": True,
            "new_application_alerts": True
        },
        "screening": {
            "min_score_threshold": 50,
            "auto_screening": True,
            "ai_suggestions": True,
            "auto_rejection_threshold": 30,
            "require_manual_review_above": 90
        },
        "system": {
            "theme": "dark",
            "language": "en",
            "timezone": "UTC",
            "items_per_page": 20
        }
    }
    
    # Update global settings
    current_settings.update(default_settings)
    
    return {
        "message": "✅ All settings reset to defaults",
        "settings": current_settings
    }

@router.get("/backup")
async def backup_settings():
    """Create a backup of current settings"""
    from datetime import datetime
    
    backup_data = {
        "backup_date": datetime.now().isoformat(),
        "settings": current_settings.copy()
    }
    
    return {
        "message": "Settings backup created",
        "backup": backup_data
    }

@router.post("/restore")
async def restore_settings(backup_data: dict):
    """Restore settings from backup"""
    
    if "settings" not in backup_data:
        raise HTTPException(status_code=400, detail="Invalid backup data format")
    
    # Validate backup structure
    required_sections = ["profile", "notifications", "screening", "system"]
    backup_settings = backup_data["settings"]
    
    for section in required_sections:
        if section not in backup_settings:
            raise HTTPException(status_code=400, detail=f"Missing {section} in backup data")
    
    # Restore settings
    current_settings.update(backup_settings)
    
    return {
        "message": "✅ Settings restored successfully from backup",
        "restored_date": backup_data.get("backup_date", "Unknown")
    }

@router.get("/validation-rules")
async def get_validation_rules():
    """Get current validation and business rules"""
    return {
        "score_thresholds": {
            "min_threshold": current_settings["screening"]["min_score_threshold"],
            "auto_rejection": current_settings["screening"]["auto_rejection_threshold"],
            "manual_review": current_settings["screening"]["require_manual_review_above"]
        },
        "file_upload_rules": {
            "max_file_size": "10MB",
            "allowed_formats": [".pdf", ".docx", ".doc"],
            "max_files_per_candidate": 1
        },
        "analysis_rules": {
            "max_processing_time": "5 minutes",
            "retry_attempts": 3,
            "confidence_threshold": 0.7
        }
    }
