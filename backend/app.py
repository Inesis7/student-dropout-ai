from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import traceback

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for development

# Load your model (update path as needed)
try:
    model = joblib.load("model/dropout_model.pkl")  # Fixed path
    print("✅ Model loaded successfully!")
except:
    print("⚠️ Model not found - Using mock predictions")
    model = None

@app.route("/")
def home():
    return """
    <h1>🎓 Student Dropout Predictor API</h1>
    <p>🚀 Server running on port 5000</p>
    <h3>✅ Frontend Compatible Endpoints:</h3>
    <ul>
        <li>POST <code>/predict</code> - Returns <code>{"prediction": 0/1/2}</code></li>
        <li>Supports all frontend data formats</li>
    </ul>
    """

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        print("📥 Received data:", data)
        
        # Handle missing model with intelligent mock logic
        if model is None:
            return mock_prediction(data)
        
        # Map frontend data to your model features
        features = np.array([[
            map_age(data.get("fullName", "")),
            map_gender(data.get("fullName", "")),
            data.get("sem1_passed", 0),  # Curricular units 1st sem (approved)
            data.get("sem1_grade", 0),   # Curricular units 1st sem (grade) 
            data.get("sem2_passed", 0),  # Curricular units 2nd sem (approved)
            data.get("sem2_grade", 0),   # Curricular units 2nd sem (grade)
            1 if data.get("feesPaid", False) else 0,  # Tuition fees up to date
            1 if data.get("scholarship", False) else 0  # Scholarship holder
        ]])
        
        print("🔢 Features prepared:", features.flatten())
        
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features).max()
        
        print(f"🤖 Model Prediction: {int(prediction)} (confidence: {probability:.2f})")
        
        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability),
            "student": {
                "name": data.get("fullName", "Unknown"),
                "regNumber": data.get("regNumber", "N/A")
            }
        })
        
    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        print(traceback.format_exc())
        return mock_prediction(data), 500

def mock_prediction(data):
    """Intelligent fallback prediction matching frontend logic"""
    print("🧠 Using intelligent mock prediction")
    
    # Same logic as frontend mock for consistency
    score = 0
    
    # Fees (40%)
    fees_paid = data.get("feesPaid", False)
    if not fees_paid:
        return jsonify({"prediction": 0})  # High risk
    
    score += 40
    
    # Scholarship (10%)
    scholarship = data.get("scholarship", False)
    if scholarship:
        score += 10
    
    # Academics (50%)
    sem1_pass_rate = (data.get("sem1_passed", 0) / max(data.get("sem1_total", 1), 1)) * 100
    sem2_pass_rate = (data.get("sem2_passed", 0) / max(data.get("sem2_total", 1), 1)) * 100
    avg_pass_rate = (sem1_pass_rate + sem2_pass_rate) / 2
    
    avg_grade = (data.get("sem1_grade", 0) + data.get("sem2_grade", 0)) / 2
    
    score += avg_pass_rate * 0.3
    score += (avg_grade / 20) * 20
    
    print(f"📊 Mock calc - Pass: {avg_pass_rate:.1f}%, Grade: {avg_grade:.1f}, Score: {score:.1f}")
    
    # Same thresholds as frontend
    if score < 45:
        prediction = 0
    elif score < 75:
        prediction = 1
    else:
        prediction = 2
    
    return jsonify({"prediction": prediction})

def map_age(name):
    """Mock age based on name (replace with real logic)"""
    return 20  # Default student age

def map_gender(name):
    """Mock gender based on name (replace with real logic)"""
    return 0  # Default

# Health check endpoint
@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": "2024"
    })

if __name__ == "__main__":
    print("🚀 Starting Student Dropout Predictor API...")
    print("📡 Listening on http://127.0.0.1:5000")
    print("✅ CORS enabled for all origins")
    app.run(debug=True, host='127.0.0.1', port=5000)