import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

import DonorDashboard from './DonorDashboard';
import NGODashboard from './NGODashboard';
import VolunteerDashboard from './VolunteerDashboard';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Loading...
        </p>
      </div>
    </div>
  );
}

if (!user) {
  return <Navigate to="/login" replace />;
}

  if (user.role === 'donor') {
    return <DonorDashboard />;
  }

  if (user.role === 'ngo') {
  return <NGODashboard />;
}

  if (user.role === 'volunteer') {
    return <VolunteerDashboard />;
  }

  if (user.role === 'ngo') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            NGO Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            NGO dashboard is coming soon.
          </p>
        </div>
      </div>
    );
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Dashboard;