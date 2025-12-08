import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showAssessment, setShowAssessment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [modelAccuracy, setModelAccuracy] = useState(null);

  const [formData, setFormData] = useState({
    pregnancies: '',
    glucose: '',
    bloodPressure: '',
    skinThickness: '',
    insulin: '',
    bmi: '',
    diabetesPedigreeFunction: '',
    age: ''
  });

  // Fetch model accuracy on component mount
  useEffect(() => {
    const fetchAccuracy = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/health');
        const data = await response.json();
        if (data.accuracy) {
          setModelAccuracy(data.accuracy);
        }
      } catch (err) {
        console.error('Failed to fetch model accuracy:', err);
      }
    };
    fetchAccuracy();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Validate all fields are filled
    const emptyFields = Object.entries(formData).filter(([_, value]) => value === '');
    if (emptyFields.length > 0) {
      setError('Please fill in all fields before predicting');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pregnancies: parseFloat(formData.pregnancies),
          glucose: parseFloat(formData.glucose),
          bloodPressure: parseFloat(formData.bloodPressure),
          skinThickness: parseFloat(formData.skinThickness),
          insulin: parseFloat(formData.insulin),
          bmi: parseFloat(formData.bmi),
          diabetesPedigreeFunction: parseFloat(formData.diabetesPedigreeFunction),
          age: parseFloat(formData.age)
        })
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to connect to server. Please check if backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pregnancies: '',
      glucose: '',
      bloodPressure: '',
      skinThickness: '',
      insulin: '',
      bmi: '',
      diabetesPedigreeFunction: '',
      age: ''
    });
    setResult(null);
    setError(null);
  };

  if (!showAssessment) {
    return (
      <div className="landing-page">
        <div className="landing-content">
          <h1 className="main-title">Diabetes Risk Predictor</h1>
          <p className="subtitle">Predict the probability of diabetes using machine learning.</p>

          {/* Model Accuracy Badge - Only show if available */}
          {modelAccuracy && (
            <div className="accuracy-badge">
              <span className="accuracy-icon">✓</span>
              <span className="accuracy-text">Model Accuracy: {modelAccuracy}%</span>
            </div>
          )}

          <div className="cards-container">
            <div className="info-card">
              <h2 className="card-title">About</h2>
              <div className="card-divider"></div>
              <ul className="feature-list">
                <li>
                  <span className="checkmark">✓</span>
                  Evidence-based risk assessment
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Comprehensive health analysis
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Personalized recommendations
                </li>
                <li>
                  <span className="checkmark">✓</span>
                  Quick and secure assessment
                </li>
              </ul>
            </div>

            <div className="info-card">
              <h2 className="card-title">What We Analyze</h2>
              <div className="card-divider"></div>
              <div className="analyze-grid">
                <div className="analyze-column">
                  <ul className="feature-list">
                    <li><span className="checkmark">✓</span>Pregnancies</li>
                    <li><span className="checkmark">✓</span>Blood Pressure</li>
                    <li><span className="checkmark">✓</span>Skin Thickness</li>
                    <li><span className="checkmark">✓</span>Insulin</li>
                  </ul>
                </div>
                <div className="analyze-column">
                  <ul className="feature-list">
                    <li><span className="checkmark">✓</span>BMI</li>
                    <li><span className="checkmark">✓</span>Diabetes Pedigree Function</li>
                    <li><span className="checkmark">✓</span>Age</li>
                    <li><span className="checkmark">✓</span>Glucose Level</li>
                  </ul>
                </div>
              </div>
              <p className="privacy-note">All data is processed securely and never stored</p>
            </div>
          </div>

          <button className="proceed-button" onClick={() => setShowAssessment(true)}>
            Proceed to Assessment →
          </button>

          <p className="disclaimer">
            <strong>Medical Disclaimer:</strong> This tool is for educational and informational purposes only. It should not replace professional medical advice.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-page">
      <div className="assessment-content">
        <h1 className="assessment-title">Diabetes Risk Predictor</h1>
        <p className="assessment-subtitle">Using Random Forest to Predict the Probability of Diabetes</p>

        {/* Model Accuracy Display in Assessment Page */}
        {modelAccuracy && (
          <div className="accuracy-badge-assessment">
            <span className="accuracy-icon">✓</span>
            <span className="accuracy-text">Model Accuracy: {modelAccuracy}%</span>
          </div>
        )}

        <div className="assessment-card-centered">
          <div className="prediction-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Pregnancies</label>
                <input
                  type="number"
                  name="pregnancies"
                  value={formData.pregnancies}
                  onChange={handleInputChange}
                  placeholder="Enter number"
                  min="0"
                  step="1"
                />
              </div>

              <div className="form-group">
                <label>Glucose (mg/dL)</label>
                <input
                  type="number"
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleInputChange}
                  placeholder="e.g., 120"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label>Blood Pressure (mm Hg)</label>
                <input
                  type="number"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleInputChange}
                  placeholder="e.g., 70"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label>Skin Thickness (mm)</label>
                <input
                  type="number"
                  name="skinThickness"
                  value={formData.skinThickness}
                  onChange={handleInputChange}
                  placeholder="e.g., 20"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label>Insulin (μU/mL)</label>
                <input
                  type="number"
                  name="insulin"
                  value={formData.insulin}
                  onChange={handleInputChange}
                  placeholder="e.g., 80"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label>BMI</label>
                <input
                  type="number"
                  name="bmi"
                  value={formData.bmi}
                  onChange={handleInputChange}
                  placeholder="e.g., 25.5"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label>Diabetes Pedigree Function</label>
                <input
                  type="number"
                  name="diabetesPedigreeFunction"
                  value={formData.diabetesPedigreeFunction}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.5"
                  min="0"
                  step="0.001"
                />
              </div>

              <div className="form-group">
                <label>Age (years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="e.g., 35"
                  min="1"
                  max="120"
                  step="1"
                />
              </div>
            </div>

            <button onClick={handleSubmit} className="predict-button" disabled={loading}>
              {loading ? 'Predicting...' : 'Predict Diabetes Risk'}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="result-card">
              <h3 className="result-title">Prediction Results</h3>
              
              {/* Model Accuracy in Results - Only show if available */}
              {modelAccuracy && (
                <div className="result-accuracy">
                  <span className="result-accuracy-label">Model Accuracy:</span>
                  <span className="result-accuracy-value">{modelAccuracy}%</span>
                </div>
              )}

              <div className="result-content">
                <div className="result-item">
                  <span className="result-label">Prediction:</span>
                  <span className={`result-value ${result.prediction === 1 ? 'positive' : 'negative'}`}>
                    {result.prediction === 1 ? 'Diabetic' : 'Non-Diabetic'}
                  </span>
                </div>
                <div className="result-item highlight-confidence">
                  <span className="result-label">Prediction Accuracy:</span>
                  <span className="result-value confidence-highlight">{result.probability}%</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Risk Level:</span>
                  <span className={`result-value risk-${result.risk_level.toLowerCase().replace(' ', '-')}`}>
                    {result.risk_level}
                  </span>
                </div>
              </div>

              {/* Confidence Progress Bar */}
              <div className="confidence-bar-container">
                <div className="confidence-bar-label">
                  <span>How Sure is This Prediction?</span>
                  <span className="confidence-percentage">{result.probability}% Sure</span>
                </div>
                <div className="confidence-bar-wrapper">
                  <div 
                    className={`confidence-bar ${result.prediction === 1 ? 'high-risk' : 'low-risk'}`}
                    style={{ width: `${result.probability}%` }}
                  ></div>
                </div>
                <div className="confidence-explanation">
                  {result.probability >= 90 ? (
                    <p>🎯 <strong>Very High Confidence:</strong> The model is very certain about this prediction.</p>
                  ) : result.probability >= 75 ? (
                    <p>✓ <strong>High Confidence:</strong> The model is confident about this prediction.</p>
                  ) : result.probability >= 60 ? (
                    <p>⚠️ <strong>Moderate Confidence:</strong> The model has reasonable confidence in this prediction.</p>
                  ) : (
                    <p>⚠️ <strong>Low Confidence:</strong> The model is less certain about this prediction.</p>
                  )}
                </div>
              </div>

              <div className="result-disclaimer">
                <strong>Note:</strong> This prediction is based on a machine learning model{modelAccuracy ? ` with ${modelAccuracy}% accuracy` : ''}. 
                Always consult healthcare professionals for medical decisions.
              </div>

              <button onClick={resetForm} className="reset-button">
                New Prediction
              </button>
            </div>
          )}
        </div>

        <button className="back-button" onClick={() => setShowAssessment(false)}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default App;