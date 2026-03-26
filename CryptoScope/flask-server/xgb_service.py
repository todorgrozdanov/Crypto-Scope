from flask import Blueprint, jsonify
import psycopg2
import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split

xgb_bp = Blueprint("xgb", __name__)

# the database connection URL for NeonDB
DATABASE_URL = "postgresql://neondb_owner:npg_kq8bTwuC2Byx@ep-quiet-mouse-agrjgu4z.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"


def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def fetch_sentiment():
    conn = get_db_connection()
    query = """
        SELECT finbert_sentiment FROM sentiment
    """
    df = pd.read_sql(query, conn)
    conn.close()

    return df if not df.empty else pd.DataFrame()


def fetch_onchain_by_crypto_id(crypto_id):
    conn = get_db_connection()
    query = """
        SELECT *
        FROM crypto_on_chain coc
        JOIN on_chain oc ON coc.on_chain_id = oc.id
        WHERE coc.crypto_id = %s
    """
    df = pd.read_sql(query, conn, params=(crypto_id,))
    conn.close()

    return df if not df.empty else pd.DataFrame()


def fetch_crypto_price_by_crypto_id(crypto_id):
    conn = get_db_connection()
    query = """
        SELECT date, close
        FROM price
        WHERE crypto_id = %s
    """
    df = pd.read_sql(query, conn, params=[crypto_id])
    conn.close()
    return df.dropna()

@xgb_bp.route("/predict/<int:crypto_id>")
def predict(crypto_id):
    df_sentiment = fetch_sentiment()
    
   
    price_df = fetch_crypto_price_by_crypto_id(crypto_id)
    onchain_df = fetch_onchain_by_crypto_id(crypto_id)
    
   
    if onchain_df.empty:
        df_onchain_price = price_df.copy()
        if not price_df.empty:
            df_onchain_price['active_addresses'] = 0
            df_onchain_price['transactions_count'] = 0
            df_onchain_price['whale_transactions'] = 0
    else:
        df_onchain_price = pd.merge(price_df, onchain_df, on='date', how='left')
    
   
    df = pd.concat([df_onchain_price, df_sentiment], axis=1)
    
  
    if not df.empty and 'close' in df.columns:
        df["predict"] = (df["close"] > df["close"].shift(1)).astype(int)
        if 'finbert_sentiment' in df.columns:
            df['sentiment'] = df['finbert_sentiment'].apply(
                lambda x: 0 if x == 'negative' else 1 if x == 'neutral' else 2
            )
        
        
        columns_to_drop = [col for col in ['id', 'crypto_id', 'on_chain_id', 'finbert_sentiment', 'date'] if col in df.columns]
        df.drop(columns=columns_to_drop, inplace=True, errors='ignore')
        
        X, y = df.drop(columns=['predict'], errors='ignore'), df['predict']
        train_x, test_x, train_y, test_y = train_test_split(X, y, test_size=0.2, random_state=42)
        
        xgb = XGBClassifier(random_state=42)
        xgb.fit(train_x, train_y)
        pred_y = xgb.predict(test_x)
        
        prediction = int(pred_y[-1])
        return jsonify({"prediction": prediction})
    
    return jsonify({"prediction": 0, "error": "Insufficient data"}), 400


@xgb_bp.route("/health")
def health():
    return jsonify({"status": "xgb service healthy"})
