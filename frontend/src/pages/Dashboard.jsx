import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row items-center gap-8 mb-8 hover:shadow-lg transition">
        <div className="w-24 h-24 bg-green-100 text-primary rounded-full flex items-center justify-center text-4xl font-bold uppercase shadow-inner">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user.name}!</h2>
          <p className="text-gray-600 text-lg mb-1"><strong>Email:</strong> {user.email}</p>
          <p className="text-gray-600 text-lg"><strong>Role:</strong> <span className="capitalize text-primary font-semibold">{user.role}</span></p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {(user.role === 'donor' || user.role === 'admin') && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Donor Actions</h3>
            <p className="text-gray-600 mb-6">Have extra food? Share it with those in need by creating a new food listing.</p>
            <Link to="/add-food" className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary transition shadow-sm">
              Donate Food
            </Link>
          </div>
        )}

        {(user.role === 'receiver' || user.role === 'admin') && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Receiver Actions</h3>
            <p className="text-gray-600 mb-6">Check the status of your requested foods and manage your meals.</p>
            <div className="flex gap-4">
              <Link to="/food" className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary transition shadow-sm">
                Browse Food
              </Link>
              <Link to="/my-requests" className="inline-block bg-white text-primary border border-primary px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition shadow-sm">
                My Requests
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
