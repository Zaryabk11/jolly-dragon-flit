import os

class Config:
    MONGO_URI = os.environ.get('MONGO_URI', "mongodb+srv://zaryabh49_db_user:hiy2786@cluster0.rrj7sk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'super-secret')