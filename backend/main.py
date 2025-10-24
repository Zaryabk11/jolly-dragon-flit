import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS configuration


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)

@app.get("/healthz")
def health_check():
    try:
        # The ismaster command is cheap and does not require auth.
        client.admin.command('ismaster')
        return {"status": "ok", "message": "Successfully connected to MongoDB"}
    except ConnectionFailure:
        raise HTTPException(status_code=503, detail="Could not connect to MongoDB")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
