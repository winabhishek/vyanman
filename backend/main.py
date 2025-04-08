
"""
Main FastAPI application file for Vyānamana backend.
"""
import os
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

# Import models
from models.user import User, UserCreate, UserResponse
from models.chat import Message, ChatSession, ChatResponse, MessageCreate
from models.mood import MoodEntry, MoodEntryCreate, MoodEntryResponse, MoodType

# App configuration
app = FastAPI(
    title="Vyānamana API",
    description="API for Vyānamana mental health companion app",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = os.environ.get("SECRET_KEY", "vyanamanasecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Database connection
MONGODB_URL = os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.vyanamana_db

# OpenAI API configuration
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Authentication models
class Token(BaseModel):
    """Token schema for authentication."""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Token data schema containing user ID."""
    user_id: Optional[str] = None

# Helper functions
def verify_password(plain_password, hashed_password):
    """Verify password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Generate password hash."""
    return pwd_context.hash(password)

async def get_user(email: str):
    """Get user by email."""
    user = await db.users.find_one({"email": email})
    if user:
        return User(**user)

async def authenticate_user(email: str, password: str):
    """Authenticate user with email and password."""
    user = await get_user(email)
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current authenticated user from token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"_id": ObjectId(token_data.user_id)})
    if user is None:
        raise credentials_exception
    return User(**user)

# Routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login endpoint to get access token."""
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login time
    await db.users.update_one(
        {"_id": user.id},
        {"$set": {"last_login": datetime.utcnow(), "updated_at": datetime.utcnow()}}
    )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users", response_model=UserResponse)
async def create_user(user_create: UserCreate):
    """Create a new user."""
    # Check if email already exists
    existing_user = await db.users.find_one({"email": user_create.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user with hashed password
    hashed_password = get_password_hash(user_create.password)
    user = User(
        name=user_create.name,
        email=user_create.email,
        password_hash=hashed_password,
        is_anonymous=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    result = await db.users.insert_one(user.dict(by_alias=True))
    created_user = await db.users.find_one({"_id": result.inserted_id})
    
    return UserResponse(**created_user)

@app.post("/users/anonymous", response_model=UserResponse)
async def create_anonymous_user():
    """Create an anonymous user."""
    user = User(
        name="Anonymous User",
        email=f"anonymous-{datetime.utcnow().timestamp()}@vyanamana.app",
        password_hash="",  # No password for anonymous users
        is_anonymous=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    result = await db.users.insert_one(user.dict(by_alias=True))
    created_user = await db.users.find_one({"_id": result.inserted_id})
    
    return UserResponse(**created_user)

@app.get("/users/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user info."""
    return UserResponse(**current_user.dict())

# Chat routes
@app.post("/chats", response_model=ChatResponse)
async def create_chat(current_user: User = Depends(get_current_user)):
    """Create a new chat session."""
    chat = ChatSession(
        user_id=current_user.id,
        name="New conversation",  # Default name, will be updated with first message
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    result = await db.chats.insert_one(chat.dict(by_alias=True))
    created_chat = await db.chats.find_one({"_id": result.inserted_id})
    
    # Return chat with empty messages list
    return ChatResponse(**created_chat, messages=[])

@app.get("/chats", response_model=List[ChatResponse])
async def get_chats(current_user: User = Depends(get_current_user)):
    """Get all chat sessions for the current user."""
    chats = []
    cursor = db.chats.find({"user_id": current_user.id})
    
    async for chat in cursor:
        # Get messages for this chat
        messages = []
        message_cursor = db.messages.find({"chat_id": chat["_id"]}).sort("timestamp", 1)
        async for message in message_cursor:
            messages.append(Message(**message))
        
        chats.append(ChatResponse(**chat, messages=messages))
    
    return chats

@app.get("/chats/{chat_id}", response_model=ChatResponse)
async def get_chat(chat_id: str, current_user: User = Depends(get_current_user)):
    """Get a specific chat session with messages."""
    chat = await db.chats.find_one({"_id": ObjectId(chat_id), "user_id": current_user.id})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    # Get messages for this chat
    messages = []
    cursor = db.messages.find({"chat_id": ObjectId(chat_id)}).sort("timestamp", 1)
    async for message in cursor:
        messages.append(Message(**message))
    
    return ChatResponse(**chat, messages=messages)

@app.post("/chats/{chat_id}/messages", response_model=Message)
async def send_message(
    chat_id: str, 
    message_create: MessageCreate, 
    current_user: User = Depends(get_current_user)
):
    """Send a new message in a chat and get AI response."""
    # Verify chat exists and belongs to user
    chat = await db.chats.find_one({"_id": ObjectId(chat_id), "user_id": current_user.id})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    # Save user message
    user_message = Message(
        chat_id=ObjectId(chat_id),
        content=message_create.content,
        sender="user",
        timestamp=datetime.utcnow()
    )
    
    await db.messages.insert_one(user_message.dict(by_alias=True))
    
    # If this is the first message, update chat name
    if chat["name"] == "New conversation":
        # Generate a name based on the first message
        name_preview = message_create.content[:30] + "..." if len(message_create.content) > 30 else message_create.content
        await db.chats.update_one(
            {"_id": ObjectId(chat_id)},
            {"$set": {"name": name_preview, "updated_at": datetime.utcnow()}}
        )
    
    # Perform sentiment analysis
    # In a real app, you would use a proper sentiment analysis model
    # For now, we'll use a simple mock implementation
    sentiment = {
        "score": 0.0,  # Neutral by default
        "label": "neutral"
    }
    
    # Update user message with sentiment
    await db.messages.update_one(
        {"_id": user_message.id},
        {"$set": {"sentiment": sentiment}}
    )
    
    # In a real implementation, we would call OpenAI's API here
    # For now, we'll use a simple mock response
    bot_responses = [
        "I understand how you're feeling. Would you like to talk more about that?",
        "Thank you for sharing that with me. How long have you been feeling this way?",
        "That sounds challenging. What helps you cope when you feel like this?",
        "I'm here to listen. Would you like to explore some techniques that might help?",
        "Your feelings are valid. It takes courage to express them.",
        "I hear you. Sometimes just talking about our feelings can help us process them better.",
        "Would you like to try a quick mindfulness exercise to help center yourself?",
        "It sounds like you're going through a lot. Remember to be kind to yourself during this time.",
        "Have you spoken to anyone else about how you're feeling?",
        "I'm glad you reached out today. Is there anything specific you'd like support with?",
    ]
    import random
    bot_response = random.choice(bot_responses)
    
    # Create and save bot response
    bot_message = Message(
        chat_id=ObjectId(chat_id),
        content=bot_response,
        sender="bot",
        timestamp=datetime.utcnow()
    )
    
    await db.messages.insert_one(bot_message.dict(by_alias=True))
    
    # Update chat last update time
    await db.chats.update_one(
        {"_id": ObjectId(chat_id)},
        {"$set": {"updated_at": datetime.utcnow()}}
    )
    
    # Fetch complete bot message with ID for response
    bot_message_db = await db.messages.find_one({"_id": bot_message.id})
    
    return Message(**bot_message_db)

# Mood tracking routes
@app.post("/moods", response_model=MoodEntryResponse)
async def create_mood_entry(
    mood_create: MoodEntryCreate, 
    current_user: User = Depends(get_current_user)
):
    """Create a new mood entry."""
    mood_entry = MoodEntry(
        user_id=current_user.id,
        mood=mood_create.mood,
        note=mood_create.note,
        timestamp=datetime.utcnow()
    )
    
    result = await db.moods.insert_one(mood_entry.dict(by_alias=True))
    created_mood = await db.moods.find_one({"_id": result.inserted_id})
    
    return MoodEntryResponse(**created_mood)

@app.get("/moods", response_model=List[MoodEntryResponse])
async def get_mood_entries(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user)
):
    """Get mood entries for the current user, optionally filtered by date range."""
    query = {"user_id": current_user.id}
    
    # Add date filters if provided
    if start_date or end_date:
        query["timestamp"] = {}
        if start_date:
            query["timestamp"]["$gte"] = start_date
        if end_date:
            query["timestamp"]["$lte"] = end_date
    
    moods = []
    cursor = db.moods.find(query).sort("timestamp", -1)  # Newest first
    
    async for mood in cursor:
        moods.append(MoodEntryResponse(**mood))
    
    return moods

@app.get("/moods/{mood_id}", response_model=MoodEntryResponse)
async def get_mood_entry(mood_id: str, current_user: User = Depends(get_current_user)):
    """Get a specific mood entry."""
    mood = await db.moods.find_one({"_id": ObjectId(mood_id), "user_id": current_user.id})
    if not mood:
        raise HTTPException(status_code=404, detail="Mood entry not found")
    
    return MoodEntryResponse(**mood)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
