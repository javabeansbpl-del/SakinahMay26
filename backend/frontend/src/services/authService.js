import api from '../lib/axios';
import axios from 'axios';

const BASE_URL = 'http://localhost:8787';

const authService = {

  // ── Register ────────────────────────────────
  register: async (data) => {
    const response = await api.post('/api/auth/register', {
      email:     data.email,
      password:  data.password,
      firstName: data.firstName,
      lastName:  data.lastName,
      phone:     data.phone || '',
    });
    return response.data;
  },

  // ── Login ────────────────────────────────────
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    // access token → memory
    window._accessToken = response.data.accessToken;
    // refresh token → httpOnly cookie (set by server automatically)
    return response.data;
  },

  // ── Get current user ─────────────────────────
  me: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // ── Refresh ───────────────────────────────────
  refresh: async () => {
    const response = await axios.post(
      `${BASE_URL}/api/auth/refresh`,
      {},
      { withCredentials: true }
    );
    window._accessToken = response.data.accessToken;
    return response.data;
  },

  // ── Logout ────────────────────────────────────
  logout: async () => {
    await api.post('/api/auth/logout');
    window._accessToken = null;
  },
};

export default authService;