import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? All their foods and requests will also be deleted.')) {
      try {
        await api.delete(`/admin/user/${id}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-2xl text-gray-500 font-semibold animate-pulse">Loading system data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">System Admin Panel</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Manage Users</h3>
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">{users.length} Total Users</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-700">Name</th>
                <th className="p-4 font-semibold text-gray-700">Email</th>
                <th className="p-4 font-semibold text-gray-700">Role</th>
                <th className="p-4 font-semibold text-gray-700">Registered</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{u.name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      u.role === 'donor' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-center">
                    {u._id !== user._id ? (
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-100 transition text-sm font-semibold"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm italic">Current</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
