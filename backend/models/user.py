
"""
MongoDB User model for the Vyānamana application.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr
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


class User(BaseModel):
    """User model for Vyānamana application."""
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: EmailStr
    password_hash: str  # Hashed password - never store plain passwords
    is_anonymous: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Config:
        """Pydantic model configuration."""
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "Jane Doe",
                "email": "jane@example.com",
                "password_hash": "[hashed_password]",
                "is_anonymous": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "last_login": datetime.utcnow()
            }
        }


class UserCreate(BaseModel):
    """Schema for user creation without password hash."""
    name: str
    email: EmailStr
    password: str
    
    class Config:
        """Pydantic model configuration."""
        schema_extra = {
            "example": {
                "name": "Jane Doe",
                "email": "jane@example.com",
                "password": "strongpassword123"
            }
        }


class UserResponse(BaseModel):
    """Schema for user data without sensitive information."""
    id: str = Field(..., alias="_id")
    name: str
    email: EmailStr
    is_anonymous: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        """Pydantic model configuration."""
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "60d5ec9af682dbd134b216a8",
                "name": "Jane Doe",
                "email": "jane@example.com",
                "is_anonymous": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        }
