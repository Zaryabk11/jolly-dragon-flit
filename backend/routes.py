from flask import request, jsonify, Blueprint
from backend.models import User, Mood
from backend.app import argon2, db, app
from backend.middleware import token_required
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)
moods_bp = Blueprint('moods', __name__)

@auth_bp.route("/api/v1/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    if User.find_by_username(username):
        return jsonify({"message": "User already exists"}), 400

    user = User(username, password)
    user.save()

    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route("/api/v1/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    user = User.find_by_username(username)

    if not user or not argon2.check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode({
        "user_id": str(user["_id"]),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, app.config["JWT_SECRET_KEY"])

    return jsonify({"token": token.decode("UTF-8")})

@auth_bp.route("/api/v1/auth/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Successfully logged out"}), 200

@moods_bp.route("/api/v1/moods", methods=["GET"])
@token_required
def get_moods(current_user):
    moods = Mood.get_all_for_user(current_user["_id"])
    return jsonify(list(moods))

@moods_bp.route("/api/v1/moods", methods=["POST"])
@token_required
def add_or_update_mood(current_user):
    data = request.get_json()
    date = datetime.datetime.utcnow().strftime("%Y-%m-%d")
    
    mood = data.get("selectedMood")
    emoji = data.get("emoji")

    record = Mood.find_by_date(current_user["_id"], date)

    if record:
        updated_record = Mood.update(record["_id"], mood, emoji)
        return jsonify(updated_record)
    else:
        new_record = Mood.create(current_user["_id"], date, mood, emoji)
        return jsonify(new_record), 201