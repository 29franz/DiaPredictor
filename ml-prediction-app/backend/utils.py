import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib

def validate_input(data):
    """
    Validate input data for diabetes prediction
    """
    required_fields = [
        'pregnancies', 'glucose', 'bloodPressure', 'skinThickness',
        'insulin', 'bmi', 'diabetesPedigreeFunction', 'age'
    ]
    
    for field in required_fields:
        if field not in data:
            return False, f"Missing field: {field}"
    
    return True, "Valid"

def preprocess_input(data):
    """
    Preprocess input data before prediction
    """
    features = [
        data.get('pregnancies', 0),
        data.get('glucose', 0),
        data.get('bloodPressure', 0),
        data.get('skinThickness', 0),
        data.get('insulin', 0),
        data.get('bmi', 0),
        data.get('diabetesPedigreeFunction', 0),
        data.get('age', 0)
    ]
    
    return np.array(features).reshape(1, -1)

def save_model_and_scaler(model, scaler, model_path='model/random_forest.pkl', scaler_path='model/scaler.pkl'):
    """
    Save trained model and scaler
    """
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"Model saved to {model_path}")
    print(f"Scaler saved to {scaler_path}")

def load_model_and_scaler(model_path='model/random_forest.pkl', scaler_path='model/scaler.pkl'):
    """
    Load trained model and scaler
    """
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    return model, scaler