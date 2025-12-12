import axios from 'axios';

// Change this to your backend URL
// For local development: http://localhost:5000
// For Google Colab: Your ngrok URL
const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API functions
export const predictDiabetes = async (patientData) => {
  try {
    const response = await api.post('/predict', patientData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const predictBatch = async (patientsData) => {
  try {
    const response = await api.post('/predict/batch', { patients: patientsData });
    return response.data;
  } catch (error) {
    throw error;
  }
}
