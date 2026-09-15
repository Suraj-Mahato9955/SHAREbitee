import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FaLeaf,
  FaBell,
  FaCheck,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // =========================
  // LOAD NOTIFICATIONS
  // =========================
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

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // =========================
  // MARK ONE AS READ
  // =========================
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
      console.error(
        'Failed to mark notification as read:',
        error
      );
    }
  };

  // =========================
  // MARK ALL AS READ
  // =========================
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
      console.error(
        'Failed to mark all notifications as read:',
        error
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    logout();
    setNotifications([]);
    setShowNotifications(false);
    setMobileMenu(false);
    navigate('/login');
  };

  // =========================
  // CLOSE MOBILE MENU
  // =========================
  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary text-white shadow-lg">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* =========================
            MAIN NAVBAR
        ========================= */}
        <div className="h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2 text-2xl font-bold tracking-tight group"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 group-hover:bg-white/25 transition">
              <FaLeaf className="text-green-200" />
            </span>

            <span>
              Food<span className="font-light text-green-200">Share</span>
            </span>
          </Link>

          {/* =========================
              DESKTOP NAVIGATION
          ========================= */}
          <div className="hidden lg:flex items-center gap-2">

            <Link
              to="/food"
              className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition"
            >
              Food Listings
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition"
              >
                Dashboard
              </Link>
            )}

            {user?.role === 'volunteer' && (
              <Link
                to="/volunteer"
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition"
              >
                Volunteer
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition"
              >
                Admin Panel
              </Link>
            )}

            {/* =========================
                NOTIFICATIONS
            ========================= */}
            {user && (
              <div className="relative ml-2">

                <button
                  onClick={() =>
                    setShowNotifications(!showNotifications)
                  }
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition"
                  aria-label="Notifications"
                >
                  <FaBell className="text-lg" />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-primary">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* NOTIFICATION DROPDOWN */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

                    {/* HEADER */}
                    <div className="px-4 py-4 border-b bg-gray-50 flex items-center justify-between">

                      <div>
                        <h3 className="font-bold text-gray-800">
                          Notifications
                        </h3>

                        <p className="text-xs text-gray-500 mt-0.5">
                          {unreadCount > 0
                            ? `${unreadCount} unread notification${
                                unreadCount > 1 ? 's' : ''
                              }`
                            : "You're all caught up"}
                        </p>
                      </div>

                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-primary hover:text-secondary font-semibold flex items-center gap-1"
                        >
                          <FaCheck />
                          Mark all
                        </button>
                      )}

                    </div>

                    {/* NOTIFICATION LIST */}
                    <div className="max-h-96 overflow-y-auto">

                      {notifications.length === 0 ? (
                        <div className="py-10 px-5 text-center">

                          <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <FaBell className="text-xl text-gray-400" />
                          </div>

                          <p className="font-semibold text-gray-700">
                            No notifications
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            You're all caught up!
                          </p>

                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            onClick={() =>
                              !notification.isRead &&
                              handleMarkAsRead(
                                notification._id
                              )
                            }
                            className={`px-4 py-4 border-b last:border-b-0 cursor-pointer transition ${
                              notification.isRead
                                ? 'bg-white hover:bg-gray-50'
                                : 'bg-green-50 hover:bg-green-100'
                            }`}
                          >

                            <div className="flex gap-3">

                              <div
                                className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                                  notification.isRead
                                    ? 'bg-gray-300'
                                    : 'bg-green-500'
                                }`}
                              />

                              <div className="flex-1 min-w-0">

                                <p
                                  className={`text-sm leading-5 ${
                                    notification.isRead
                                      ? 'text-gray-600'
                                      : 'text-gray-900 font-semibold'
                                  }`}
                                >
                                  {notification.message}
                                </p>

                                <p className="text-[11px] text-gray-400 mt-2">
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
            )}

            {/* USER INFO */}
            {user && (
              <div className="flex items-center gap-3 ml-2">

                <span className="hidden xl:block text-sm bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">
                  Hi, <span className="font-semibold">{user.name}</span>
                  <span className="text-green-200">
                    {' '}• {user.role}
                  </span>
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-white text-primary px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-100 transition shadow-sm"
                >
                  Logout
                </button>

              </div>
            )}

            {/* GUEST */}
            {!user && (
              <div className="flex items-center gap-2 ml-2">

                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-white text-primary px-5 py-2 rounded-xl font-semibold text-sm hover:bg-gray-100 transition shadow-sm"
                >
                  Register
                </Link>

              </div>
            )}

          </div>

          {/* =========================
              MOBILE MENU BUTTON
          ========================= */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            {mobileMenu ? (
              <FaTimes size={20} />
            ) : (
              <FaBars size={20} />
            )}
          </button>

        </div>

        {/* =========================
            MOBILE NAVIGATION
        ========================= */}
        {mobileMenu && (
          <div className="lg:hidden border-t border-white/10 py-4">

            <div className="flex flex-col gap-2">

              <Link
                to="/food"
                onClick={closeMobileMenu}
                className="px-4 py-3 rounded-xl hover:bg-white/10 transition font-medium"
              >
                🍲 Food Listings
              </Link>

              {user && (
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 rounded-xl hover:bg-white/10 transition font-medium"
                >
                  📊 Dashboard
                </Link>
              )}

              {user?.role === 'volunteer' && (
                <Link
                  to="/volunteer"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 rounded-xl hover:bg-white/10 transition font-medium"
                >
                  🚚 Volunteer
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 rounded-xl hover:bg-white/10 transition font-medium"
                >
                  🛡️ Admin Panel
                </Link>
              )}

              {user && (
                <>
                  <div className="border-t border-white/10 my-2" />

                  <div className="px-4 py-2 text-sm text-green-100">
                    Signed in as{' '}
                    <span className="font-semibold text-white">
                      {user.name}
                    </span>

                    <span className="block text-xs mt-1 text-green-200 capitalize">
                      {user.role}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="mx-4 mt-1 bg-white text-primary px-4 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </>
              )}

              {!user && (
                <>
                  <div className="border-t border-white/10 my-2" />

                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="px-4 py-3 rounded-xl hover:bg-white/10 transition font-semibold"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="mx-4 bg-white text-primary px-4 py-3 rounded-xl font-semibold text-center hover:bg-gray-100 transition"
                  >
                    Register
                  </Link>
                </>
              )}

            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
