import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Heart,
  MapPin,
  Users,
  RefreshCw,
  Search,
  ArrowRight,
  CalendarDays,
  Utensils,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyRequests = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // ACCESS CONTROL
  // =========================================================

  if (!user || (user.role !== 'ngo' && user.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  // =========================================================
  // FETCH REQUESTS
  // =========================================================

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const { data } = await api.get('/request/my');

      setRequests(data);
    } catch (error) {
      console.error('REQUEST ERROR:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to fetch requests'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // =========================================================
  // STATUS HELPERS
  // =========================================================

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return {
          label: 'Approved',
          icon: <CheckCircle size={14} />,
          className:
            'bg-emerald-50 text-emerald-700 border-emerald-200',
        };

      case 'picked_up':
      case 'pickedup':
        return {
          label: 'Picked Up',
          icon: <Truck size={14} />,
          className:
            'bg-purple-50 text-purple-700 border-purple-200',
        };

      case 'delivered':
        return {
          label: 'Delivered',
          icon: <Heart size={14} />,
          className:
            'bg-green-50 text-green-700 border-green-200',
        };

      case 'rejected':
        return {
          label: 'Rejected',
          icon: <XCircle size={14} />,
          className:
            'bg-red-50 text-red-700 border-red-200',
        };

      case 'pending':
      default:
        return {
          label: 'Pending',
          icon: <Clock size={14} />,
          className:
            'bg-amber-50 text-amber-700 border-amber-200',
        };
    }
  };

  const getProgress = (status) => {
    switch (status) {
      case 'approved':
        return 50;

      case 'picked_up':
      case 'pickedup':
        return 75;

      case 'delivered':
        return 100;

      case 'rejected':
        return 0;

      default:
        return 25;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return 'Waiting for donor approval';

      case 'approved':
        return 'Request approved — waiting for pickup';

      case 'picked_up':
      case 'pickedup':
        return 'Food picked up — delivery is on the way';

      case 'delivered':
        return 'Food successfully delivered';

      case 'rejected':
        return 'This request was rejected by the donor';

      default:
        return 'Request status updated';
    }
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) => request.status === 'pending'
  ).length;

  const activeRequests = requests.filter(
    (request) =>
      request.status === 'approved' ||
      request.status === 'picked_up' ||
      request.status === 'pickedup'
  ).length;

  const deliveredRequests = requests.filter(
    (request) => request.status === 'delivered'
  ).length;

  const rejectedRequests = requests.filter(
    (request) => request.status === 'rejected'
  ).length;

  const totalPeople = requests.reduce(
    (total, request) =>
      total +
      (Number(request.foodId?.servesPeople) || 0),
    0
  );

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">

        <div className="max-w-7xl mx-auto animate-pulse">

          {/* Hero skeleton */}

          <div className="h-56 bg-slate-200 rounded-3xl mb-8" />

          {/* Stats skeleton */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl p-5 border border-slate-100"
              >
                <div className="w-11 h-11 bg-slate-200 rounded-xl mb-4" />
                <div className="w-16 h-7 bg-slate-200 rounded mb-2" />
                <div className="w-28 h-4 bg-slate-200 rounded" />
              </div>
            ))}

          </div>

          {/* Content skeleton */}

          <div className="bg-white rounded-3xl border border-slate-100 p-6">

            <div className="w-48 h-7 bg-slate-200 rounded mb-6" />

            <div className="space-y-4">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-44 bg-slate-100 rounded-2xl"
                />
              ))}

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 pb-16">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white shadow-lg">

          <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 p-7 sm:p-9 lg:p-11">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

              <div className="max-w-2xl">

                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/15 text-green-50 text-sm backdrop-blur-sm">
                  <Package size={15} />
                  Request Management
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-5">
                  My Food Requests
                </h1>

                <p className="mt-4 text-green-50/90 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Track your food donations, monitor delivery
                  progress and stay updated from request to
                  successful delivery.
                </p>

                <div className="flex flex-wrap gap-3 mt-6">

                  <div className="inline-flex items-center gap-2 text-sm text-green-50">
                    <CheckCircle size={16} />
                    Track requests
                  </div>

                  <div className="inline-flex items-center gap-2 text-sm text-green-50">
                    <Truck size={16} />
                    Monitor delivery
                  </div>

                  <div className="inline-flex items-center gap-2 text-sm text-green-50">
                    <Heart size={16} />
                    Create impact
                  </div>

                </div>

              </div>

              <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 min-w-[190px]">

                <div className="flex items-center justify-between">

                  <p className="text-green-100 text-sm">
                    Total Requests
                  </p>

                  <Package size={18} className="text-green-100" />

                </div>

                <p className="text-4xl font-bold mt-2">
                  {totalRequests}
                </p>

                <p className="text-green-100 text-xs mt-1">
                  Food requests submitted
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            STATS
        ====================================================== */}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-7">

          {/* Total */}

          <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:-translate-y-1 hover:shadow-lg transition-all">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Requests
                </p>

                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {totalRequests}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  All requests
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Package size={21} />
              </div>

            </div>

          </div>


          {/* Pending */}

          <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:-translate-y-1 hover:shadow-lg transition-all">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Pending
                </p>

                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {pendingRequests}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Awaiting approval
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock size={21} />
              </div>

            </div>

          </div>


          {/* Active */}

          <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:-translate-y-1 hover:shadow-lg transition-all">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Active
                </p>

                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {activeRequests}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  In progress
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Truck size={21} />
              </div>

            </div>

          </div>


          {/* Delivered */}

          <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:-translate-y-1 hover:shadow-lg transition-all">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Delivered
                </p>

                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {deliveredRequests}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Successfully received
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Heart size={21} />
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            REQUEST HISTORY
        ====================================================== */}

        <section className="mt-7">

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Header */}

            <div className="px-5 sm:px-7 py-6 border-b border-slate-100">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                      <CalendarDays size={20} />
                    </div>

                    <div>

                      <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                        Request History
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        All your food requests in one place
                      </p>

                    </div>

                  </div>

                </div>

                <button
                  onClick={fetchRequests}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 transition disabled:opacity-60"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? 'animate-spin' : ''}
                  />
                  Refresh
                </button>

              </div>

            </div>


            {/* Requests */}

            <div className="p-5 sm:p-7">

              {requests.length === 0 ? (

                <div className="text-center py-14">

                  <div className="w-24 h-24 mx-auto rounded-3xl bg-green-50 text-green-600 flex items-center justify-center">
                    <Utensils size={38} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mt-6">
                    No requests yet
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-6">
                    You haven't requested any food donations yet.
                    Browse available food and request what your
                    organization needs.
                  </p>

                  <Link
                    to="/food"
                    className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-green-600/20"
                  >
                    <Search size={18} />
                    Browse Food
                    <ArrowRight size={17} />
                  </Link>

                </div>

              ) : (

                <div className="space-y-5">

                  {requests.map((req) => {

                    const statusInfo = getStatusInfo(
                      req.status
                    );

                    const progress = getProgress(
                      req.status
                    );

                    return (

                      <article
                        key={req._id}
                        className="group border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-green-200 hover:shadow-lg transition-all duration-300"
                      >

                        {/* Top */}

                        <div className="flex flex-col lg:flex-row lg:items-start gap-5">

                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 text-green-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Utensils size={23} />
                          </div>

                          <div className="flex-1 min-w-0">

                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                              <div>

                                <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                                  {req.foodId?.foodName ||
                                    'Food Donation'}
                                </h3>

                                <div className="flex flex-wrap items-center gap-2 mt-1.5">

                                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                    <CalendarDays size={13} />
                                    {new Date(
                                      req.createdAt
                                    ).toLocaleDateString(
                                      'en-IN',
                                      {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                      }
                                    )}
                                  </span>

                                  {req.foodId?.foodCategory && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-slate-300" />

                                      <span className="text-xs font-semibold text-green-600 capitalize">
                                        {req.foodId.foodCategory}
                                      </span>
                                    </>
                                  )}

                                </div>

                              </div>

                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold w-fit ${statusInfo.className}`}
                              >
                                {statusInfo.icon}
                                {statusInfo.label}
                              </span>

                            </div>


                            {/* DETAILS */}

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">

                              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">

                                <div className="flex items-center gap-2 text-slate-400 mb-1">

                                  <Package size={14} />

                                  <p className="text-[10px] uppercase tracking-wider font-bold">
                                    Quantity
                                  </p>

                                </div>

                                <p className="text-sm font-bold text-slate-700 truncate">
                                  {req.foodId?.quantity ||
                                    'N/A'}
                                </p>

                              </div>


                              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">

                                <div className="flex items-center gap-2 text-slate-400 mb-1">

                                  <MapPin size={14} />

                                  <p className="text-[10px] uppercase tracking-wider font-bold">
                                    Pickup Location
                                  </p>

                                </div>

                                <p className="text-sm font-bold text-slate-700 truncate">
                                  {req.foodId?.location ||
                                    'N/A'}
                                </p>

                              </div>


                              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">

                                <div className="flex items-center gap-2 text-slate-400 mb-1">

                                  <Users size={14} />

                                  <p className="text-[10px] uppercase tracking-wider font-bold">
                                    People Served
                                  </p>

                                </div>

                                <p className="text-sm font-bold text-slate-700">
                                  {req.foodId?.servesPeople ||
                                    0}
                                </p>

                              </div>

                            </div>


                            {/* EXTRA BADGES */}

                            <div className="flex flex-wrap gap-2 mt-4">

                              {req.foodId?.foodType && (
                                <span className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 capitalize">
                                  {req.foodId.foodType ===
                                  'veg'
                                    ? '🟢 Veg'
                                    : '🔴 Non-Veg'}
                                </span>
                              )}

                              {req.foodId?.priority && (
                                <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 capitalize">
                                  Priority: {req.foodId.priority}
                                </span>
                              )}

                            </div>


                            {/* STATUS MESSAGE */}

                            <div className="mt-5 pt-4 border-t border-slate-100">

                              <div
                                className={`flex items-center gap-2 text-sm font-semibold ${
                                  req.status === 'pending'
                                    ? 'text-amber-700'
                                    : req.status ===
                                        'approved'
                                    ? 'text-green-700'
                                    : req.status ===
                                          'picked_up' ||
                                      req.status ===
                                          'pickedup'
                                    ? 'text-purple-700'
                                    : req.status ===
                                      'delivered'
                                    ? 'text-green-700'
                                    : 'text-red-700'
                                }`}
                              >

                                {req.status === 'pending' && (
                                  <Clock size={17} />
                                )}

                                {req.status === 'approved' && (
                                  <CheckCircle size={17} />
                                )}

                                {(req.status ===
                                  'picked_up' ||
                                  req.status ===
                                    'pickedup') && (
                                  <Truck size={17} />
                                )}

                                {req.status === 'delivered' && (
                                  <Heart size={17} />
                                )}

                                {req.status === 'rejected' && (
                                  <XCircle size={17} />
                                )}

                                {getStatusMessage(
                                  req.status
                                )}

                              </div>

                            </div>


                            {/* PROGRESS */}

                            {req.status !== 'rejected' && (

                              <div className="mt-5">

                                <div className="flex items-center justify-between mb-2">

                                  <span className="text-xs font-bold text-slate-500">
                                    Delivery Progress
                                  </span>

                                  <span className="text-xs font-bold text-green-600">
                                    {progress}%
                                  </span>

                                </div>

                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                                  <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-700"
                                    style={{
                                      width: `${progress}%`,
                                    }}
                                  />

                                </div>

                                <div className="grid grid-cols-4 mt-2 text-[10px] sm:text-[11px] text-slate-400">

                                  <span
                                    className={
                                      progress >= 25
                                        ? 'text-green-600 font-bold'
                                        : ''
                                    }
                                  >
                                    Requested
                                  </span>

                                  <span
                                    className={
                                      progress >= 50
                                        ? 'text-green-600 font-bold text-center'
                                        : 'text-center'
                                    }
                                  >
                                    Approved
                                  </span>

                                  <span
                                    className={
                                      progress >= 75
                                        ? 'text-green-600 font-bold text-center'
                                        : 'text-center'
                                    }
                                  >
                                    Picked Up
                                  </span>

                                  <span
                                    className={
                                      progress >= 100
                                        ? 'text-green-600 font-bold text-right'
                                        : 'text-right'
                                    }
                                  >
                                    Delivered
                                  </span>

                                </div>

                              </div>

                            )}


                            {/* REJECTED */}

                            {req.status === 'rejected' && (

                              <div className="mt-5 rounded-xl bg-red-50 border border-red-100 p-4">

                                <div className="flex items-start gap-3">

                                  <XCircle
                                    size={18}
                                    className="text-red-500 mt-0.5 shrink-0"
                                  />

                                  <div>

                                    <p className="text-sm font-bold text-red-700">
                                      Request Rejected
                                    </p>

                                    <p className="text-xs text-red-600 mt-1">
                                      The donor has rejected
                                      this food request.
                                    </p>

                                  </div>

                                </div>

                              </div>

                            )}

                          </div>

                        </div>

                      </article>

                    );
                  })}

                </div>

              )}

            </div>

          </div>

        </section>


        {/* =====================================================
            IMPACT SECTION
        ====================================================== */}

        {requests.length > 0 && (

          <section className="mt-7">

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 via-emerald-600 to-teal-500 text-white p-6 sm:p-8 shadow-lg">

              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl" />

              <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

              <div className="relative z-10">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                      <Sparkles size={23} />
                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-wider text-green-100 font-bold">
                        Community Impact
                      </p>

                      <h2 className="text-xl sm:text-2xl font-bold mt-1">
                        Your organization is making a difference
                      </h2>

                      <p className="text-sm text-green-100 mt-2 max-w-2xl">
                        Every successful food delivery helps
                        reduce food waste and supports people
                        in need.
                      </p>

                    </div>

                  </div>


                  <Link
                    to="/food"
                    className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-5 py-3 rounded-xl font-bold hover:bg-green-50 hover:-translate-y-0.5 transition-all whitespace-nowrap"
                  >
                    Find More Food
                    <ArrowRight size={17} />
                  </Link>

                </div>


                {/* Impact stats */}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">

                  <div className="rounded-xl bg-white/10 border border-white/10 p-4">

                    <Package size={17} />

                    <p className="text-2xl font-bold mt-2">
                      {totalRequests}
                    </p>

                    <p className="text-xs text-green-100">
                      Requests
                    </p>

                  </div>


                  <div className="rounded-xl bg-white/10 border border-white/10 p-4">

                    <Clock size={17} />

                    <p className="text-2xl font-bold mt-2">
                      {pendingRequests}
                    </p>

                    <p className="text-xs text-green-100">
                      Pending
                    </p>

                  </div>


                  <div className="rounded-xl bg-white/10 border border-white/10 p-4">

                    <Truck size={17} />

                    <p className="text-2xl font-bold mt-2">
                      {activeRequests}
                    </p>

                    <p className="text-xs text-green-100">
                      Active
                    </p>

                  </div>


                  <div className="rounded-xl bg-white/10 border border-white/10 p-4">

                    <Users size={17} />

                    <p className="text-2xl font-bold mt-2">
                      {totalPeople}
                    </p>

                    <p className="text-xs text-green-100">
                      Potential Meals
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
};

export default MyRequests;
