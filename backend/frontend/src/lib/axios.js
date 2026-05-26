import axios from 'axios';

const BASE_URL = 'http://localhost:8787';

// ── Main axios instance ───────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,      // sends httpOnly cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ───────────────────────
// Attaches access token to every request
api.interceptors.request.use(
  (config) => {
    const token = window._accessToken;   // from memory
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────
// If 403 → try refresh → retry original request
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 403 and not already retrying
    if (error.response?.status === 403 &&
        !originalRequest._retry) {

      if (isRefreshing) {
        // Queue this request until refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token is in httpOnly cookie — sent automatically
        const response = await axios.post(
          `${BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;
        window._accessToken = newAccessToken;

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed — clear token and redirect to login
        window._accessToken = null;
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;