# PyTorch Implementation of Energy Consumption LSTM Pipeline

import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

# 1) Data Loading

def load_json_data(json_file_path):
    """
    Load energy data from JSON file, handling various structures.
    Returns a pandas DataFrame.
    """
    with open(json_file_path, 'r') as f:
        data = json.load(f)

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
    if 'id' in df.columns:
        try:
            df['id'] = pd.to_numeric(df['id'])
            df.sort_values('id', inplace=True)
        except:
            df.sort_values('id', inplace=True)

    return df.reset_index(drop=True)

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

# 9) Putting It All Together
if __name__ == '__main__':
    # Load your data
    data = load_json_data('/Users/gayathriutla/Desktop/Projects/EcoTrack/simulated_sensor_data.json')

    # Define features and target
    features = ['humidity', 'temperature']
    target = 'Energy_Consumption'
    time_steps = 3

    # Prepare data
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
    print("Future predictions:", future_preds.flatten())
    # plot_results(actual, forecast=future_preds, title='With Future Forecast')
