import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user || (user.role !== 'receiver' && user.role !== 'admin')) {
    return <Navigate to="/dashboard" />;
  }

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/request/my');
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Approved</span>;
      case 'rejected': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">Rejected</span>;
      default: return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">Pending</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-2xl text-gray-500 font-semibold animate-pulse">Loading requests...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">My Food Requests</h2>
      
      {requests.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 text-lg">You haven't requested any food yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-semibold text-gray-700">Food Item</th>
                <th className="p-4 font-semibold text-gray-700">Quantity</th>
                <th className="p-4 font-semibold text-gray-700">Location</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700">Requested On</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{req.foodId?.foodName || 'Item Deleted'}</td>
                  <td className="p-4 text-gray-600">{req.foodId?.quantity || 'N/A'}</td>
                  <td className="p-4 text-gray-600">{req.foodId?.location || 'N/A'}</td>
                  <td className="p-4">{getStatusBadge(req.status)}</td>
                  <td className="p-4 text-gray-600">{new Date(req.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
