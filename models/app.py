import joblib
import numpy as np
from flask import Flask, request, jsonify

# Load trained model and scaler
model = joblib.load("kmeans_model.pkl")
scaler = joblib.load("scaler.pkl")

# Define feature names (consistent with training)
feature_names = ["Weighted Score", "Normalized Time Spent"]

# Flask App Initialization
app = Flask(__name__)

@app.route("/predict-cluster", methods=["POST"])
def predict_cluster():
    try:
        # Extract input features from request
        data = request.json["features"]
        
        # Convert input to a NumPy array and reshape
        input_data = np.array([data])

        # Standardize the input using the trained scaler
        scaled_data = scaler.transform(input_data)

        # Predict the cluster
        prediction = model.predict(scaled_data)[0]

        # Cluster Mapping
        cluster_labels = {0: "Average Learner", 1: "Slow Learner", 2: "Fast Learner"}

        # Return JSON response
        return jsonify({"cluster": int(prediction), "label": cluster_labels[int(prediction)]})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
