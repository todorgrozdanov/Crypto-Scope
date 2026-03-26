import pandas as pd
import numpy as np
import psycopg2
import os
import joblib

from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error, r2_score
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.layers import Input
from flask import Blueprint, jsonify, request

lstm_bp = Blueprint("lstm", __name__)

DATABASE_URL = "postgresql://neondb_owner:npg_kq8bTwuC2Byx@ep-quiet-mouse-agrjgu4z.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "lstm_global.keras")
SCALER_PATH = os.path.join(BASE_DIR, "scaler_global.pkl")

#using ohlcv for data preparation, and lookback period
LOOKBACK = 30
FEATURES = ["open", "high", "low", "close", "volume"]

#DB

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def fetch_all_ohlcv():
    conn = get_db_connection()
    query = """
        SELECT crypto_id, date, open, high, low, close, volume
        FROM price
        ORDER BY crypto_id, date ASC
    """
    df = pd.read_sql(query, conn)
    conn.close()
    return df.dropna()

def fetch_crypto_ohlcv(crypto_id):
    conn = get_db_connection()
    query = """
        SELECT date, open, high, low, close, volume
        FROM price
        WHERE crypto_id = %s
        ORDER BY date ASC
    """
    df = pd.read_sql(query, conn, params=[crypto_id])
    conn.close()
    return df.dropna()

#DATA   

def create_global_sequences(df, lookback):
    X, y = [], []

    for crypto_id in df["crypto_id"].unique():
        sub = df[df["crypto_id"] == crypto_id][FEATURES].values

        if len(sub) <= lookback:
            continue

        for i in range(lookback, len(sub)):
            X.append(sub[i - lookback:i])
            y.append(sub[i, 3])  # close price

    return np.array(X), np.array(y)


def build_model(input_shape):
    model = Sequential([
        Input(shape=input_shape),
        LSTM(64, return_sequences=True),
        Dropout(0.2),
        LSTM(64),
        Dropout(0.2),
        Dense(1)
    ])
    # MSE for loss
    model.compile(optimizer="adam", loss="mse")
    return model



def train_global_model():
    df = fetch_all_ohlcv()

    if df.empty:
        return None

    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df[FEATURES])

    df_scaled = df.copy()
    df_scaled[FEATURES] = scaled

    X, y = create_global_sequences(df_scaled, LOOKBACK)

    split = int(0.7 * len(X))
    X_train, X_val = X[:split], X[split:]
    y_train, y_val = y[:split], y[split:]

    model = build_model((LOOKBACK, len(FEATURES)))
    model.fit(
        X_train,
        y_train,
        epochs=3,
        batch_size=128,
        validation_data=(X_val, y_val),
        verbose=1
    )

    # evaluation 
    y_pred = model.predict(X_val).flatten()

    mse = mean_squared_error(y_val, y_pred)
    rmse = np.sqrt(mse)
    mape = mean_absolute_percentage_error(y_val, y_pred)
    r2 = r2_score(y_val, y_pred)

    mean_price = np.mean(y_val)
    confidence = max(0.0, 1.0 - (rmse / mean_price))

    model.save(MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    return {
        "mse": float(mse),
        "rmse": float(rmse),
        "mape": float(mape),
        "r2": float(r2),
        "confidence": float(confidence)
    }


@lstm_bp.route("/predict/<int:crypto_id>")
def predict(crypto_id):

    days = int(request.args.get("days", 7))
    # load model if it exists
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = load_model(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        metrics = None  
    else:
        # train global model once
        metrics = train_global_model()
        if not metrics:
            return jsonify({"error": "Training failed"}), 400
        model = load_model(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)

    # fetch last LOOKBACK days for this crypto
    df = fetch_crypto_ohlcv(crypto_id).tail(LOOKBACK)
    if len(df) < LOOKBACK:
        return jsonify({"error": "Insufficient data"}), 400

    scaled = scaler.transform(df[FEATURES])
    current = scaled.reshape(1, LOOKBACK, len(FEATURES))

    predictions = []
    for _ in range(days):
        pred = model.predict(current, verbose=0)[0][0]
        predictions.append(pred)

        next_row = current[0, -1].copy()
        next_row[3] = pred  # update close
        current = np.roll(current, -1, axis=1)
        current[0, -1] = next_row

    
    dummy = np.zeros((days, len(FEATURES)))
    dummy[:, 3] = predictions
    predictions = scaler.inverse_transform(dummy)[:, 3]

    return jsonify({
        "predictions": predictions.tolist(),
        "confidence": metrics["confidence"] if metrics else None,
        "metrics": metrics
    })


@lstm_bp.route("/train", methods=["POST"])
def train():
    metrics = train_global_model()
    if not metrics:
        return jsonify({"status": "failed"}), 400
    return jsonify({
        "status": "trained",
        "metrics": metrics
    })

@lstm_bp.route("/health")
def health():
    return jsonify({"status": "lstm service healthy"})
