import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaLeaf } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <FaLeaf /> Food<span className="font-light">Share</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/food" className="hover:text-green-200 transition">Food Listings</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-green-200 transition">Dashboard</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-green-200 transition">Admin Panel</Link>
              )}
              <div className="flex items-center gap-4">
                <span className="text-sm border border-green-400 px-3 py-1 rounded-full hidden md:block bg-secondary bg-opacity-50">
                  Hi, {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-primary px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition shadow"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-green-200 transition">Login</Link>
              <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition shadow">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
