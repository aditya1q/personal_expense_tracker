from flask import Flask, request, jsonify
from  flask_cors import CORS
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/') # local mongodb
db = client['personal_expense_tracker'] # Access db from here
personal_expense_tracker = db['expense_tracker'] # mongo collection


app = Flask(__name__)
CORS(app)

data =[
    {
    "name": "Aditya Aiwari",
    "course": "MCA"
    }
]

@app.route('/', methods=["GET"])
def get_route():
    # expense = list(personal_expense_tracker.find())
    return data





# starts the flask server
if __name__ == "__main__":
    app.run(debug=True, port=5000)