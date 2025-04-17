import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib as jb
import tensorflow as tf
import google.generativeai as genai
from random import uniform, randint, gauss
from datetime import datetime
import os
import threading
from dotenv import load_dotenv
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

rf = jb.load("./backend/random_forest.pkl")
gb = jb.load("./backend/gradient_boosting.pkl")
xgb_model = jb.load("./backend/xgboost_model.pkl")
meta_model = jb.load("./backend/meta_model.pkl")
nn_model = tf.keras.models.load_model("./backend/neural_network.h5")

day = 0
# number of processes we'll have to get random values from
numProcesses = 6
threads = []
returnedData = []
barrierPassed = False

#going to use sempahores to block while threads wait for data and to unblock
semaphore = threading.Semaphore(0)
#use a barrier to make sure if say releasing 5 semaphores at once, one process doesn't take a semaphore, finish, and take another semaphore
barrier = threading.Barrier(numProcesses)

# function that threads call to generate random values nad put them somewhere that the api call can get
def getRandoVals(index):
    global barrierPassed
    while(True):
        # wait until api function releases semaphore
        semaphore.acquire()    
        # get the random values, and put them in the buffer
        returnedData[index] = {
            "id": index,
            "snapshot_day": day,
            "temperature": gauss(65, 10),
            "humidity": uniform(30, 70),
            "power_use": gauss(40, 15)
        }
        #now wait until ball processes reach the barrier before repeating
        barrier.wait()
        barrierPassed = True

# intiializing all of the threads
for i in range(numProcesses):
    threads.append(threading.Thread(target=getRandoVals, args=(i,), daemon=True))
    threads[i].start()
    returnedData.append(None)

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

# function called when frontend wants to get new iot data
@app.route("/python/get_iot_snapshot", methods=["POST"])
def iot_snapshot():
    # increment the current day by 1
    global day
    data = request.get_json()
    day = data["time"]
    # release all the semaphores
    for i in range(numProcesses):
        semaphore.release()
    # wait until all thhreads finish writing data
    while(not barrierPassed):
        #busy waiting yay
        pass
    # reset the barrier now
    barrier.reset()
    # return all the cool new data
    return jsonify(returnedData)


if __name__ == '__main__':
    print("app is running")
    app.run(debug=True, port=5001)  # Runn1ng on port 5001
