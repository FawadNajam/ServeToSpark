import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

const TOKEN_KEY = 'customer_access_token';
const USER_KEY = 'customer_user';

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }
  }
  return config;
});

export { TOKEN_KEY, USER_KEY };
