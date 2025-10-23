from flask import Flask
from pymongo import MongoClient
from backend.config import Config
from backend.utils import JSONEncoder
from flask_argon2 import Argon2

app = Flask(__name__)
app.config.from_object(Config)
app.json_encoder = JSONEncoder

client = MongoClient(app.config["MONGO_URI"])
db = client.get_default_database()

argon2 = Argon2(app)

# Import routes after db is defined to avoid circular import
from backend.routes import auth_bp, moods_bp

app.register_blueprint(auth_bp)
app.register_blueprint(moods_bp)

if __name__ == "__main__":
    app.run(debug=True)