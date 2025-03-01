import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import jwt
import os
from dotenv import load_dotenv
import secrets

# Load environment variables from .env file
load_dotenv()

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['personal_expense_tracker']
users_collection = db['users']
transaction_collection = db['transactions']
card_collection = db['cards']
chart_collection = db['charts']
tokens_collection = db['tokens']

# Initialize Flask app
app = Flask(__name__)
CORS(app)
SECRET_KEY = os.getenv("SECRET_KEY")  # Get from environment variable

# Check if SECRET_KEY is set
if not SECRET_KEY:
    raise ValueError("No SECRET_KEY set in environment variables")

# Generate access token (short-lived, 24 hours)
def generate_access_token(email):
    return jwt.encode(
        {
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Expires in 24 hours
        },
        SECRET_KEY, # type: ignore
        algorithm="HS256"
    )

def generate_refresh_token():
    return secrets.token_hex(32)  # 64-character random hexadecimal string

# Store refresh token in MongoDB
def store_refresh_token(user_email, refresh_token):
    tokens_collection.insert_one({
        "email": user_email,
        "refresh_token": refresh_token,
        "created_at": datetime.datetime.utcnow(),
        "expires_at": datetime.datetime.utcnow() + datetime.timedelta(days=30)
    })

# Define the POST route for registering a user
@app.route('/api/v1/register', methods=["POST"])
def register_user():
    try:
        user_data = request.get_json()
        if not user_data or "username" not in user_data or "email" not in user_data or "password" not in user_data:
            return jsonify({"message": "Missing required fields: username, email, password"}), 400
        
        if users_collection.find_one({"email": user_data["email"]}):
            return jsonify({"message": "User with this email already exists"}), 409
        
        # Hash the password
        password = user_data["password"].encode('utf-8')
        hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

        # Insert user into MongoDB
        users_collection.insert_one({
            "username": user_data["username"],
            "email": user_data["email"],
            "password": hashed_password
        })

        # Generate tokens
        access_token = generate_access_token(user_data["email"])
        refresh_token = generate_refresh_token()
        
        # Store refresh token
        store_refresh_token(user_data["email"], refresh_token)

        return jsonify({
            "message": "User registered successfully",
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Define the POST route for logging in a user
@app.route('/api/v1/login', methods=["POST"])
def login_user():
    try:
        login_data = request.get_json()
        if not login_data or "email" not in login_data or "password" not in login_data:
            return jsonify({"message": "Missing required fields: email, password"}), 400
        
        # Find the user by email
        user = users_collection.find_one({"email": login_data["email"]})
        if not user:
            return jsonify({"message": "Invalid email or password"}), 401
        
        # Verify the password
        input_password = login_data["password"].encode('utf-8')
        stored_password = user["password"]

        if bcrypt.checkpw(input_password, stored_password):
            # Generate tokens
            access_token = generate_access_token(user["email"])
            refresh_token = generate_refresh_token()
            
            # Store refresh token
            store_refresh_token(user["email"], refresh_token)

            return jsonify({
                "message": "Login successful",
                "access_token": access_token,
                "refresh_token": refresh_token,
                "username": user["username"],
                "email": user["email"]
            }), 200
        else:
            return jsonify({"message": "Invalid email or password"}), 401
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Define the POST route for refreshing the access token
@app.route('/api/v1/refresh', methods=["POST"])
def refresh_token():
    try:
        refresh_token = request.json.get("refresh_token") # type: ignore
        if not refresh_token:
            return jsonify({"message": "No refresh token provided"}), 401
        
        # Find the refresh token in MongoDB
        token_doc = tokens_collection.find_one({"refresh_token": refresh_token})
        if not token_doc:
            return jsonify({"message": "Invalid refresh token"}), 401
        
        # Check if refresh token is expired
        if token_doc["expires_at"] < datetime.datetime.utcnow():
            tokens_collection.delete_one({"refresh_token": refresh_token})  # Clean up expired token
            return jsonify({"message": "Refresh token has expired"}), 401
        
        # Generate new access token
        new_access_token = generate_access_token(token_doc["email"])

        return jsonify({
            "message": "Token refreshed successfully",
            "access_token": new_access_token,
            "refresh_token": refresh_token  # Return same refresh token
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/expense/transaction', methods=["POST"])
def expense_transaction():
    try:
        # Ensure JSON content
        if not request.is_json:
            return jsonify({"message": "Request must be JSON"}), 400
        
        # Get and validate data
        transactions = request.get_json()
        required_fields = ["amount", "category", "description", "payment_method"]

        if not all(field in transactions for field in required_fields):
            return jsonify({"message": "Missing required fields: amount, category, description, payment_method"}), 400

        # Insert data into MongoDB
        transaction_collection.insert_one({
            "amount": transactions["amount"],
            "category": transactions["category"],
            "description": transactions["description"],
            "payment_method": transactions["payment_method"]
        })

        return jsonify({"message": "Data added successfully"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
# Run the Flask server
if __name__ == "__main__":
    app.run(debug=True, port=5000)