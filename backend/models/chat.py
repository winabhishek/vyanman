
"""
MongoDB Chat and Message models for the Vyānamana application.
"""
from datetime import datetime
from typing import List, Optional
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


class SentimentAnalysis(BaseModel):
    """Sentiment analysis result for a message."""
    score: float  # Raw score from sentiment analysis (usually between -1 and 1 or 0 to 5)
    label: str  # The sentiment label (e.g., "positive", "negative", "neutral")


class Message(BaseModel):
    """Message model for chat conversations."""
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    chat_id: PyObjectId
    content: str
    sender: str  # 'user' or 'bot'
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    sentiment: Optional[SentimentAnalysis] = None
    
    class Config:
        """Pydantic model configuration."""
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "chat_id": "60d5ec9af682dbd134b216a8",
                "content": "I'm feeling a bit anxious today.",
                "sender": "user",
                "timestamp": datetime.utcnow(),
                "sentiment": {
                    "score": -0.75,
                    "label": "negative"
                }
            }
        }


class ChatSession(BaseModel):
    """Chat session model for grouping messages."""
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    name: str  # Generated name based on the first message or user-defined
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        """Pydantic model configuration."""
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "user_id": "60d5ec9af682dbd134b216a8",
                "name": "Conversation about anxiety",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        }


class ChatResponse(BaseModel):
    """Complete chat session with messages for API responses."""
    id: str = Field(..., alias="_id")
    user_id: str
    name: str
    created_at: datetime
    updated_at: datetime
    messages: List[Message] = []
    
    class Config:
        """Pydantic model configuration."""
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "60d5ec9af682dbd134b216a8",
                "user_id": "60d5ec9af682dbd134b216a7",
                "name": "Conversation about anxiety",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "messages": []
            }
        }


class MessageCreate(BaseModel):
    """Schema for creating a new message."""
    content: str
    
    class Config:
        """Pydantic model configuration."""
        schema_extra = {
            "example": {
                "content": "I'm feeling a bit anxious today."
            }
        }
