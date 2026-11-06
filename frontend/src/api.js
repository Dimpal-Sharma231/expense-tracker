import axios from 'axios';

// Create an axios instance pointing to your backend
const api = axios.create({
  baseURL: 'https://expense-tracker-api-ac84.onrender.com', // Paste your actual Render URL here!
}); 

// Automatically attach the token to every request if it exists
api.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;