from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib as jb
import tensorflow as tf
import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

rf = jb.load("./backend/random_forest.pkl")
gb = jb.load("./backend/gradient_boosting.pkl")
xgb_model = jb.load("./backend/xgboost_model.pkl")
meta_model = jb.load("./backend/meta_model.pkl")
nn_model = tf.keras.models.load_model("./backend/neural_network.h5")


app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

@app.route('/python/getPredictedUsage', methods=["POST"])
def get_usage():
    data = request.get_json()
    input_array = np.array(data["input"]).reshape(1, -1)

    rf_pred = rf.predict(input_array)
    nn_pred = nn_model.predict(input_array)
    gb_pred = gb.predict(input_array)
    xgb_pred = xgb_model.predict(input_array)
    X_meta_user = np.column_stack((rf_pred, nn_pred.flatten(), gb_pred, xgb_pred))
    final_prediction = meta_model.predict(X_meta_user)
    print(final_prediction[0])
    question = f"Consider a user with the following house specifications (input array) and my model is predicting that {final_prediction[0]} KWH are consumed. List down your suggestions to minimize the power usage."
    answer = model.generate_content(question).text
    return jsonify({"success": "true", "KwUsed": str(final_prediction[0]), "GeminiAnswer": answer})



if __name__ == '__main__':
    print("app is running")
    app.run(debug=True, port=5001)  # Runn1ng on port 5001
