import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-100 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email Address</label>
          <input 
            type="email" 
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 focus:bg-white transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input 
            type="password" 
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 focus:bg-white transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-secondary transition shadow-md"
        >
          Log In
        </button>
      </form>
      <p className="text-center mt-6 text-gray-600">
        Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
