import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

import DonorDashboard from './DonorDashboard';
import NGODashboard from './NGODashboard';
import VolunteerDashboard from './VolunteerDashboard';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);

  // Wait for AuthContext to restore user from localStorage
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

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Donor
  if (user.role === 'donor') {
    return <DonorDashboard />;
  }

  // NGO
  if (user.role === 'ngo') {
    return <NGODashboard />;
  }

  // Volunteer
  if (user.role === 'volunteer') {
    return <VolunteerDashboard />;
  }

  // Admin
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Dashboard;