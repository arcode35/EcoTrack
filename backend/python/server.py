from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
import joblib as jb
import tensorflow as tf


app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

@app.route('/python/message', methods=['GET'])
def get_message():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/python/getPredictedUsage', methods=["POST"])
def get_usage():
    return jsonify({"message": "Hello from flask again!"})



if __name__ == '__main__':
    print("app is running")
    app.run(debug=True, port=5001)  # Runn1ng on port 5001
