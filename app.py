from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load the model and scaler
MODEL_PATH = os.path.join('model', 'random_forest.pkl')
SCALER_PATH = os.path.join('model', 'scaler.pkl')

# Store model accuracy (loaded from file, not hardcoded)
MODEL_ACCURACY = None

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    
    # Try to load accuracy from a separate file if it exists
    ACCURACY_PATH = os.path.join('model', 'accuracy.txt')
    if os.path.exists(ACCURACY_PATH):
        with open(ACCURACY_PATH, 'r') as f:
            MODEL_ACCURACY = float(f.read().strip())
        print(f"✓ Model and scaler loaded successfully!")
        print(f"✓ Model Accuracy: {MODEL_ACCURACY}%")
    else:
        print("✓ Model and scaler loaded successfully!")
        print("⚠ No accuracy file found at 'model/accuracy.txt'")
        print("  Run calculate_accuracy.py to generate the accuracy file")
    
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None
    scaler = None
    MODEL_ACCURACY = None

@app.route('/')
def home():
    return jsonify({
        "message": "Diabetes Prediction API",
        "status": "running",
        "accuracy": MODEL_ACCURACY,
        "endpoints": {
            "/predict": "POST - Single prediction",
            "/predict/batch": "POST - Batch prediction",
            "/health": "GET - Health check"
        }
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None or scaler is None:
            return jsonify({
                "error": "Model not loaded. Please ensure model files exist."
            }), 500

        data = request.get_json()
        
        # Extract features in the correct order
        features = [
            float(data.get('pregnancies', 0)),
            float(data.get('glucose', 0)),
            float(data.get('bloodPressure', 0)),
            float(data.get('skinThickness', 0)),
            float(data.get('insulin', 0)),
            float(data.get('bmi', 0)),
            float(data.get('diabetesPedigreeFunction', 0)),
            float(data.get('age', 0))
        ]
        
        # Convert to numpy array and reshape
        features_array = np.array(features).reshape(1, -1)
        
        # Scale the features
        features_scaled = scaler.transform(features_array)
        
        # Make prediction using ML model (NOT HARDCODED!)
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0]
        
        # Get the probability of having diabetes (class 1)
        # This changes based on input - calculated by ML model
        diabetes_probability = float(probability[1] * 100)
        
        return jsonify({
            "prediction": int(prediction),
            "probability": round(diabetes_probability, 2),
            "risk_level": get_risk_level(diabetes_probability),
            "message": "Prediction successful"
        })
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Prediction failed"
        }), 400

@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    try:
        if model is None or scaler is None:
            return jsonify({
                "error": "Model not loaded. Please ensure model files exist."
            }), 500

        data = request.get_json()
        predictions_list = []
        
        for item in data.get('patients', []):
            features = [
                float(item.get('pregnancies', 0)),
                float(item.get('glucose', 0)),
                float(item.get('bloodPressure', 0)),
                float(item.get('skinThickness', 0)),
                float(item.get('insulin', 0)),
                float(item.get('bmi', 0)),
                float(item.get('diabetesPedigreeFunction', 0)),
                float(item.get('age', 0))
            ]
            
            features_array = np.array(features).reshape(1, -1)
            features_scaled = scaler.transform(features_array)
            
            prediction = model.predict(features_scaled)[0]
            probability = model.predict_proba(features_scaled)[0]
            diabetes_probability = float(probability[1] * 100)
            
            predictions_list.append({
                "prediction": int(prediction),
                "probability": round(diabetes_probability, 2),
                "risk_level": get_risk_level(diabetes_probability)
            })
        
        return jsonify({
            "predictions": predictions_list,
            "count": len(predictions_list),
            "message": "Batch prediction successful"
        })
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Batch prediction failed"
        }), 400

def get_risk_level(probability):
    """Calculate risk level based on prediction probability"""
    if probability < 30:
        return "Low Risk"
    elif probability < 60:
        return "Moderate Risk"
    else:
        return "High Risk"

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "accuracy": MODEL_ACCURACY  # Returns None if not available
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("Starting Diabetes Prediction API")
    print("="*50)
    print(f"Server: http://127.0.0.1:5000")
    print(f"Model Status: {'Loaded' if model else 'Not Loaded'}")
    print(f"Accuracy: {MODEL_ACCURACY}%" if MODEL_ACCURACY else "📊 Accuracy: Not Available")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)