import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Import our new API file
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any old errors

    try {
      if (isLogin) {
        // Hit the login route
        const response = await api.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        // Save the token to the browser
        localStorage.setItem('token', response.data.token);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        // Hit the register route
        const response = await api.post('/api/auth/register', formData);
        
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      // Show the error message from the backend
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        
        {/* Show error message if login fails */}
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input 
              type="text" 
              name="name" 
              placeholder="Full Name" 
              onChange={handleChange} 
              required 
            />
          )}
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
          />
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        
        <p className="toggle-text" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span>{isLogin ? 'Register here' : 'Login here'}</span>
        </p>
      </div>
    </div>
  );
};

export default Login;