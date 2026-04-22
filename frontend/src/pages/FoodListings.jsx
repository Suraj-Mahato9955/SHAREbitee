import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FoodCard from '../components/FoodCard';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const FoodListings = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      const { data } = await api.get('/food');
      setFoods(data);
    } catch (error) {
      toast.error('Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleRequest = async (foodId) => {
    try {
      await api.post('/request/create', { foodId });
      toast.success('Food requested successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request food');
    }
  };

  const handleDelete = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/food/${foodId}`);
        toast.success('Food post deleted');
        fetchFoods();
      } catch (error) {
        toast.error('Failed to delete food');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-2xl text-gray-500 font-semibold animate-pulse">Loading amazing food...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Available Food Donations</h2>
        <Link to="/add-food" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition shadow-sm hover:shadow-md">
          + Donate Food
        </Link>
      </div>

      {foods.length === 0 ? (
        <div className="text-center p-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-xl text-gray-500 mb-4 font-medium">No food listings available at the moment.</p>
          <div className="w-24 h-24 mx-auto bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-4xl mb-4">🍽️</div>
          <p className="text-gray-400">Be the first to donate food!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map(food => (
            <FoodCard 
              key={food._id} 
              food={food} 
              onRequest={handleRequest} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodListings;
