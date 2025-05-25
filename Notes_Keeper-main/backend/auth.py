from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from bson.objectid import ObjectId
import os
from flask_cors import CORS
bcrypt = Bcrypt()
auth_bp = Blueprint('auth', __name__)

def init_auth(app, users_collection):
    bcrypt.init_app(app)

    @auth_bp.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')

        if not email or not password or not name:
            return jsonify({"msg": "Missing name, email, or password"}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"msg": "User already exists"}), 409

        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
        users_collection.insert_one({"name": name, "email": email, "password": hashed_pw})

        return jsonify({"msg": "User registered successfully"}), 201

    @auth_bp.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"msg": "Missing email or password"}), 400

        user = users_collection.find_one({"email": email})
        if user and bcrypt.check_password_hash(user['password'], password):
            access_token = create_access_token(identity=str(user['_id']))
            return jsonify(access_token=access_token), 200

        return jsonify({"msg": "Invalid credentials"}), 401