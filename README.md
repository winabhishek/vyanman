
# Vyānamana - AI-Powered Mental Health Companion

Vyānamana—derived from Sanskrit—means "to breathe intentionally" or "conscious awareness." Our platform embodies this principle by offering a space for mindful reflection on your mental wellbeing.

## Features

- 🧠 AI-powered chat companion for mental health support
- 🌈 Mood tracking with emoji-based emotion logging
- 📊 Sentiment analysis of conversations
- 🔒 User authentication with anonymous mode option
- 🌙 Light and dark mode support
- 📱 Fully responsive design

## Tech Stack

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Router
- React Query

### Backend
- FastAPI (Python)
- MongoDB with Motor (async driver)
- JWT authentication
- OpenAI GPT-4 integration
- HuggingFace transformers for sentiment analysis

## Project Structure

```
vyānamana/
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── contexts/          # React context providers
│   │   ├── pages/             # Application pages
│   │   ├── services/          # API service layer
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   └── ...
│
├── backend/                   # FastAPI backend
│   ├── models/                # Pydantic models for MongoDB
│   │   ├── user.py            # User model
│   │   ├── chat.py            # Chat models
│   │   └── mood.py            # Mood tracking models
│   ├── main.py                # Main FastAPI application
│   └── requirements.txt       # Python dependencies
│
└── README.md                  # Project documentation
```

## Running the Application Locally

### Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:8080`.

### Backend

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## Environment Variables

### Frontend
Create a `.env` file in the frontend directory with:

```
VITE_API_URL=http://localhost:8000
VITE_APP_ENV=development
```

### Backend
Create a `.env` file in the backend directory with:

```
OPENAI_API_KEY=your_openai_api_key
MONGODB_URL=mongodb://localhost:27017
SECRET_KEY=your_secret_key_for_jwt
```

## MongoDB Schema

### User Collection

```json
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "password_hash": String,
  "is_anonymous": Boolean,
  "created_at": DateTime,
  "updated_at": DateTime,
  "last_login": DateTime
}
```

### Chat Collection

```json
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "name": String,
  "created_at": DateTime,
  "updated_at": DateTime
}
```

### Message Collection

```json
{
  "_id": ObjectId,
  "chat_id": ObjectId,
  "content": String,
  "sender": String,
  "timestamp": DateTime,
  "sentiment": {
    "score": Number,
    "label": String
  }
}
```

### Mood Collection

```json
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "mood": String,
  "note": String,
  "timestamp": DateTime
}
```

## Important Note

The current implementation uses mock data for demonstration purposes. In a production environment, you would need to:

1. Set up a MongoDB database
2. Configure an OpenAI API key
3. Deploy frontend and backend separately
4. Add additional security measures

## Disclaimer

Vyānamana is not a substitute for professional mental health care. If you're experiencing a mental health crisis or need immediate support, please contact a mental health professional, visit your nearest emergency room, or call the 988 Suicide & Crisis Lifeline.
