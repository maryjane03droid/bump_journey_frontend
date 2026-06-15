// src/api.js
import axios from 'axios';

// The base URL where your Django development server runs
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authAPI = {
    // 1. Send registration data to Django
    register: async (username, email, password) => {
        const response = await apiClient.post('/auth/register/', {
            username,
            email,
            password,
            role: 'PATIENT' // Defaulting role for onboarding
        });
        return response.data;
    },

    // 2. Exchange credentials for JWT Tokens
    login: async (username, password) => {
        const response = await apiClient.post('/auth/login/', {
            username,
            password,
        });
        // Save tokens into local storage so the browser remembers the session
        if (response.data.access) {
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
        }
        return response.data;
    },
    
    // 3. Helper to clear tokens on logout
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};