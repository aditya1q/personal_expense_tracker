from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt

# Step 1: Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')  # Local MongoDB connection
db = client['personal_expense_tracker']  # Access the database
users_collection = db['users']  # Access the collection

# Step 2: Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests (e.g., from your Next.js frontend)

# Step 4: Define the GET route to fetch data from MongoDB
@app.route('/api/v1/register', methods=["POST"])
def register_user():
    # return jsonify({"message":"Hello from the expense tracker API"})
    try:
        # get data from the req body(like we are doing req.body.json in node)
        user_data = request.get_json()

        # username email and password is required
        if not user_data or "username" not in user_data or "email" not in user_data or "password" not in user_data:
            return jsonify({"message": "Missing required field: username, email, password"}), 400
        
        # if email is registered then show that meessage
        if users_collection.find_one({"email": user_data["email"]}):
            return jsonify({"message": "User with this email already exists"}), 409
        
        password = user_data["password"].encode('utf-8') # convert to bytes
        hashed_password = bcrypt.hashpw(password, bcrypt.gensalt()) # Hash with salt

        users_collection.insert_one({
            "username": user_data["username"],
            "email": user_data["email"],
            "password": hashed_password
        })
        return jsonify({"message":"User registered successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(0)}), 500


@app.route('/api/v1/login', methods=["POST"])

def login_user():
    try:
        login_data = request.get_json()
        if not login_data or "email" not in login_data or "password" not in login_data:
            return jsonify({"message": "Missing required field: email, password"}), 400
        
        # Find the user by email
        user = users_collection.find_one({"email": login_data["email"]})
        if not user:
            return jsonify({"message": "Invalid email or password"}), 401
        
        # Verify the password
        input_password = login_data['password'].encode('utf-8')
        stored_password = user["password"]

        if bcrypt.checkpw(input_password, stored_password):
            return jsonify({"message": 'Login successfull', "username": user["username"]}), 200
        else:
            return jsonify({"message": "Invailid email or password"}), 401       
        
    except Exception as e:
        return jsonify({"error": str(0)}), 500

# Step 6: Run the Flask server and initialize data
if __name__ == "__main__":
    app.run(debug=True, port=5000)