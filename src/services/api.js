import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

api.interceptors.request.use((config) => {
  const url = config.url || '';
  const isAuthEndpoint = url.includes('accounts/login/') || url.includes('accounts/register/') || url.includes('accounts/token/');

  if (!isAuthEndpoint) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await api.post('accounts/login/', { username, password });
      const data = response.data;
      const accessToken = data.access || data.access_token || data.token;
      const refreshToken = data.refresh || data.refresh_token || data.refreshToken;

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      return data;
    } catch (error) {
      const detail = error.response?.data?.detail || error.response?.data?.message;
      throw new Error(detail || error.message || 'Login failed. Please check your credentials.');
    }
  },

  register: async (username, email, password) => {
    const response = await api.post('accounts/register/', { username, email, password });
    return response.data;
  },

  // FIXED: Explicitly enforcing the trailing slash for profile calls
  getProfile: async () => {
    const response = await api.get('accounts/profile/');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('accounts/profile/', profileData);
    return response.data;
  }
};

export const clinicalAPI = {
  getAppointments: async () => {
    const response = await api.get('staff/appointments/');
    return response.data;
  },
  
  createNote: async (noteData) => {
    const response = await api.post('staff/notes/', noteData);
    return response.data;
  }
};

export const trackerAPI = {
  getPregnancyProfiles: async () => {
    const response = await api.get('tracker/pregnancy-profiles/');
    return response.data;
  },
  getHealthLogs: async () => {
    const response = await api.get('tracker/health-logs/');
    return response.data;
  },
  createHealthLog: async (logData) => {
    const response = await api.post('tracker/health-logs/', logData);
    return response.data;
  }
};

export default api;