## 🛠️ Installation

```sh
# Clone the repository
git clone https://github.com/alexPalladis/Timeseries.git

# Navigate to the project directory
cd Timeseries

# Install dependencies for backend and frontend
*From the root directory of the project:
cd backend && npm install
cd frontend && npm install
```

## 📌 Usage


```sh
# Start the backend server (Node.js on port 5000)
cd backend
node server.js
```

```sh
# Start the frontend application (React on port 3000)
cd frontend
npm start
```

Ensure both backend and frontend are running simultaneously for full functionality.

## 📡 API Endpoint

You can access the time series data from the following API endpoint:

```sh
GET http://localhost:5000/api/timeseries
```

This endpoint retrieves the time series data from the backend server.
