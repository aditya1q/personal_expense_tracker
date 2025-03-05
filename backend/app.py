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
income_collection = db['income']

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

# Define the POST route for expense transaction
@app.route('/api/expense/transaction', methods=["POST"])
def expense_transaction():
    try:
        # Ensure JSON content
        if not request.is_json:
            return jsonify({"message": "Request must be JSON"}), 400
        
        # Get and validate data
        transactions = request.get_json()
        required_fields = ["date", "amount", "category", "description", "payment_method"]

        if not all(field in transactions for field in required_fields):
            return jsonify({"message": "Missing required fields: date, amount, category, description, payment_method"}), 400

        new_transaction = {
            "date": transactions["date"],
            "amount": transactions["amount"],
            "category": transactions["category"],
            "description": transactions["description"],
            "payment_method": transactions["payment_method"]
        }
        result = transaction_collection.insert_one(new_transaction)

        # Add the inserted _id to the new_transaction dictionary
        new_transaction["_id"] = str(result.inserted_id)  # Convert ObjectId to string for JSON compatibility

        return jsonify({"message": "Data added successfully", "transaction": new_transaction}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# Define the GET route for get all expense transaction
@app.route('/api/expense/transaction', methods=["GET"])
def get_expense_transaction():

    try:
        getTransaction = list(transaction_collection.find())
        for transaction in getTransaction:
            transaction['id'] = str(transaction['_id'])
            transaction.pop('_id')

        return jsonify(getTransaction)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# Define the GET route for get all expense transaction in chart
@app.route('/api/expense/transaction/chart', methods=["GET"])
def get_expense_transaction_chart():
    try:
        # Ensure unique index on 'date' and 'amount' in chart_collection (run once)
        chart_collection.create_index([("date", 1), ("amount", 1), ("category", 1)], unique=True)

        # Fetch only 'date', 'amount' and 'catogory' fields from transaction_collection
        transaction_chart = list(transaction_collection.find({}, {"date": 1, "amount": 1, "category": 1}))

        # Store the chart data (update or insert if not exists)
        for transaction in transaction_chart:
            chart_collection.update_one(
                {"date": transaction["date"], "amount": transaction["amount"]},  # Match existing
                {"$set": {
                    "date": transaction["date"],
                    "amount": transaction["amount"],
                    "category": transaction["category"]
                }},
                upsert=True  # Insert if not exists
            )

        # Retrieve and return the stored chart data with id
        stored_chart_data = list(chart_collection.find({}, {"_id": 1, "date": 1, "amount": 1, "category":1}))

        # Convert ObjectId to string for JSON serialization
        for transaction in stored_chart_data:
            transaction["id"] = str(transaction["_id"])
            transaction.pop("_id")

        return jsonify(stored_chart_data), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# Define the GET route for get transaction overview in dashboard card
@app.route('/api/expense/overview', methods=["GET"])
def get_expense_overview():
    try:
        current_time = datetime.datetime.utcnow()
        # print(current_time)
        current_year = current_time.year
        current_month = current_time.month

        # Check the last recorded month in income_collection
        income_record = income_collection.find_one({"_id": "monthly_income_tracker"})
        
        if income_record:
            last_year = income_record.get("last_year", 0)
            last_month = income_record.get("last_month", 0)
            total_income = income_record.get("total_income", 0.0)
        else:
            # Initialize if no record exists
            last_year = current_year
            last_month = current_month - 1 if current_month > 1 else 12
            total_income = 0.0

        # Calculate months passed since last update
        months_passed = (current_year - last_year) * 12 + (current_month - last_month)
        if months_passed > 0:
            # Add 30,000 for each new month
            total_income += 30000.0 * months_passed
            # Update the income record
            income_collection.update_one(
                {"_id": "monthly_income_tracker"},
                {
                    "$set": {
                        "total_income": total_income,
                        "last_year": current_year,
                        "last_month": current_month
                    }
                },
                upsert=True
            )

        monthly_income = 30000.0  # Base income per month
        cumulative_income = total_income  # Total income up to this point

        # --- Fetch Expenses ---
        expenses = list(transaction_collection.aggregate([
            {"$match": {"date": {"$exists": True}}},
            {"$project": {"date": {"$dateFromString": {"dateString": "$date"}}, "amount": 1, "_id": 0}},
            {
                "$match": {
                    "$expr": {
                        "$and": [
                            {"$eq": [{"$year": "$date"}, current_year]},
                            {"$eq": [{"$month": "$date"}, current_month]},
                        ]
                    }
                }
            }
        ]))

        total_expense = 0.0
        for expense in expenses:
            try:
                total_expense += float(expense.get("amount", 0))
            except (ValueError, TypeError):
                print(f"Invalid amount in expense: {expense}")
                continue

        # Financial calculations
        monthly_expense = total_expense
        monthly_savings = monthly_income - monthly_expense
        total_savings = cumulative_income - monthly_expense  # Total savings includes all past income

        # --- Sync to card_collection ---
        if expenses:
            for expense in expenses:
                card_collection.update_one(
                    {
                        "year": current_year,
                        "month": current_month,
                        "date": expense["date"]
                    },
                    {
                        "$set": {
                            "amount": expense["amount"],
                            "year": current_year,
                            "month": current_month
                        }
                    },
                    upsert=True
                )

        # JSON response
        return jsonify({
            "year": current_year,
            "month": current_month,
            "total_expense": total_expense,
            "monthly_income": monthly_income,  # Income for current month
            "cumulative_income": cumulative_income,  # Total income accumulated
            "monthly_expense": monthly_expense,
            "monthly_savings": monthly_savings,
            "total_savings": total_savings
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
# Run the Flask server
if __name__ == "__main__":
    app.run(debug=True, port=5000)