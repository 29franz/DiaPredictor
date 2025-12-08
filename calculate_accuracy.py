"""
Calculate and save the model's actual accuracy.
Run this script once in your backend folder to generate the accuracy.txt file.

Usage:
    python calculate_accuracy.py
"""

import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import os

# Configuration
DATA_PATH = 'diabetes.csv'  # Update this if your dataset is in a different location
MODEL_PATH = 'model/random_forest.pkl'
SCALER_PATH = 'model/scaler.pkl'
OUTPUT_PATH = 'model/accuracy.txt'

def main():
    print("\n" + "="*60)
    print(" Calculating Model Accuracy")
    print("="*60 + "\n")
    
    try:
        # Check if data file exists
        if not os.path.exists(DATA_PATH):
            print(f" Error: Dataset not found at '{DATA_PATH}'")
            print("\n💡 Alternative Options:")
            print("   1. Update DATA_PATH in this script to your dataset location")
            print("   2. Manually create 'model/accuracy.txt' with your known accuracy")
            print("   3. Check your model training notebook/script for the accuracy")
            return
        
        # Load the dataset
        print(" Loading dataset...")
        data = pd.read_csv(DATA_PATH)
        print(f"   ✓ Loaded {len(data)} rows")
        
        # Split features and target
        # Adjust 'Outcome' if your target column has a different name
        target_column = 'Outcome'
        if target_column not in data.columns:
            print(f"\n Error: Column '{target_column}' not found in dataset")
            print(f"   Available columns: {', '.join(data.columns)}")
            return
        
        X = data.drop(target_column, axis=1)
        y = data[target_column]
        
        # Split into train and test (same split as training)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        print(f"   ✓ Test set size: {len(X_test)} samples")
        
        # Load the trained model and scaler
        print("\n Loading model and scaler...")
        if not os.path.exists(MODEL_PATH):
            print(f"    Model not found at '{MODEL_PATH}'")
            return
        if not os.path.exists(SCALER_PATH):
            print(f"    Scaler not found at '{SCALER_PATH}'")
            return
            
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        print("   ✓ Model and scaler loaded successfully")
        
        # Scale the test data
        print("\n Evaluating model performance...")
        X_test_scaled = scaler.transform(X_test)
        
        # Make predictions
        y_pred = model.predict(X_test_scaled)
        
        # Calculate metrics
        accuracy = accuracy_score(y_test, y_pred) * 100
        
        # Display results
        print("\n" + "="*60)
        print(" MODEL PERFORMANCE RESULTS")
        print("="*60)
        print(f"\n Overall Accuracy: {accuracy:.2f}%")
        print("\n Detailed Classification Report:")
        print(classification_report(y_test, y_pred, target_names=['Non-Diabetic', 'Diabetic']))
        
        print(" Confusion Matrix:")
        cm = confusion_matrix(y_test, y_pred)
        print(f"   True Negatives:  {cm[0][0]}")
        print(f"   False Positives: {cm[0][1]}")
        print(f"   False Negatives: {cm[1][0]}")
        print(f"   True Positives:  {cm[1][1]}")
        
        # Save accuracy to file
        os.makedirs('model', exist_ok=True)
        with open(OUTPUT_PATH, 'w') as f:
            f.write(f"{accuracy:.2f}")
        
        print(f"\n SUCCESS!")
        print(f"   Accuracy saved to: {OUTPUT_PATH}")
        print(f"\n Next Steps:")
        print(f"   1. Restart your Flask backend: python app.py")
        print(f"   2. The frontend will now display {accuracy:.2f}% accuracy")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\nError: {e}")
        print("\n Troubleshooting:")
        print("   • Make sure your dataset path is correct")
        print("   • Ensure model and scaler files exist in 'model/' folder")
        print("   • Check that your dataset has an 'Outcome' column")
        print("\nManual Alternative:")
        print("   Create 'model/accuracy.txt' and write your accuracy value")
        print("   Example: echo 92.5 > model/accuracy.txt")

if __name__ == "__main__":
    main()