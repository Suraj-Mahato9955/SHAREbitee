import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      login(data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-100 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Full Name</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 focus:bg-white transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
            placeholder="John Doe"
          />
        </div>
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
        <div>
          <label className="block text-gray-700 font-medium mb-2">I want to:</label>
          <select 
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 focus:bg-white transition cursor-pointer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="donor">Donate Food</option>
            <option value="receiver">Receive Food</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-secondary transition mt-2 shadow-md"
        >
          Register
        </button>
      </form>
      <p className="text-center mt-6 text-gray-600">
        Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
