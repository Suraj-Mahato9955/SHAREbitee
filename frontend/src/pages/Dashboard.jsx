import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

import DonorDashboard from './DonorDashboard';
import NGODashboard from './NGODashboard';
import VolunteerDashboard from './VolunteerDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

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
