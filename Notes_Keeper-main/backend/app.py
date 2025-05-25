from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
from auth import auth_bp, init_auth
import os
from bson.objectid import ObjectId
from datetime import timedelta

load_dotenv()
app = Flask(__name__)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
CORS(app, resources={r"/api/*": {"origins": FRONTEND_URL}})

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

mongo = PyMongo(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

users_collection = mongo.db.users  # will hold user data
notes_collection = mongo.db.notes

def note_serializer(note):
    return {
        "id": str(note["_id"]),
        "title": note.get("title"),
        "content": note.get("content"),
        # "user_id": str(note.get("user_id"))  # Uncomment if needed on frontend
    }

@app.route('/api/notes', methods=['POST'])
@jwt_required()
def create_note():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    title = data.get("title", "").strip()
    content = data.get("content", "").strip()

    if not title or not content:
        return jsonify({"msg": "Missing title or content"}), 400

    note = {
        "title": title,
        "content": content,
        "user_id": ObjectId(current_user_id)
    }
    result = notes_collection.insert_one(note)
    new_note = notes_collection.find_one({"_id": result.inserted_id})
    return jsonify(note_serializer(new_note)), 201 
@app.route('/api/notes', methods=['GET'])
@jwt_required()
def get_notes():
    current_user_id = get_jwt_identity()
    notes = notes_collection.find({"user_id": ObjectId(current_user_id)})
    return jsonify([note_serializer(note) for note in notes])

@app.route('/api/notes/<note_id>', methods=['PUT'])
@jwt_required()
def update_note(note_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()

    note = notes_collection.find_one({"_id": ObjectId(note_id), "user_id": ObjectId(current_user_id)})
    if not note:
        return jsonify({"msg": "Note not found or not authorized"}), 404

    updated_fields = {}
    if "title" in data:
        updated_fields["title"] = data["title"]
    if "content" in data:
        updated_fields["content"] = data["content"]

    if updated_fields:
        notes_collection.update_one({"_id": ObjectId(note_id)}, {"$set": updated_fields})
        note = notes_collection.find_one({"_id": ObjectId(note_id)})
        return jsonify(note_serializer(note))
    else:
        return jsonify({"msg": "No fields to update"}), 400

@app.route('/api/notes/<note_id>', methods=['DELETE'])
@jwt_required()
def delete_note(note_id):
    current_user_id = get_jwt_identity()
    note = notes_collection.find_one({"_id": ObjectId(note_id), "user_id": ObjectId(current_user_id)})

    if not note:
        return jsonify({"msg": "Note not found or not authorized"}), 404

    notes_collection.delete_one({"_id": ObjectId(note_id)})
    return '', 204  # No Content

@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(current_user_id)})
    if user:
        return jsonify({"msg": f"Hello, {user['name']}! This is a protected route."})
    else:
        return jsonify({"msg": "User not found"}), 404

init_auth(app, users_collection)
app.register_blueprint(auth_bp)

if __name__ == '__main__':
    app.run(debug=True)