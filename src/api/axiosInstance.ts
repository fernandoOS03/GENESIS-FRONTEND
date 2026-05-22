import axios from 'axios';

const hostActual = window.location.hostname;
const urlBackend = `http://${hostActual}:8080`;

const axiosInstance = axios.create({
  baseURL: urlBackend,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
