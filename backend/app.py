from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load("../model/dropout_model.pkl")

@app.route("/")
def home():
    return "API Running 🚀"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        features = np.array([[
            data["Age at enrollment"],
            data["Gender"],
            data["Curricular units 1st sem (approved)"],
            data["Curricular units 1st sem (grade)"],
            data["Curricular units 2nd sem (approved)"],
            data["Curricular units 2nd sem (grade)"],
            data["Tuition fees up to date"],
            data["Scholarship holder"]
        ]])

        prediction = model.predict(features)[0]
        probability = model.predict_proba(features).max()

        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability)
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)