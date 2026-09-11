import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  ShieldCheck,
  Users,
  UserRound,
  Heart,
  Truck,
  Building2,
  RefreshCw,
  Trash2,
  Search,
  Mail,
  CalendarDays,
  Activity,
  Shield,
  X,
} from 'lucide-react';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const { data } = await api.get('/admin/users');

      setUsers(data);
    } catch (error) {
      console.error('ADMIN USERS ERROR:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to fetch users'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // DELETE USER
  // =========================
  const handleDeleteUser = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this user? All their foods and requests will also be deleted.'
      )
    ) {
      return;
    }

    try {
      await api.delete(`/admin/user/${id}`);

      toast.success('User deleted successfully');

      fetchUsers();
    } catch (error) {
      console.error('DELETE USER ERROR:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to delete user'
      );
    }
  };

  // =========================
  // ADMIN PROTECTION
  // =========================
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // =========================
  // STATISTICS
  // =========================
  const totalUsers = users.length;

  const totalDonors = users.filter(
    (u) => u.role === 'donor'
  ).length;

  const totalNGOs = users.filter(
    (u) => u.role === 'ngo'
  ).length;

  const totalVolunteers = users.filter(
    (u) => u.role === 'volunteer'
  ).length;

  const totalAdmins = users.filter(
    (u) => u.role === 'admin'
  ).length;

  // =========================
  // FILTER USERS
  // =========================
  const filteredUsers = users.filter((u) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      u.name?.toLowerCase().includes(search) ||
      u.email?.toLowerCase().includes(search);

    const matchesRole =
      selectedRole === 'all' ||
      u.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  // =========================
  // ROLE STYLE
  // =========================
  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';

      case 'donor':
        return 'bg-blue-100 text-blue-700 border-blue-200';

      case 'ngo':
        return 'bg-green-100 text-green-700 border-green-200';

      case 'volunteer':
        return 'bg-orange-100 text-orange-700 border-orange-200';

      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // =========================
  // ROLE ICON
  // =========================
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield size={14} />;

      case 'donor':
        return <Heart size={14} />;

      case 'ngo':
        return <Building2 size={14} />;

      case 'volunteer':
        return <Truck size={14} />;

      default:
        return <UserRound size={14} />;
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-[75vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-5 text-gray-600 font-medium">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <ShieldCheck size={24} />
                </div>

                <span className="text-purple-100 font-medium">
                  System Administration
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">
                Admin Dashboard 🛡️
              </h1>

              <p className="text-purple-100 mt-3 max-w-2xl">
                Monitor users and manage the SHAREbite
                platform from one place.
              </p>
            </div>

            <button
              onClick={() => fetchUsers(true)}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 bg-white text-purple-700 px-5 py-3 rounded-xl font-semibold shadow-lg hover:bg-purple-50 transition disabled:opacity-70"
            >
              <RefreshCw
                size={18}
                className={
                  refreshing ? 'animate-spin' : ''
                }
              />

              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>

          </div>
        </div>
      </section>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

          {/* Total Users */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                <Users size={22} />
              </div>

              <span className="text-xs font-semibold text-gray-400">
                TOTAL
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              {totalUsers}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Registered Users
            </p>
          </div>

          {/* Donors */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                <Heart size={22} />
              </div>

              <span className="text-xs font-semibold text-gray-400">
                DONORS
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              {totalDonors}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Food Contributors
            </p>
          </div>

          {/* NGOs */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                <Building2 size={22} />
              </div>

              <span className="text-xs font-semibold text-gray-400">
                NGOS
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              {totalNGOs}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Food Receivers
            </p>
          </div>

          {/* Volunteers */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                <Truck size={22} />
              </div>

              <span className="text-xs font-semibold text-gray-400">
                VOLUNTEERS
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              {totalVolunteers}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Delivery Partners
            </p>
          </div>

          {/* Admins */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
                <Shield size={22} />
              </div>

              <span className="text-xs font-semibold text-gray-400">
                ADMINS
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              {totalAdmins}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              System Managers
            </p>
          </div>

        </div>

        {/* ================= OVERVIEW ================= */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* Platform Overview */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                <Activity size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Platform Overview
                </h2>

                <p className="text-sm text-gray-500">
                  Current user distribution
                </p>
              </div>
            </div>

            <div className="space-y-5">

              {/* Donor */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Donors
                  </span>

                  <span className="text-sm text-gray-500">
                    {totalDonors}
                  </span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all"
                    style={{
                      width: `${
                        totalUsers
                          ? (totalDonors / totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* NGO */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    NGOs
                  </span>

                  <span className="text-sm text-gray-500">
                    {totalNGOs}
                  </span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all"
                    style={{
                      width: `${
                        totalUsers
                          ? (totalNGOs / totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Volunteers */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Volunteers
                  </span>

                  <span className="text-sm text-gray-500">
                    {totalVolunteers}
                  </span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full transition-all"
                    style={{
                      width: `${
                        totalUsers
                          ? (totalVolunteers / totalUsers) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Admins */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Admins
                  </span>

                  <span className="text-sm text-gray-500">
                    {totalAdmins}
                  </span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-purple-500 h-2.5 rounded-full transition-all"
                    style={{
                      width: `${
                        totalUsers
                          ? (totalAdmins / totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

            </div>
          </div>

          {/* Admin Status */}
          <div className="bg-gradient-to-br from-purple-700 to-indigo-700 rounded-2xl p-6 text-white">

            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
              <ShieldCheck size={30} />
            </div>

            <h3 className="text-xl font-bold">
              System Status
            </h3>

            <p className="text-purple-100 text-sm mt-2">
              SHAREbite administration panel is active.
            </p>

            <div className="mt-7 bg-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>

                <span className="font-semibold">
                  System Operational
                </span>
              </div>

              <p className="text-purple-200 text-xs mt-2">
                User management services are available.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-purple-100">
              <Users size={16} />
              {totalUsers} users registered
            </div>

          </div>

        </div>

        {/* ================= USER MANAGEMENT ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* HEADER */}
          <div className="p-6 border-b border-gray-100">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                    <Users size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Manage Users
                    </h2>

                    <p className="text-sm text-gray-500">
                      View and manage registered users
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl font-semibold text-sm">
                {filteredUsers.length} of {totalUsers} users
              </div>

            </div>

            {/* SEARCH + FILTER */}
            <div className="flex flex-col md:flex-row gap-3 mt-6">

              {/* Search */}
              <div className="relative flex-1">

                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}

              </div>

              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={(e) =>
                  setSelectedRole(e.target.value)
                }
                className="md:w-48 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="donor">Donor</option>
                <option value="ngo">NGO</option>
                <option value="volunteer">
                  Volunteer
                </option>
              </select>

            </div>
          </div>

          {/* ================= TABLE ================= */}
          {filteredUsers.length === 0 ? (

            <div className="py-16 text-center">

              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Users size={30} />
              </div>

              <h3 className="mt-4 font-bold text-gray-700">
                No users found
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Try changing your search or role filter.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">

                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      User
                    </th>

                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Role
                    </th>

                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Registered
                    </th>

                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.map((u) => (

                    <tr
                      key={u._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >

                      {/* USER */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-11 h-11 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
                            {u.name
                              ?.charAt(0)
                              ?.toUpperCase() || 'U'}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {u.name}
                            </p>

                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                              <Mail size={13} />
                              {u.email}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase border ${getRoleStyle(
                            u.role
                          )}`}
                        >
                          {getRoleIcon(u.role)}
                          {u.role}
                        </span>

                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays size={16} />

                          {u.createdAt
                            ? new Date(
                                u.createdAt
                              ).toLocaleDateString(
                                'en-IN',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )
                            : 'N/A'}
                        </div>

                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5 text-right">

                        {u._id !== user._id ? (

                          <button
                            onClick={() =>
                              handleDeleteUser(u._id)
                            }
                            className="inline-flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-100 transition text-sm font-semibold"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>

                        ) : (

                          <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-3 py-2 rounded-lg text-sm font-medium">
                            <ShieldCheck size={16} />
                            Current Admin
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* ================= FOOTER INFO ================= */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">

          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-purple-600" />
            Admin access is protected.
          </div>

          <div className="flex items-center gap-2">
            <UserRound size={16} />
            {totalUsers} registered accounts
          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminPanel;
