from app import db, argon2

class User:
    def __init__(self, username, password):
        self.username = username
        self.password = password

    def save(self):
        hashed_password = argon2.generate_password_hash(self.password)
        user_data = {
            "username": self.username,
            "password": hashed_password
        }
        db.users.insert_one(user_data)

    @staticmethod
    def find_by_username(username):
        return db.users.find_one({"username": username})

class Mood:
    @staticmethod
    def get_all_for_user(user_id):
        return db.mood_records.find({"userId": user_id}).sort("date", -1)

    @staticmethod
    def find_by_date(user_id, date):
        return db.mood_records.find_one({"userId": user_id, "date": date})

    @staticmethod
    def create(user_id, date, mood=None, emoji=None):
        record = {"userId": user_id, "date": date, "emojiEntries": []}
        if mood:
            record["selectedMood"] = mood
        if emoji:
            record["emojiEntries"].append({"emoji": emoji, "timestamp": datetime.datetime.utcnow().isoformat()})
        db.mood_records.insert_one(record)
        return record

    @staticmethod
    def update(record_id, mood=None, emoji=None):
        update = {}
        if mood:
            update["$set"] = {"selectedMood": mood}
        if emoji:
            update["$push"] = {"emojiEntries": {"emoji": emoji, "timestamp": datetime.datetime.utcnow().isoformat()}}
        
        db.mood_records.update_one({"_id": record_id}, update)
        return db.mood_records.find_one({"_id": record_id})