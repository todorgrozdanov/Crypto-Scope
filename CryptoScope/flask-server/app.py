from flask import Flask, jsonify
from flask_cors import CORS
from xgb_service import xgb_bp
from lstm_service import lstm_bp

app = Flask(__name__)

# CORS(app, 
    #  origins="*",  # ✅ Allow all
    #  allow_headers="*",
    #  methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

CORS(app)

# Health check endpoint
@app.route("/")
@app.route("/health")
def health():
    return jsonify({"status": "healthy", "service": "flask-ml-api"})

app.register_blueprint(xgb_bp, url_prefix="/xgb")
app.register_blueprint(lstm_bp, url_prefix="/lstm")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)

