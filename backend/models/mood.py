
"""
MongoDB Mood models for the Vyānamana application.
"""
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId class for Pydantic models."""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class MoodType(str, Enum):
    """Enum for different mood types."""
    JOYFUL = "joyful"
    HAPPY = "happy"
    CONTENT = "content"
    NEUTRAL = "neutral"
    SAD = "sad"
    ANXIOUS = "anxious"
    STRESSED = "stressed"
    ANGRY = "angry"
    EXHAUSTED = "exhausted"


class MoodEntry(BaseModel):
    """Mood entry model for tracking user moods."""
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    mood: MoodType
    note: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        """Pydantic model configuration."""
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "user_id": "60d5ec9af682dbd134b216a8",
                "mood": "happy",
                "note": "Had a great day at work today!",
                "timestamp": datetime.utcnow()
            }
        }


class MoodEntryCreate(BaseModel):
    """Schema for creating a new mood entry."""
    mood: MoodType
    note: Optional[str] = None
    
    class Config:
        """Pydantic model configuration."""
        schema_extra = {
            "example": {
                "mood": "happy",
                "note": "Had a great day at work today!"
            }
        }


class MoodEntryResponse(BaseModel):
    """Schema for mood entry data in API responses."""
    id: str = Field(..., alias="_id")
    user_id: str
    mood: MoodType
    note: Optional[str] = None
    timestamp: datetime
    
    class Config:
        """Pydantic model configuration."""
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "60d5ec9af682dbd134b216a8",
                "user_id": "60d5ec9af682dbd134b216a7",
                "mood": "happy",
                "note": "Had a great day at work today!",
                "timestamp": datetime.utcnow()
            }
        }
