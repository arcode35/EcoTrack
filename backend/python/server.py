import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib as jb
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
import google.generativeai as genai
from random import uniform, randint, gauss
from datetime import datetime
import os
import threading
from dotenv import load_dotenv
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

rf = jb.load("./backend/random_forest.pkl")
gb = jb.load("./backend/gradient_boosting.pkl")
xgb_model = jb.load("./backend/xgboost_model.pkl")
meta_model = jb.load("./backend/meta_model.pkl")
nn_model = tf.keras.models.load_model("./backend/neural_network.h5")

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
            "temperature": gauss(65, 10),
            "humidity": uniform(30, 70),
            "power_use": gauss(40, 15)
        }
        #now wait until ball processes reach the barrier before repeating
        barrier.wait()
        barrierPassed = True

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

@app.route('/python/getPredictedUsage', methods=["POST"])
def get_usage():
    data = request.get_json()
    input_array = np.array(data["input"]).reshape(1, -1)
    print("Input array:", input_array)
    print("Type:", type(input_array))
    print("Dtype:", input_array.dtype)
    print("Shape:", input_array.shape)

    rf_pred = rf.predict(input_array)
    nn_pred = nn_model.predict(input_array)
    gb_pred = gb.predict(input_array)
    xgb_pred = xgb_model.predict(input_array)
    X_meta_user = np.column_stack((rf_pred, nn_pred.flatten(), gb_pred, xgb_pred))
    final_prediction = meta_model.predict(X_meta_user)
    print("full array: ")
    return jsonify({"success": "true", "KwUsed": str(final_prediction[0])})

# function called when frontend wants to get new iot data
@app.route("/python/get_iot_snapshot", methods=["GET"])
def iot_snapshot():
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

def load_data(data):
    """
    Load energy data from JSON file, handling various structures.
    Returns a pandas DataFrame.
    """
    if isinstance(data, list):
        df = pd.DataFrame(data)
    elif isinstance(data, dict):
        if 'records' in data:
            df = pd.DataFrame(data['records'])
        else:
            records = []
            for k, v in data.items():
                if isinstance(v, dict):
                    rec = v.copy(); rec['id'] = k
                    records.append(rec)
            df = pd.DataFrame(records)
    else:
        raise ValueError("Unsupported JSON structure")

    # Rename if needed
    if 'power_use' in df:
        df.rename(columns={'power_use': 'Energy_Consumption'}, inplace=True)

    # Sort by id if exists
    # if 'id' in df.columns:
    #     try:
    #         df['id'] = pd.to_numeric(df['id'])
    #         df.sort_values('id', inplace=True)
    #     except:
    #         df.sort_values('id', inplace=True)

    return df.reset_index(drop=True)

# similar idea as above, but now for when we predicting
predictSemaphore = threading.Semaphore(0)
predictingBarrier = threading.Barrier(numProcesses)
predictThreads = []
predictReturnedData = []
predictSentData = []
predictBarrierPassed = False

# 2) Feature Preparation

def prepare_features(df, feature_columns, target_column='Energy_Consumption'):
    X = df[feature_columns].values.astype(np.float32)
    y = df[target_column].values.reshape(-1,1).astype(np.float32)

    feat_scaler = MinMaxScaler((0,1))
    targ_scaler = MinMaxScaler((0,1))
    X_scaled = feat_scaler.fit_transform(X)
    y_scaled = targ_scaler.fit_transform(y)

    return X_scaled, y_scaled, feat_scaler, targ_scaler

# 3) Sequence Creation

def create_sequences(X, y, time_steps=3):
    X_seq, y_seq = [], []
    for i in range(time_steps, len(X)):
        X_seq.append(X[i-time_steps:i])
        y_seq.append(y[i])
    return np.array(X_seq), np.array(y_seq)

# 4) Model Definition

class EnergyLSTM(nn.Module):
    def __init__(self, input_size, hidden_size=256, num_layers=5, dropout=0.2):
        super(EnergyLSTM, self).__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            dropout=dropout,
            batch_first=True
        )
        self.fc = nn.Linear(hidden_size, 1)

    def forward(self, x):
        # x: (batch, seq_len, input_size)
        out, _ = self.lstm(x)          # out: (batch, seq_len, hidden_size)
        out = out[:, -1, :]            # take last time-step
        out = self.fc(out)             # (batch, 1)
        return out

# 5) Training Loop

def train_model(model, dataloader, epochs=25, lr=1e-3):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)

    model.train()
    for epoch in range(1, epochs+1):
        epoch_loss = 0.0
        for X_batch, y_batch in dataloader:
            X_batch = X_batch.to(device)
            y_batch = y_batch.to(device)

            optimizer.zero_grad()
            outputs = model(X_batch)
            loss = criterion(outputs, y_batch)
            loss.backward()
            optimizer.step()

            epoch_loss += loss.item() * X_batch.size(0)

        epoch_loss /= len(dataloader.dataset)
        if epoch % 5 == 0 or epoch == 1:
            print(f"Epoch {epoch}/{epochs}, Loss: {epoch_loss:.6f}")

    return model

# 6) Evaluation and Prediction

def evaluate_model(model, X, y, targ_scaler, batch_size=32):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.eval()

    X_t = torch.tensor(X).to(device)
    y_t = torch.tensor(y).to(device)

    with torch.no_grad():
        preds = model(X_t).cpu().numpy()

    y_true = targ_scaler.inverse_transform(y)
    y_pred = targ_scaler.inverse_transform(preds)

    mse = np.mean((y_true - y_pred)**2)
    rmse = np.sqrt(mse)
    mae = np.mean(np.abs(y_true - y_pred))

    print(f"MSE: {mse:.4f}, RMSE: {rmse:.4f}, MAE: {mae:.4f}")
    return y_true, y_pred

# 7) Forecast Future

def predict_next_values(model, feat_scaler, targ_scaler, last_seq, future_feats):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.eval()

    future_scaled = feat_scaler.transform(future_feats)
    seq = last_seq.copy()  # shape (1, seq_len, features)
    preds_scaled = []

    for step in range(len(future_feats)):
        inp = torch.tensor(seq, dtype=torch.float32).to(device)
        with torch.no_grad():
            out = model(inp).cpu().numpy()  # shape (1,1)
        preds_scaled.append(out.flatten()[0])

        # roll sequence and append new features
        seq = np.concatenate([seq[:,1:,:], future_scaled[step].reshape(1,1,-1)], axis=1)

    preds = targ_scaler.inverse_transform(np.array(preds_scaled).reshape(-1,1))
    return preds

# 8) Plotting
"""
def plot_results(actual, predicted=None, forecast=None, title='Energy Consumption'):
    plt.figure(figsize=(10,5))
    plt.plot(actual, label='Actual')
    if predicted is not None:
        plt.plot(range(len(actual)-len(predicted), len(actual)), predicted, label='Predicted')
    if forecast is not None:
        plt.plot(range(len(actual), len(actual)+len(forecast)), forecast, '--', label='Forecast')
    plt.title(title)
    plt.xlabel('Time')
    plt.ylabel('Energy Consumption')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show() """

def iotThread(index):
    global predictBarrierPassed, predictSentData
    while(True):
        predictSemaphore.acquire()

        data  = load_data(predictSentData[index])
        # Define features and target
        features = ['humidity', 'temperature']
        target = 'Energy_Consumption'
        time_steps = 3

        # Prepare datadata b
        X_scaled, y_scaled, fsc, tsc = prepare_features(data, features, target)
        X_seq, y_seq = create_sequences(X_scaled, y_scaled, time_steps)

        # Split train/test
        X_tr, X_te, y_tr, y_te = train_test_split(
            X_seq, y_seq, test_size=0.2, shuffle=False)

        # Create DataLoader
        train_ds = TensorDataset(
            torch.tensor(X_tr), torch.tensor(y_tr)
        )
        train_loader = DataLoader(train_ds, batch_size=8, shuffle=True)

        # Instantiate and train model
        model = EnergyLSTM(input_size=X_seq.shape[2])
        model = train_model(model, train_loader, epochs=25)

        # Evaluate
        actual, pred = evaluate_model(model, X_te, y_te, tsc)
        # plot_results(actual, predicted=pred, title='Test Predictions')

        # Forecast next points
        future_feats = data[features].iloc[-3:].values
        future_preds = predict_next_values(
            model, fsc, tsc, X_seq[-1:].copy(), future_feats)
        finalResults = future_preds.flatten()
        print("Future predictions:", finalResults)
        # plot_results(actual, forecast=future_preds, title='With Future Forecast'
        returnedData[index] = finalResults[0]
        predictingBarrier.wait()
        predictBarrierPassed = True

# 9) Putting It All Together
@app.route("/python/next_iot_data", methods = ["POST"])
def prediectedIOT():
    # Load your data
    data = request.get_json()
    data = data["theData"]
    # NOTE THAT DATA WILL BE A 2D ARRAY! THE OUTER ELEMS WILL BE FOR EACH DEVICE, INNER ELEMS WILL BE THE DATA FOR THAT DEVICE
    sum = 0

    for i in range(numProcesses):
        predictSemaphore.release()

    while(not predictBarrierPassed):
        pass

    predictingBarrier.reset()
    for i in range(predictSentData):
        sum += predictSentData[i]
    return jsonify({"success": "true", "result": float(sum)})

# intiializing all of the threads
for i in range(numProcesses):
    threads.append(threading.Thread(target=getRandoVals, args=(i,), daemon=True))
    predictThreads.append(threading.Thread(target = iotThread, args=(i,), daemon= True))
    threads[i].start()
    predictThreads[i].start()
    predictReturnedData.append(None)
    predictSentData.append(None)
    returnedData.append(None)

if __name__ == '__main__':
    print("app is running")
    app.run(debug=True, port=5001)  # Runn1ng on port 500