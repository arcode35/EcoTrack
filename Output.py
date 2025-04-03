import numpy as np

"""input_array = [[]] #have to update this"""

import joblib as jb
rf = jb.load("/Users/gayathriutla/learning/EcoTrack/f_random.pkl")
gb = jb.load("/Users/gayathriutla/learning/EcoTrack/f_gboost_model.pkl")
xgb_model = jb.load("/Users/gayathriutla/learning/EcoTrack/f_xgboost_model.pkl")
meta_model = jb.load("/Users/gayathriutla/learning/EcoTrack/f_metamodel.pkl")

import tensorflow as tf
model = tf.keras.models.load_model("/Users/gayathriutla/learning/EcoTrack/f_neural.h5")

rf_pred = rf.predict(input_array)
nn_pred = model.predict(input_array)
gb_pred = gb.predict(input_array)
xgb_pred = xgb_model.predict(input_array)

X_meta_user = np.column_stack((rf_pred, nn_pred.flatten(), gb_pred, xgb_pred))

final_prediction = meta_model.predict(X_meta_user)

print(f"Final Stacked Model Prediction: {final_prediction[0]}")

"""Cost_per_unit = #need to get it using api call"""

import google.generativeai as genai

# Set up your Gemini API key
genai.configure(api_key="AIzaSyDpMRdgW84A-Ii7Yt7IJvhZFFOYLJwcyEs")

# Initialize the model
model = genai.GenerativeModel("gemini-pro")

# Function to ask a question
def ask_gemini(question):
    response = model.generate_content(question)
    return response.text  # Extract the text response

# Example usage
question = "Consider a user with the following house specifications (input array) and my model is predicting that {final_prediction} KWH are consumed list down your suggestions to minimize the power usage?"
answer = ask_gemini(question)
print("Answer:", answer)
