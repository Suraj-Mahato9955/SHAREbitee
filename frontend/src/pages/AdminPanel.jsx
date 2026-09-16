import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

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
  Utensils,
  CheckCircle,
  Clock,
  XCircle,
  PackageCheck,
  Database,
} from 'lucide-react';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [stats, setStats] = useState(null);

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

  // =========================
  // FETCH STATS
  // =========================
  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');

      setStats(data);
    } catch (error) {
      console.error('ADMIN STATS ERROR:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to fetch dashboard statistics'
      );
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // =========================
  // REFRESH EVERYTHING
  // =========================
  const handleRefresh = async () => {
    setRefreshing(true);

    await Promise.all([
      fetchUsers(true),
      fetchStats()
    ]);

    setRefreshing(false);
  };

  // =========================
  // DELETE USER
  // =========================
  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user? All their foods and requests will also be deleted.'
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/user/${id}`);

      toast.success('User deleted successfully');

      await Promise.all([
        fetchUsers(),
        fetchStats()
      ]);

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
  const totalUsers = stats?.users?.total || 0;
  const totalDonors = stats?.users?.donors || 0;
  const totalNGOs = stats?.users?.ngos || 0;
  const totalVolunteers = stats?.users?.volunteers || 0;
  const totalAdmins = stats?.users?.admins || 0;

  const totalFood = stats?.food?.total || 0;
  const availableFood = stats?.food?.available || 0;
  const deliveredFood = stats?.food?.delivered || 0;

  const totalRequests = stats?.requests?.total || 0;
  const pendingRequests = stats?.requests?.pending || 0;
  const approvedRequests = stats?.requests?.approved || 0;
  const pickedUpRequests = stats?.requests?.pickedUp || 0;
  const deliveredRequests = stats?.requests?.delivered || 0;
  const rejectedRequests = stats?.requests?.rejected || 0;

  // =========================
  // FILTER USERS
  // =========================
  const filteredUsers = users.filter((u) => {
    const search = searchTerm.toLowerCase().trim();

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
        return 'bg-purple-50 text-purple-700 border-purple-200';

      case 'donor':
        return 'bg-blue-50 text-blue-700 border-blue-200';

      case 'ngo':
        return 'bg-green-50 text-green-700 border-green-200';

      case 'volunteer':
        return 'bg-orange-50 text-orange-700 border-orange-200';

      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
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
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="max-w-7xl mx-auto">

          <div className="h-52 rounded-3xl bg-slate-200 animate-pulse mb-8"></div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-36 bg-white rounded-2xl border border-slate-100 animate-pulse"
              />
            ))}
          </div>

          <div className="h-96 bg-white rounded-3xl border border-slate-100 animate-pulse"></div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-14">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-700 text-white">

        <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-white/5"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-11">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

            <div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm text-sm font-medium text-purple-100 mb-4">
                <ShieldCheck size={16} />
                System Administration
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Admin Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-purple-100 text-sm sm:text-base leading-relaxed">
                Monitor users, donations and requests while
                managing the SHAREbite platform from one place.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">

                <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm">
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  System Operational
                </div>

                <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm">
                  <Users size={15} />
                  {totalUsers} Users
                </div>

              </div>

            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 bg-white text-purple-700 px-5 py-3.5 rounded-xl font-bold shadow-xl hover:bg-purple-50 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <RefreshCw
                size={18}
                className={refreshing ? 'animate-spin' : ''}
              />

              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>

          </div>

        </div>
      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">

        {/* ===================================================
            USER STATS
        =================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

          {/* TOTAL USERS */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:-translate-y-1 hover:shadow-md transition-all">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users size={21} />
              </div>

              <span className="text-[11px] font-bold tracking-wider text-slate-400">
                TOTAL
              </span>

            </div>

            <p className="text-3xl font-bold text-slate-900 mt-4">
              {totalUsers}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Registered Users
            </p>

          </div>

          {/* DONORS */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:-translate-y-1 hover:shadow-md transition-all">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Heart size={21} />
              </div>

              <span className="text-[11px] font-bold tracking-wider text-slate-400">
                DONORS
              </span>

            </div>

            <p className="text-3xl font-bold text-slate-900 mt-4">
              {totalDonors}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Food Contributors
            </p>

          </div>

          {/* NGOS */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:-translate-y-1 hover:shadow-md transition-all">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <Building2 size={21} />
              </div>

              <span className="text-[11px] font-bold tracking-wider text-slate-400">
                NGOS
              </span>

            </div>

            <p className="text-3xl font-bold text-slate-900 mt-4">
              {totalNGOs}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Food Receivers
            </p>

          </div>

          {/* VOLUNTEERS */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:-translate-y-1 hover:shadow-md transition-all">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Truck size={21} />
              </div>

              <span className="text-[11px] font-bold tracking-wider text-slate-400">
                VOLUNTEERS
              </span>

            </div>

            <p className="text-3xl font-bold text-slate-900 mt-4">
              {totalVolunteers}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Delivery Partners
            </p>

          </div>

          {/* ADMINS */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:-translate-y-1 hover:shadow-md transition-all">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Shield size={21} />
              </div>

              <span className="text-[11px] font-bold tracking-wider text-slate-400">
                ADMINS
              </span>

            </div>

            <p className="text-3xl font-bold text-slate-900 mt-4">
              {totalAdmins}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              System Managers
            </p>

          </div>

        </div>

        {/* ===================================================
            FOOD + REQUEST OVERVIEW
        =================================================== */}
        <div className="grid lg:grid-cols-3 gap-5 mb-8">

          {/* FOOD OVERVIEW */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">

            <div className="flex items-center justify-between gap-4 mb-6">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Utensils size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Food & Donation Overview
                  </h2>

                  <p className="text-sm text-slate-500">
                    Current food activity across the platform
                  </p>
                </div>

              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Database size={14} />
                Live Data
              </div>

            </div>

            <div className="grid sm:grid-cols-3 gap-4">

              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <PackageCheck size={17} />
                  Total Donations
                </div>

                <p className="text-3xl font-bold text-slate-900 mt-3">
                  {totalFood}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Food listings created
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
                <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
                  <Activity size={17} />
                  Available Food
                </div>

                <p className="text-3xl font-bold text-emerald-800 mt-3">
                  {availableFood}
                </p>

                <p className="text-xs text-emerald-600 mt-1">
                  Currently available
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 border border-purple-100 p-5">
                <div className="flex items-center gap-2 text-purple-700 text-sm font-medium">
                  <CheckCircle size={17} />
                  Delivered Food
                </div>

                <p className="text-3xl font-bold text-purple-800 mt-3">
                  {deliveredFood}
                </p>

                <p className="text-xs text-purple-600 mt-1">
                  Successfully delivered
                </p>
              </div>

            </div>

          </div>

          {/* REQUEST SUMMARY */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Request Summary
                </h2>

                <p className="text-sm text-slate-500">
                  Delivery workflow
                </p>
              </div>

            </div>

            <div className="space-y-3">

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <Users size={16} className="text-slate-500" />
                  <span className="text-sm font-semibold text-slate-700">
                    Total Requests
                  </span>
                </div>

                <span className="font-bold text-slate-900">
                  {totalRequests}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-yellow-50">
                <div className="flex items-center gap-2.5">
                  <Clock size={16} className="text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-800">
                    Pending
                  </span>
                </div>

                <span className="font-bold text-yellow-900">
                  {pendingRequests}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50">
                <div className="flex items-center gap-2.5">
                  <CheckCircle size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">
                    Approved
                  </span>
                </div>

                <span className="font-bold text-blue-900">
                  {approvedRequests}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-orange-50">
                <div className="flex items-center gap-2.5">
                  <Truck size={16} className="text-orange-600" />
                  <span className="text-sm font-semibold text-orange-800">
                    Picked Up
                  </span>
                </div>

                <span className="font-bold text-orange-900">
                  {pickedUpRequests}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-green-50">
                <div className="flex items-center gap-2.5">
                  <PackageCheck size={16} className="text-green-600" />
                  <span className="text-sm font-semibold text-green-800">
                    Delivered
                  </span>
                </div>

                <span className="font-bold text-green-900">
                  {deliveredRequests}
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            REQUEST STATUS
        =================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">

          <div className="bg-white border border-yellow-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-yellow-600">
              Pending
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {pendingRequests}
            </p>
          </div>

          <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              Approved
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {approvedRequests}
            </p>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
              Picked Up
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {pickedUpRequests}
            </p>
          </div>

          <div className="bg-white border border-green-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-green-600">
              Delivered
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {deliveredRequests}
            </p>
          </div>

          <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-red-600">
              Rejected
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {rejectedRequests}
            </p>
          </div>

        </div>

        {/* ===================================================
            PLATFORM OVERVIEW
        =================================================== */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* USER DISTRIBUTION */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">

            <div className="flex items-center gap-3 mb-7">

              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Platform Overview
                </h2>

                <p className="text-sm text-slate-500">
                  User distribution across SHAREbite
                </p>
              </div>

            </div>

            <div className="space-y-6">

              {/* DONORS */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span className="text-sm font-semibold text-slate-700">
                      Donors
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-600">
                    {totalDonors}
                  </span>

                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${
                        totalUsers
                          ? (totalDonors / totalUsers) * 100
                          : 0
                      }%`
                    }}
                  />

                </div>

              </div>

              {/* NGO */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="text-sm font-semibold text-slate-700">
                      NGOs
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-600">
                    {totalNGOs}
                  </span>

                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${
                        totalUsers
                          ? (totalNGOs / totalUsers) * 100
                          : 0
                      }%`
                    }}
                  />

                </div>

              </div>

              {/* VOLUNTEERS */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    <span className="text-sm font-semibold text-slate-700">
                      Volunteers
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-600">
                    {totalVolunteers}
                  </span>

                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${
                        totalUsers
                          ? (totalVolunteers / totalUsers) * 100
                          : 0
                      }%`
                    }}
                  />

                </div>

              </div>

              {/* ADMINS */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <span className="text-sm font-semibold text-slate-700">
                      Admins
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-600">
                    {totalAdmins}
                  </span>

                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${
                        totalUsers
                          ? (totalAdmins / totalUsers) * 100
                          : 0
                      }%`
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* SYSTEM STATUS */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 to-indigo-700 text-white p-6">

            <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-white/10"></div>

            <div className="relative">

              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                <ShieldCheck size={29} />
              </div>

              <h3 className="text-xl font-bold">
                System Status
              </h3>

              <p className="text-purple-100 text-sm mt-2 leading-relaxed">
                SHAREbite administration services are
                currently active.
              </p>

              <div className="mt-7 bg-white/10 border border-white/10 rounded-2xl p-4">

                <div className="flex items-center gap-3">

                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>

                  <span className="font-bold">
                    System Operational
                  </span>

                </div>

                <p className="text-purple-200 text-xs mt-2">
                  User management services are available.
                </p>

              </div>

              <div className="mt-5 space-y-3 text-sm text-purple-100">

                <div className="flex items-center gap-2">
                  <Users size={16} />
                  {totalUsers} registered users
                </div>

                <div className="flex items-center gap-2">
                  <Utensils size={16} />
                  {totalFood} food donations
                </div>

                <div className="flex items-center gap-2">
                  <Truck size={16} />
                  {deliveredRequests} completed deliveries
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            USER MANAGEMENT
        =================================================== */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

          {/* HEADER */}
          <div className="p-6 sm:p-7 border-b border-slate-100">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users size={21} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Manage Users
                  </h2>

                  <p className="text-sm text-slate-500 mt-0.5">
                    View, search and manage registered accounts.
                  </p>

                </div>

              </div>

              <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-purple-700 px-4 py-2.5 rounded-xl text-sm font-bold">
                <Users size={15} />
                {filteredUsers.length} of {totalUsers} users
              </div>

            </div>

            {/* SEARCH + FILTER */}
            <div className="flex flex-col md:flex-row gap-3 mt-6">

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Search by name or email..."
                  className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 transition"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
                  >
                    <X size={16} />
                  </button>
                )}

              </div>

              <select
                value={selectedRole}
                onChange={(e) =>
                  setSelectedRole(e.target.value)
                }
                className="md:w-52 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 transition cursor-pointer"
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

          {/* =================================================
              NO USERS
          ================================================= */}
          {filteredUsers.length === 0 ? (

            <div className="py-20 px-6 text-center">

              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Users size={30} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                No users found
              </h3>

              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Try changing your search term or selecting a
                different role.
              </p>

              {(searchTerm || selectedRole !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedRole('all');
                  }}
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 font-semibold text-sm hover:bg-purple-100 transition"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              )}

            </div>

          ) : (

            /* =================================================
               USER TABLE
            ================================================= */
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>

                  <tr className="bg-slate-50 border-b border-slate-200">

                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      User
                    </th>

                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Role
                    </th>

                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Registered
                    </th>

                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredUsers.map((u) => (

                    <tr
                      key={u._id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition-colors"
                    >

                      {/* USER */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3 min-w-[240px]">

                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 flex items-center justify-center font-bold text-base shrink-0">
                            {u.name
                              ?.charAt(0)
                              ?.toUpperCase() || 'U'}
                          </div>

                          <div className="min-w-0">

                            <p className="font-bold text-slate-800 truncate max-w-[240px]">
                              {u.name || 'Unknown User'}
                            </p>

                            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 max-w-[280px] truncate">
                              <Mail size={13} className="shrink-0" />
                              <span className="truncate">
                                {u.email}
                              </span>
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

                        <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={16}
                            className="text-slate-400"
                          />

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
                            type="button"
                            onClick={() =>
                              handleDeleteUser(u._id)
                            }
                            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200 transition text-sm font-bold"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>

                        ) : (

                          <span className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-500 text-sm font-semibold">
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

        </section>

        {/* ===================================================
            FOOTER INFO
        =================================================== */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">

          <div className="flex items-center gap-2">
            <ShieldCheck
              size={16}
              className="text-purple-600"
            />
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
