import joblib
import numpy as np
import pandas as pd

# Load the trained KMeans model and the scaler
kmeans = joblib.load("kmeans_model.pkl")
scaler = joblib.load("scaler.pkl")  # Ensure you saved the scaler in training

# Define feature names (must match training)
feature_names = ["Weighted Score", "Normalized Time Spent"]

def predict_cluster():
    try:
        # Get user input
        weighted_score = float(input("Enter Weighted Score (0-100): "))
        normalized_time_spent = float(input("Enter Normalized Time Spent: "))

        # Convert input to DataFrame (preserves feature names)
        input_data = pd.DataFrame([[weighted_score, normalized_time_spent]], columns=feature_names)

        # Standardize the input using the saved scaler
        scaled_features = scaler.transform(input_data)

        # Predict the cluster
        cluster_prediction = kmeans.predict(scaled_features)

        # Cluster Mapping (Ensure correct labeling)
        cluster_labels = {0: "Slow Learner", 1: "Average Learner", 2: "Fast Learner"}

        print(f"\nPredicted Cluster: {cluster_prediction[0]} ({cluster_labels[cluster_prediction[0]]})")

    except Exception as e:
        print(f"Error: {e}")

# Run the function
if __name__ == "__main__":
    predict_cluster()
