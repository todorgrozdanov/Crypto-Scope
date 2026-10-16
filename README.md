# Crypto-Scope

**A full stack cryptocurrency analytics application combining interactive market dashboards, technical indicators, news sentiment, and machine learning experiments.**

Crypto-Scope brings market exploration and historical analysis into one interface. Users can compare cryptocurrencies, inspect price charts, select technical indicators, and request experimental price and movement predictions.

The project connects a **React and TypeScript** frontend to **Spring Boot REST APIs**, **PostgreSQL**, and a **Python/Flask machine learning service**.

## Features

### Market overview
- Sort cryptocurrencies by price, market capitalization, trading volume, and percentage changes.
- Compare daily, weekly, and monthly price changes.
- Open individual cryptocurrency detail pages.
- Browse recent news with sentiment information.

### Interactive analysis
- Explore historical OHLCV data through candlestick charts.
- Switch between available time ranges, from one week to the full stored history.
- Select technical indicators, including moving averages, Bollinger Bands, RSI, MACD, Stochastic, ADX, and CCI.
- View loading states while market data and predictions are requested.

### Machine learning
- **LSTM:** generates experimental closing-price forecasts from historical OHLCV sequences.
- **XGBoost:** provides a price-movement classification endpoint using price, sentiment, and available on-chain features.
- **Data preparation:** notebooks support market-data collection and sentiment/on-chain processing.

Prediction availability depends on database contents and model readiness. These features are educational experiments; no trading performance or prediction accuracy is claimed.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Visualization | ApexCharts, Chart.js |
| Backend | Java 17, Spring Boot, Spring Data JPA, PostgreSQL |
| Machine learning | Python, Flask, TensorFlow/Keras, XGBoost, scikit-learn |
| Data processing | pandas, NumPy, psycopg2, Jupyter notebooks |
| Development and deployment | Maven, Docker, Docker Compose, Azure deployment configuration |

## Architecture

| Component | Responsibility | Local port |
| --- | --- | --- |
| `frontend` | Market dashboard, charts, news, and prediction views | `5173` |
| `backend-spring` | Frontend-facing API, crypto-data gateway, sentiment, and prediction coordination | `8080` |
| `crypto-data-service` | Cryptocurrency data API | `8081` |
| `flask-server` | LSTM and XGBoost endpoints | `5001` |
| PostgreSQL | Market history, cryptocurrency metadata, sentiment, and related data | Configured separately |

The frontend calls the main Spring Boot API. Crypto-data requests are forwarded to the second Spring service, while prediction requests are coordinated with Flask. The Java and Python services use PostgreSQL-backed data.

## Repository structure

| Path | Contents |
| --- | --- |
| `CryptoScope/frontend/` | React and TypeScript application |
| `CryptoScope/backend-spring/` | Main Spring Boot API |
| `CryptoScope/crypto-data-service/` | Cryptocurrency data service |
| `CryptoScope/flask-server/` | Flask endpoints, ML code, model artifacts, and notebooks |
| `CryptoScope/docker-compose.yml` | Four-service development configuration |
| `CryptoScope/azure_links.txt` | Deployment addresses recorded for the project |

## Getting started

### Requirements

- Git
- Docker with Docker Compose for the container workflow
- A PostgreSQL database populated with compatible project data
- For running individual services: Java 17, Python 3.11, and a Node.js version compatible with Vite 7 (Node.js 22.12+ recommended)

### 1. Clone the repository

```bash
git clone https://github.com/todorgrozdanov/Crypto-Scope.git
cd Crypto-Scope/CryptoScope
```

### 2. Configure database access and service addresses

The checked-in configuration targets an Azure deployment and an externally hosted database. **Local setup requires configuration changes before startup.**

- Set PostgreSQL connection details in both Spring services' `src/main/resources/application.properties` files.
- Set `DATABASE_URL` in `flask-server/lstm_service.py` and `flask-server/xgb_service.py` to your own development database connection.
- Update frontend API addresses in `frontend/src/api.ts`, `frontend/src/pages/Home.tsx`, and `frontend/src/pages/Crypto.tsx` to use your intended backend.
- Update service URLs in `CryptoGatewayController.java` and the predictor implementations under `backend-spring/.../services/predictors/`.
- Review CORS configuration and controller-level origins to allow the frontend origin you use.

For local browser requests, the main API address is `http://localhost:8080`. For requests between Compose containers, use service names such as `http://backend2:8081` and `http://flask-server:5001` instead of `localhost`.

Use your own credentials and keep them out of version control. Moving credentials and service addresses into environment-based configuration is recommended; simply creating an `.env` file does not replace values currently hardcoded in the source.

### 3. Prepare data

The Compose file does **not** create a PostgreSQL container or populate the database. Configure a separate database before starting the application.

The services expect compatible cryptocurrency and historical market data, including tables used for prices, sentiment, and on-chain information. The data service is configured with automatic schema generation disabled, so an empty database is insufficient.

The notebooks in `flask-server/` provide data-processing workflows:

- `fetch.ipynb`
- `sentiment_onchain.ipynb`

Review their configuration and dependencies before execution. A complete automated database initialization and seed workflow is not currently included.

### 4. Start the services

After completing configuration and database preparation:

```bash
docker compose up --build
```

Open the frontend at [http://localhost:5173](http://localhost:5173).

The Flask health endpoint is [http://localhost:5001/health](http://localhost:5001/health).

To stop the services:

```bash
docker compose down
```

### Frontend development

From `CryptoScope/frontend/`:

```bash
npm install
npm run dev
```

Additional commands:

```bash
npm run build
npm run lint
npm run preview
```

### Prediction model behavior

The LSTM service uses a 30-observation lookback and requires sufficient historical data for the requested cryptocurrency. It loads the saved model and scaler when present; if either is missing, the prediction path attempts to train a model from database history.

Explicit LSTM training is also available through `POST /lstm/train`. Training can be resource-intensive and requires suitable data. The returned `confidence` field is a custom model metric, not a calibrated probability of forecast correctness.

## API overview

### Main Spring Boot API — port 8080

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/crypto` | List cryptocurrency market data |
| `GET` | `/api/crypto/{coinGeckoId}` | Retrieve cryptocurrency details |
| `GET` | `/api/crypto/{coinGeckoId}/ohlcv?timeframe=...` | Forward a historical-data request |
| `GET` | `/api/sentiment` | Retrieve news and sentiment data |
| `GET` | `/api/prediction/{coinGeckoId}/lstm/predict?days=7` | Request an LSTM forecast |
| `GET` | `/api/prediction/{coinGeckoId}/xgb/predict` | Request a movement prediction |

### Flask service — port 5001

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Service health check |
| `GET` | `/lstm/health` | LSTM route health check |
| `GET` | `/lstm/predict/{crypto_id}?days=7` | Forecast using an internal numeric cryptocurrency ID |
| `POST` | `/lstm/train` | Train the global LSTM model |
| `GET` | `/xgb/predict/{crypto_id}` | Classify price movement |

The Java API accepts CoinGecko identifiers, while the Flask prediction endpoints accept internal numeric database IDs.

## Deployment and current limitations

Azure service addresses are recorded in [`CryptoScope/azure_links.txt`](CryptoScope/azure_links.txt). Deployment availability may change; those addresses are not a guarantee of an active demo.

- Local deployment currently needs manual URL, database, and CORS configuration.
- An automated database bootstrap and seed process is not included.
- Charts and predictions depend on the availability and completeness of stored data.
- ML outputs are experimental and should not be interpreted as validated investment signals.
- The current frontend container runs the Vite development server, and Flask starts in debug mode; these settings should be changed for production hosting.

## Contributors

This repository contains a collaborative project. See the [GitHub contributors](https://github.com/todorgrozdanov/Crypto-Scope/graphs/contributors) and commit history for recorded contributions.
