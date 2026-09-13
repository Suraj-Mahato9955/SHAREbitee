import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaLeaf, FaBell, FaCheck } from 'react-icons/fa';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load notifications
  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      const { data } = await api.get('/notification');
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  // Fetch notifications when user logs in
  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // Mark one notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notification/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notification/read-all');

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setNotifications([]);
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold flex items-center gap-2"
        >
          <FaLeaf />

          Food<span className="font-light">Share</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          <Link
            to="/food"
            className="hover:text-green-200 transition"
          >
            Food Listings
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-green-200 transition"
              >
                Dashboard
              </Link>

              {user.role === 'volunteer' && (
                <Link
                  to="/volunteer"
                  className="hover:text-green-200 transition"
                >
                  Volunteer
                </Link>
              )}

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="hover:text-green-200 transition"
                >
                  Admin Panel
                </Link>
              )}

              {/* Notification Bell */}
              <div className="relative">

                <button
                  onClick={() =>
                    setShowNotifications(!showNotifications)
                  }
                  className="relative text-xl hover:text-green-200 transition"
                >
                  <FaBell />

                  {/* Unread count */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">

                    {/* Header */}
                    <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">

                      <div>
                        <h3 className="font-bold text-gray-800">
                          Notifications
                        </h3>

                        {unreadCount > 0 && (
                          <p className="text-xs text-gray-500">
                            {unreadCount} unread
                          </p>
                        )}
                      </div>

                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-green-600 hover:text-green-800 font-semibold flex items-center gap-1"
                        >
                          <FaCheck />
                          Mark all
                        </button>
                      )}
                    </div>

                    {/* Notifications */}
                    <div className="max-h-96 overflow-y-auto">

                      {notifications.length === 0 ? (
                        <div className="py-10 text-center text-gray-500">
                          <FaBell className="mx-auto text-3xl mb-3 text-gray-300" />

                          <p className="font-medium">
                            No notifications
                          </p>

                          <p className="text-xs mt-1">
                            You're all caught up!
                          </p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            onClick={() =>
                              !notification.isRead &&
                              handleMarkAsRead(notification._id)
                            }
                            className={`px-4 py-3 border-b cursor-pointer transition ${
                              notification.isRead
                                ? 'bg-white hover:bg-gray-50'
                                : 'bg-green-50 hover:bg-green-100'
                            }`}
                          >

                            <div className="flex gap-3">

                              {/* Notification indicator */}
                              <div
                                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  notification.isRead
                                    ? 'bg-gray-300'
                                    : 'bg-green-500'
                                }`}
                              ></div>

                              <div className="flex-1">

                                <p
                                  className={`text-sm ${
                                    notification.isRead
                                      ? 'text-gray-600'
                                      : 'text-gray-900 font-semibold'
                                  }`}
                                >
                                  {notification.message}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.createdAt
                                    ? new Date(
                                        notification.createdAt
                                      ).toLocaleString()
                                    : ''}
                                </p>

                              </div>

                            </div>

                          </div>
                        ))
                      )}

                    </div>
                  </div>
                )}

              </div>

              {/* User Info + Logout */}
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

              <Link
                to="/login"
                className="hover:text-green-200 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-white text-primary px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition shadow"
              >
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
