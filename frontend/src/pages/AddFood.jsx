import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const AddFood = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    location: '',
    expiryTime: '',
    description: ''
  });

  if (!user || (user.role !== 'donor' && user.role !== 'admin')) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/food/add', formData);
      toast.success('Food listed successfully!');
      navigate('/food');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add food');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-8 border border-gray-100 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Donate Food</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Food Name</label>
            <input 
              type="text" name="foodName"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 focus:bg-white transition"
              value={formData.foodName} onChange={handleChange} required 
              placeholder="e.g., 5 Boxes of Pizza"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Quantity</label>
            <input 
              type="text" name="quantity"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 focus:bg-white transition"
              value={formData.quantity} onChange={handleChange} required 
              placeholder="e.g., Serves 10 people"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Location/Address</label>
          <input 
            type="text" name="location"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 focus:bg-white transition"
            value={formData.location} onChange={handleChange} required 
            placeholder="123 Main St, City, Country"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Expiry Date & Time</label>
          <input 
            type="datetime-local" name="expiryTime"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 focus:bg-white transition"
            value={formData.expiryTime} onChange={handleChange} required 
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea 
            name="description" rows="4"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 focus:bg-white transition resize-none"
            value={formData.description} onChange={handleChange}
            placeholder="Additional details like ingredients, dietary tags, etc."
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-secondary transition shadow-md mt-4"
        >
          Post Food Donation
        </button>
      </form>
    </div>
  );
};

export default AddFood;
