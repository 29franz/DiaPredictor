import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

    const host = 'https://diapredictor-backend12122025.onrender.app';

    const [showAssessment, setShowAssessment] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [modelAccuracy, setModelAccuracy] = useState(null);
    const [training, setTraining] = useState(false);

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
                const response = await fetch(`${host}/health`);
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
            const response = await fetch(`${host}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    Pregnancies: parseFloat(formData.pregnancies),
                    Glucose: parseFloat(formData.glucose),
                    BloodPressure: parseFloat(formData.bloodPressure),
                    SkinThickness: parseFloat(formData.skinThickness),
                    Insulin: parseFloat(formData.insulin),
                    BMI: parseFloat(formData.bmi),
                    DiabetesPedigreeFunction: parseFloat(formData.diabetesPedigreeFunction),
                    Age: parseFloat(formData.age)
                })
            });

            if (!response.ok) {
                throw new Error('Prediction failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            if (navigator.onLine) setError('Failed to connect to server. Please check if backend is running on port 5000.');
            else setError('No internet connection. Please check your network and try again.');
            console.error(err);
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

    const handleTrain = async () => {
        try {
            const response = await fetch(`${host}/train`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Training failed');
            }

            const data = await response.json();
            alert(`Training completed. Model Accuracy: ${data.accuracy}%`);
            setModelAccuracy(data.accuracy);
        } catch (err) {
            if (navigator.onLine) alert('Failed to connect to server. Please check if backend is running on port 5000.');
            else alert('No internet connection. Please check your network and try again.');
            console.error(err);
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const formData = new FormData();
            formData.append('file', file);
            fetch(`${host}/train`, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        e.target.value = null; // Reset file input
                        throw new Error('File upload failed');
                    }
                    return response.json();
                })
                .then(data => {
                    alert('File uploaded successfully');
                    e.target.value = null; // Reset file input
                })
                .catch(err => {
                    alert('File upload failed');
                    console.error(err);
                    e.target.value = null; // Reset file input
                });
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            fetch(`${host}/train`, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        e.target.value = null; // Reset file input
                        throw new Error('File upload failed');
                    }
                    e.target.value = null; // Reset file input
                    return response.json();
                })
                .then(data => {
                    alert('File uploaded successfully');
                    e.target.value = null; // Reset file input
                })
                .catch(err => {
                    alert('File upload failed');
                    console.error(err);
                    e.target.value = null; // Reset file input
                });
        }
    }

    if (!showAssessment) {
        return (
            <div className="landing-page">
                <div className="landing-content">
                    <h1 className="main-title">Diabetes Risk Predictor</h1>
                    <p className="subtitle">Predict the probability of diabetes using machine learning.</p>

                    {/* {modelAccuracy && (
                        <div className="accuracy-badge">
                            <span className="accuracy-icon">✓</span>
                            <span className="accuracy-text">Model Accuracy: {modelAccuracy}%</span>
                        </div>
                    )} */}

                    <div className="cards-container">
                        <div className="info-card">
                            <h2 className="card-title">About</h2>
                            <div className="card-divider"></div>
                            <ul className="feature-list">
                                <li>
                                    <span className="checkmark">✓</span>
                                    Evidence-based evaluation of risks
                                </li>
                                <li>
                                    <span className="checkmark">✓</span>
                                    Individualized recommendations
                                </li>
                                <li>
                                    <span className="checkmark">✓</span>
                                    Comprehensive review of health
                                </li>
                                <li>
                                    <span className="checkmark">✓</span>
                                   Efficient and secure assessment
                                </li>
                            </ul>
                        </div>

                        <div className="info-card">
                            <h2 className="card-title">What We Evaluate</h2>
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
                            <p className="privacy-note">All data is handled with strict security measures and is not stored at any time.</p>
                        </div>
                    </div>

                    <button className="proceed-button" onClick={() => setShowAssessment(true)}>
                        Proceed to Assessment →
                    </button>

                    <p className="disclaimer">
                        <strong>Medical Disclaimer:</strong> This tool is for educational and informational purposes only. It should not replace professional medical advice.
                    </p>

                    <button
                        onClick={() => setTraining(!training)}
                        style={{
                            background: "none",
                            border: "none",
                        }}
                    >...</button>

                    {
                        training && (
                            <div
                                className="training-notice"
                                style={{
                                    background: "white", borderRadius: 10,
                                    padding: 20, marginTop: 20, boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                                }}
                            >
                                <h3 style={{ marginBottom: 10 }}>Model Training</h3>
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => document.getElementById('fileUpload').click()}
                                    style={{
                                        border: '2px dashed #ccc',
                                        borderRadius: '5px',
                                        padding: '20px',
                                        textAlign: 'center',
                                        marginBottom: '10px',
                                        color: '#666',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <strong>Note:</strong> Training the model may take several minutes. Please ensure the backend server is running and accessible.
                                </div>
                                <button
                                    onClick={handleTrain}
                                    style={{
                                        width: '100%', padding: '10px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '16px'
                                    }}
                                >Train</button>
                                <input
                                    id="fileUpload"
                                    type="file"
                                    accept=".csv"
                                    style={{ marginTop: 10, display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }

    return (
        <div className="assessment-page">
            <div className="assessment-content">
                <h1 className="assessment-title">Diabetes Risk Predictor</h1>
                <p className="assessment-subtitle">Using Random Forest to Predict the Probability of Diabetes</p>

                {/* {modelAccuracy && (
                    <div className="accuracy-badge-assessment">
                        <span className="accuracy-icon">✓</span>
                        <span className="accuracy-text">Model Accuracy: {modelAccuracy}%</span>
                    </div>
                )} */}

                <div className="assessment-card-centered">
                    <div className="prediction-form">
                        <form onSubmit={e => {
                            e.preventDefault();
                            document.getElementById('predictButton').click();
                        }}>
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
                                    // step="0.1"
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
                                    // step="0.1"
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
                                    // step="0.1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Number of Diabetic Family history</label>
                                    <input
                                        type="number"
                                        name="diabetesPedigreeFunction"
                                        value={formData.diabetesPedigreeFunction}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 0.5"
                                        min="0"
                                    // step="0.001"
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
                                    // step="1"
                                    />
                                </div>
                            </div>

                            <button onClick={handleSubmit} id="predictButton" className="predict-button" disabled={loading}>
                                {loading ? 'Predicting...' : 'Predict Diabetes Risk'}
                            </button>
                        </form>
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
                                    <span className={`result-value risk-${result.risk_level}`}>
                                        {result.risk_level}
                                    </span>
                                </div>
                            </div>

                            {/* Confidence Progress Bar */}
                            <div className="confidence-bar-container">
                                <div className="confidence-bar-label">
                                    <span>How Sure is This Prediction? </span>
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
                                        <p> <strong>Very High Confidence:</strong> The model is very certain about this prediction.</p>
                                    ) : result.probability >= 75 ? (
                                        <p>✓ <strong>High Confidence:</strong> The model is confident about this prediction.</p>
                                    ) : result.probability >= 60 ? (
                                        <p> <strong>Moderate Confidence:</strong> The model has reasonable confidence in this prediction.</p>
                                    ) : (
                                        <p> <strong>Low Confidence:</strong> The model is less certain about this prediction.</p>
                                    )}
                                </div>
                            </div>

                            <div className="result-disclaimer" style={{ marginBottom: 25 }}>
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
