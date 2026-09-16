import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ArrowRight,
  Heart,
  MapPin,
  Utensils,
  RefreshCw,
  Users,
  Sparkles,
  TrendingUp,
  CalendarDays,
  ChevronRight,
} from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const NGODashboard = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH NGO REQUESTS
  // =========================================

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const { data } = await api.get('/request/my');

      setRequests(data);
    } catch (error) {
      console.error('NGO REQUEST ERROR:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to load your requests'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  // =========================================
  // STATISTICS
  // =========================================

  const pendingRequests = requests.filter(
    (request) => request.status === 'pending'
  ).length;

  const approvedRequests = requests.filter(
    (request) => request.status === 'approved'
  ).length;

  const pickedUpRequests = requests.filter(
    (request) => request.status === 'picked_up'
  ).length;

  const deliveredRequests = requests.filter(
    (request) => request.status === 'delivered'
  ).length;

  const rejectedRequests = requests.filter(
    (request) => request.status === 'rejected'
  ).length;

  const peopleServed = requests
    .filter((request) => request.status === 'delivered')
    .reduce(
      (total, request) =>
        total + (Number(request.foodId?.servesPeople) || 0),
      0
    );

  const activeDeliveries = requests.filter(
    (request) =>
      request.status === 'approved' ||
      request.status === 'picked_up'
  ).length;

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';

      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';

      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';

      case 'picked_up':
        return 'bg-blue-50 text-blue-700 border-blue-200';

      case 'delivered':
        return 'bg-purple-50 text-purple-700 border-purple-200';

      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  // =========================================
  // STATUS ICON
  // =========================================

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={14} />;

      case 'approved':
        return <CheckCircle size={14} />;

      case 'rejected':
        return <XCircle size={14} />;

      case 'picked_up':
        return <Truck size={14} />;

      case 'delivered':
        return <CheckCircle size={14} />;

      default:
        return <Package size={14} />;
    }
  };

  // =========================================
  // STATUS TEXT
  // =========================================

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return 'Waiting for donor approval';

      case 'approved':
        return 'Request approved — waiting for pickup';

      case 'picked_up':
        return 'Food picked up — delivery is on the way';

      case 'delivered':
        return 'Food successfully delivered ❤️';

      case 'rejected':
        return 'This request was rejected by the donor';

      default:
        return 'Request status updated';
    }
  };

  // =========================================
  // TRACKING STEPS
  // =========================================

  const trackingSteps = [
    {
      key: 'pending',
      label: 'Request Sent',
      description: 'Your food request has been sent to the donor.',
      icon: <Package size={16} />,
    },
    {
      key: 'approved',
      label: 'Approved',
      description: 'The donor has approved your request.',
      icon: <CheckCircle size={16} />,
    },
    {
      key: 'picked_up',
      label: 'Picked Up',
      description: 'Volunteer has picked up the food.',
      icon: <Truck size={16} />,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      description: 'Food has been delivered successfully.',
      icon: <Heart size={16} />,
    },
  ];

  const getStepState = (status, stepIndex) => {
    const statusOrder = {
      pending: 0,
      approved: 1,
      picked_up: 2,
      delivered: 3,
    };

    const currentIndex = statusOrder[status];

    if (status === 'rejected' || currentIndex === undefined) {
      return 'inactive';
    }

    if (stepIndex < currentIndex) {
      return 'completed';
    }

    if (stepIndex === currentIndex) {
      return 'current';
    }

    return 'upcoming';
  };

  // =========================================
  // TRACKING TIMELINE
  // =========================================

  const renderTrackingTimeline = (request) => {
    if (request.status === 'rejected') {
      return (
        <div className="mt-5 pt-5 border-t border-slate-100">
          <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <XCircle size={20} />
              </div>

              <div>
                <p className="font-bold text-red-700">
                  Request Rejected
                </p>

                <p className="text-sm text-red-600 mt-1">
                  The donor has rejected this food request.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-5 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h4 className="font-bold text-slate-800">
              Delivery Tracking
            </h4>

            <p className="text-xs text-slate-500 mt-1">
              Track your request progress
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Live Status
          </span>
        </div>

        <div className="relative">
          <div className="absolute left-5 top-5 bottom-5 w-px bg-slate-200" />

          <div className="space-y-5">
            {trackingSteps.map((step, index) => {
              const state = getStepState(
                request.status,
                index
              );

              const isCompleted = state === 'completed';
              const isCurrent = state === 'current';

              return (
                <div
                  key={step.key}
                  className="relative flex items-start gap-4"
                >
                  <div
                    className={`
                      relative z-10 w-10 h-10 rounded-full
                      flex items-center justify-center
                      border-4 border-white shrink-0
                      ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-slate-100 text-slate-400'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle size={16} />
                    ) : (
                      step.icon
                    )}
                  </div>

                  <div className="flex-1 pt-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <p
                        className={`
                          font-semibold text-sm
                          ${
                            isCompleted
                              ? 'text-green-700'
                              : isCurrent
                              ? 'text-blue-700'
                              : 'text-slate-400'
                          }
                        `}
                      >
                        {step.label}
                      </p>

                      {isCurrent && (
                        <span className="text-xs font-semibold text-blue-600">
                          Current
                        </span>
                      )}

                      {isCompleted && (
                        <span className="text-xs font-semibold text-green-600">
                          Completed
                        </span>
                      )}
                    </div>

                    <p
                      className={`
                        text-xs mt-1 leading-5
                        ${
                          isCurrent || isCompleted
                            ? 'text-slate-500'
                            : 'text-slate-400'
                        }
                      `}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-cyan-600 text-white">

        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-2xl" />

        <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 lg:py-16">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/15 text-blue-50 text-sm mb-5 backdrop-blur-sm">
                <Sparkles size={15} />
                NGO Dashboard
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Welcome back, {user?.name || 'NGO'}! 👋
              </h1>

              <p className="text-blue-50/90 mt-4 text-base sm:text-lg leading-relaxed max-w-xl">
                Find available food donations, manage your requests,
                and help bring nutritious meals to your community.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-7 text-sm text-blue-100">

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <Search size={16} />
                  </div>
                  Find food
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                  Support communities
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <Heart size={16} />
                  </div>
                  Create impact
                </div>

              </div>

            </div>

            <Link
              to="/food"
              className="group inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3.5 rounded-xl font-bold shadow-xl hover:bg-blue-50 hover:-translate-y-1 transition-all duration-200 whitespace-nowrap"
            >
              <Search size={20} />
              Find Food
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

          </div>

        </div>
      </section>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* ===================================================
            STATS
        =================================================== */}

        <section className="-mt-7 relative z-10">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Total */}

            <div className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-200">

              <div className="flex items-start justify-between gap-3">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Requests
                  </p>

                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {requests.length}
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

            <div className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-200">

              <div className="flex items-start justify-between gap-3">

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

            <div className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-200">

              <div className="flex items-start justify-between gap-3">

                <div>
                  <p className="text-sm text-slate-500">
                    Active
                  </p>

                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {activeDeliveries}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    In progress
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Truck size={21} />
                </div>

              </div>

            </div>


            {/* Delivered */}

            <div className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-200">

              <div className="flex items-start justify-between gap-3">

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

                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Heart size={21} />
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="grid lg:grid-cols-3 gap-6 mt-8">

          {/* =================================================
              REQUESTS
          ================================================= */}

          <section className="lg:col-span-2">

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Header */}

              <div className="px-5 sm:px-6 py-5 border-b border-slate-100">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-2">

                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Package size={19} />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-slate-800">
                          My Food Requests
                        </h2>

                        <p className="text-xs text-slate-500 mt-0.5">
                          Track every request in one place
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="flex items-center gap-2">

                    {requests.length > 0 && (
                      <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                        {requests.length} request
                        {requests.length !== 1 ? 's' : ''}
                      </span>
                    )}

                    <button
                      onClick={fetchRequests}
                      disabled={loading}
                      className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all disabled:opacity-60"
                      title="Refresh requests"
                      aria-label="Refresh requests"
                    >
                      <RefreshCw
                        size={18}
                        className={loading ? 'animate-spin' : ''}
                      />
                    </button>

                  </div>

                </div>

              </div>


              {/* Content */}

              <div className="p-5 sm:p-6">

                {loading ? (

                  /* Loading */

                  <div className="space-y-4">

                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-slate-200 p-5 animate-pulse"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-slate-200" />

                            <div>
                              <div className="w-40 h-4 bg-slate-200 rounded" />
                              <div className="w-28 h-3 bg-slate-200 rounded mt-2" />
                            </div>
                          </div>

                          <div className="w-24 h-7 bg-slate-200 rounded-full" />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 mt-5">
                          <div className="h-14 bg-slate-100 rounded-xl" />
                          <div className="h-14 bg-slate-100 rounded-xl" />
                        </div>

                        <div className="h-24 bg-slate-100 rounded-xl mt-5" />
                      </div>
                    ))}

                  </div>

                ) : requests.length === 0 ? (

                  /* Empty */

                  <div className="py-16 text-center">

                    <div className="relative w-24 h-24 mx-auto">

                      <div className="absolute inset-0 rounded-3xl bg-blue-50" />

                      <div className="relative w-full h-full flex items-center justify-center text-blue-500">
                        <Utensils size={38} />
                      </div>

                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mt-6">
                      No food requests yet
                    </h3>

                    <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-6">
                      Browse available food donations and request
                      food for your community. Your requests will
                      appear here.
                    </p>

                    <Link
                      to="/food"
                      className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-600/20"
                    >
                      <Search size={18} />
                      Browse Food
                      <ArrowRight size={17} />
                    </Link>

                  </div>

                ) : (

                  /* Requests */

                  <div className="space-y-5">

                    {requests.map((request) => (

                      <article
                        key={request._id}
                        className="group rounded-2xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
                      >

                        {/* Request header */}

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                          <div className="flex items-start gap-3 min-w-0">

                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Utensils size={20} />
                            </div>

                            <div className="min-w-0">

                              <h3 className="text-base sm:text-lg font-bold text-slate-800 truncate">
                                {request.foodId?.foodName ||
                                  'Food Donation'}
                              </h3>

                              <div className="flex flex-wrap items-center gap-2 mt-1.5">

                                <span className="text-xs text-slate-500">
                                  Food donation request
                                </span>

                                {request.foodId?.foodCategory && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />

                                    <span className="text-xs font-semibold text-blue-600 capitalize">
                                      {request.foodId.foodCategory}
                                    </span>
                                  </>
                                )}

                              </div>

                            </div>

                          </div>


                          {/* Status */}

                          <span
                            className={`
                              inline-flex items-center gap-1.5
                              self-start px-3 py-1.5 rounded-full
                              border text-xs font-bold capitalize
                              ${getStatusStyle(request.status)}
                            `}
                          >
                            {getStatusIcon(request.status)}
                            {request.status.replace('_', ' ')}
                          </span>

                        </div>


                        {/* Details */}

                        <div className="grid sm:grid-cols-2 gap-3 mt-5">

                          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">

                            <div className="w-9 h-9 rounded-lg bg-white text-slate-500 flex items-center justify-center shadow-sm">
                              <Package size={17} />
                            </div>

                            <div className="min-w-0">

                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                Quantity
                              </p>

                              <p className="text-sm font-semibold text-slate-700 mt-0.5 truncate">
                                {request.foodId?.quantity || 'N/A'}
                              </p>

                            </div>

                          </div>


                          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">

                            <div className="w-9 h-9 rounded-lg bg-white text-slate-500 flex items-center justify-center shadow-sm">
                              <MapPin size={17} />
                            </div>

                            <div className="min-w-0">

                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                Location
                              </p>

                              <p className="text-sm font-semibold text-slate-700 mt-0.5 truncate">
                                {request.foodId?.location ||
                                  'Location unavailable'}
                              </p>

                            </div>

                          </div>

                        </div>


                        {/* Extra info */}

                        <div className="flex flex-wrap gap-2 mt-4">

                          {request.foodId?.foodType && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 capitalize">
                              {request.foodId.foodType === 'veg'
                                ? '🟢 Veg'
                                : '🔴 Non-Veg'}
                            </span>
                          )}

                          {request.foodId?.servesPeople && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-100 text-xs font-semibold text-green-700">
                              <Users size={13} />
                              Serves {request.foodId.servesPeople}
                            </span>
                          )}

                        </div>


                        {/* Status message */}

                        <div className="mt-5 pt-4 border-t border-slate-100">

                          <div
                            className={`
                              flex items-center gap-2 text-sm font-semibold
                              ${
                                request.status === 'pending'
                                  ? 'text-amber-700'
                                  : request.status === 'approved'
                                  ? 'text-green-700'
                                  : request.status === 'picked_up'
                                  ? 'text-blue-700'
                                  : request.status === 'delivered'
                                  ? 'text-purple-700'
                                  : 'text-red-700'
                              }
                            `}
                          >

                            {request.status === 'pending' && (
                              <Clock size={17} />
                            )}

                            {request.status === 'approved' && (
                              <CheckCircle size={17} />
                            )}

                            {request.status === 'picked_up' && (
                              <Truck size={17} />
                            )}

                            {request.status === 'delivered' && (
                              <Heart size={17} />
                            )}

                            {request.status === 'rejected' && (
                              <XCircle size={17} />
                            )}

                            {getStatusMessage(request.status)}

                          </div>

                        </div>


                        {/* Tracking */}

                        {renderTrackingTimeline(request)}

                      </article>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </section>


          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside>

            {/* Quick Actions */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Workspace
                  </p>

                  <h2 className="text-lg font-bold text-slate-800 mt-1">
                    Quick Actions
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Manage your food requests
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <ArrowRight size={18} />
                </div>

              </div>


              {/* Find Food */}

              <Link
                to="/food"
                className="group flex items-center justify-between gap-3 p-4 mt-5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 hover:-translate-y-0.5 transition-all"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <Search size={19} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-800 text-sm">
                      Find Food
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Browse available donations
                    </p>
                  </div>

                </div>

                <ChevronRight
                  size={18}
                  className="text-blue-500 group-hover:translate-x-1 transition-transform"
                />

              </Link>


              {/* My Requests */}

              <Link
                to="/my-requests"
                className="group flex items-center justify-between gap-3 p-4 mt-3 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 hover:border-green-200 hover:-translate-y-0.5 transition-all"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-sm">
                    <Package size={19} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-800 text-sm">
                      My Requests
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5">
                      View request history
                    </p>
                  </div>

                </div>

                <ChevronRight
                  size={18}
                  className="text-green-500 group-hover:translate-x-1 transition-transform"
                />

              </Link>

            </div>


            {/* Community Impact */}

            <div className="relative overflow-hidden mt-6 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">

              <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-xl" />

              <div className="absolute -bottom-16 -left-12 w-40 h-40 bg-cyan-300/10 rounded-full blur-2xl" />

              <div className="relative">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                    <Heart size={22} />
                  </div>

                  <div>

                    <h3 className="text-lg font-bold">
                      Community Impact
                    </h3>

                    <p className="text-blue-100 text-xs mt-0.5">
                      Your NGO is making a difference.
                    </p>

                  </div>

                </div>


                {/* Impact stats */}

                <div className="grid grid-cols-2 gap-3 mt-6">

                  <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm">

                    <div className="flex items-center justify-between">

                      <p className="text-blue-100 text-xs">
                        Requests
                      </p>

                      <Package size={15} />

                    </div>

                    <p className="text-2xl font-bold mt-2">
                      {requests.length}
                    </p>

                  </div>


                  <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm">

                    <div className="flex items-center justify-between">

                      <p className="text-blue-100 text-xs">
                        People Served
                      </p>

                      <Users size={15} />

                    </div>

                    <p className="text-2xl font-bold mt-2">
                      {peopleServed}
                    </p>

                  </div>


                  <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm">

                    <div className="flex items-center justify-between">

                      <p className="text-blue-100 text-xs">
                        Food Received
                      </p>

                      <Heart size={15} />

                    </div>

                    <p className="text-2xl font-bold mt-2">
                      {deliveredRequests}
                    </p>

                  </div>


                  <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm">

                    <div className="flex items-center justify-between">

                      <p className="text-blue-100 text-xs">
                        Active
                      </p>

                      <Truck size={15} />

                    </div>

                    <p className="text-2xl font-bold mt-2">
                      {activeDeliveries}
                    </p>

                  </div>

                </div>


                {/* Bottom summary */}

                <div className="mt-5 pt-4 border-t border-white/20">

                  <div className="flex items-center justify-between">

                    <span className="text-blue-100 text-sm">
                      Rejected Requests
                    </span>

                    <span className="inline-flex items-center gap-1.5 font-bold text-sm">
                      <XCircle size={15} />
                      {rejectedRequests}
                    </span>

                  </div>

                  <div className="flex items-center justify-between mt-3">

                    <span className="text-blue-100 text-sm">
                      Picked Up
                    </span>

                    <span className="inline-flex items-center gap-1.5 font-bold text-sm">
                      <Truck size={15} />
                      {pickedUpRequests}
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* Progress card */}

            <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <TrendingUp size={19} />
                </div>

                <div className="flex-1">

                  <div className="flex items-center justify-between gap-3">

                    <div>
                      <p className="font-bold text-slate-800 text-sm">
                        Delivery Progress
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Successful deliveries
                      </p>
                    </div>

                    <span className="text-sm font-bold text-green-600">
                      {requests.length > 0
                        ? Math.round(
                            (deliveredRequests /
                              requests.length) *
                              100
                          )
                        : 0}
                      %
                    </span>

                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-4">

                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          requests.length > 0
                            ? Math.round(
                                (deliveredRequests /
                                  requests.length) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>


            {/* Encouragement */}

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-5">

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles size={19} />
                </div>

                <div>

                  <p className="font-bold text-slate-800 text-sm">
                    Keep making an impact
                  </p>

                  <p className="text-xs text-slate-600 mt-1 leading-5">
                    Every successful delivery connects surplus
                    food with people who need it.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>


        {/* ===================================================
            BOTTOM IMPACT BANNER
        =================================================== */}

        <section className="mt-8">

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 via-emerald-600 to-teal-500 text-white p-6 sm:p-8">

            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/10 blur-2xl" />

            <div className="absolute -bottom-24 left-1/3 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <Heart size={23} />
                </div>

                <div>

                  <p className="text-xs uppercase tracking-wider text-green-100 font-bold">
                    Together we can make a difference
                  </p>

                  <h2 className="text-xl sm:text-2xl font-bold mt-1">
                    {peopleServed > 0
                      ? `${peopleServed} people reached through your deliveries`
                      : 'Every successful delivery creates an impact'}
                  </h2>

                  <p className="text-sm text-green-100 mt-2 max-w-2xl">
                    Continue connecting available food with
                    communities that need support.
                  </p>

                </div>

              </div>

              <Link
                to="/food"
                className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-5 py-3 rounded-xl font-bold hover:bg-green-50 hover:-translate-y-0.5 transition-all whitespace-nowrap"
              >
                Find More Food
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default NGODashboard;
