import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ArrowRight,
  Bell,
  UtensilsCrossed,
  Users,
  TrendingUp,
  Sparkles,
  MapPin,
  RefreshCw,
} from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingRequest, setUpdatingRequest] = useState(null);

  // =========================================================
  // FETCH REQUESTS
  // =========================================================

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const { data } = await api.get('/request/donor');

      setRequests(data);
    } catch (error) {
      console.error('DONOR REQUEST ERROR:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to load requests'
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

  // =========================================================
  // UPDATE REQUEST
  // =========================================================

  const updateRequestStatus = async (requestId, status) => {
    try {
      setUpdatingRequest(requestId);

      await api.put('/request/update-status', {
        requestId,
        status,
      });

      toast.success(
        status === 'approved'
          ? 'Request approved successfully! 🎉'
          : 'Request rejected'
      );

      await fetchRequests();
    } catch (error) {
      console.error('STATUS ERROR:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to update request'
      );
    } finally {
      setUpdatingRequest(null);
    }
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const pendingRequests = requests.filter(
    (request) => request.status === 'pending'
  ).length;

  const approvedRequests = requests.filter(
    (request) => request.status === 'approved'
  ).length;

  const pickedUpRequests = requests.filter(
    (request) =>
      request.status === 'picked_up' ||
      request.status === 'pickedup'
  ).length;

  const deliveredRequests = requests.filter(
    (request) => request.status === 'delivered'
  ).length;

  const rejectedRequests = requests.filter(
    (request) => request.status === 'rejected'
  ).length;

  // =========================================================
  // IMPACT
  // =========================================================

  const totalDonations = new Set(
    requests
      .map((request) => request.foodId?._id)
      .filter(Boolean)
  ).size;

  const deliveredPeople = requests
    .filter((request) => request.status === 'delivered')
    .reduce(
      (total, request) =>
        total +
        (Number(request.foodId?.servesPeople) || 0),
      0
    );

  const activeDonations = requests.filter(
    (request) =>
      request.status === 'approved' ||
      request.status === 'picked_up' ||
      request.status === 'pickedup'
  ).length;

  // =========================================================
  // STATUS
  // =========================================================

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return {
          label: 'Approved',
          icon: <CheckCircle size={14} />,
          style:
            'bg-emerald-50 text-emerald-700 border-emerald-100',
        };

      case 'rejected':
        return {
          label: 'Rejected',
          icon: <XCircle size={14} />,
          style:
            'bg-red-50 text-red-700 border-red-100',
        };

      case 'picked_up':
      case 'pickedup':
        return {
          label: 'Picked Up',
          icon: <Truck size={14} />,
          style:
            'bg-blue-50 text-blue-700 border-blue-100',
        };

      case 'delivered':
        return {
          label: 'Delivered',
          icon: <CheckCircle size={14} />,
          style:
            'bg-purple-50 text-purple-700 border-purple-100',
        };

      default:
        return {
          label: 'Pending',
          icon: <Clock size={14} />,
          style:
            'bg-amber-50 text-amber-700 border-amber-100',
        };
    }
  };

  // =========================================================
  // PROGRESS
  // =========================================================

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

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 pb-16">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white">

        <div className="absolute -top-28 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />

        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 lg:py-16">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-green-50 text-sm mb-5 backdrop-blur-sm">
                <Sparkles size={15} />
                Donor Dashboard
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Welcome back, {user?.name}! 👋
              </h1>

              <p className="text-green-50/90 mt-4 text-base sm:text-lg leading-relaxed max-w-xl">
                Your generosity helps turn surplus food into
                meaningful support for people and communities.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">

                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm">
                  <TrendingUp size={16} />
                  Making an impact
                </div>

                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm">
                  <Users size={16} />
                  Helping communities
                </div>

              </div>

            </div>

            <Link
              to="/add-food"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-6 py-3.5 rounded-xl font-bold shadow-xl hover:bg-green-50 hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              <Plus size={20} />
              Donate Food
            </Link>

          </div>

        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* =====================================================
            STATS
        ====================================================== */}

        <section className="-mt-6 relative z-10">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/40 hover:-translate-y-1 transition-all">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Requests
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {loading ? '—' : requests.length}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    All incoming requests
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package size={21} />
                </div>

              </div>

            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/40 hover:-translate-y-1 transition-all">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Pending
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {loading ? '—' : pendingRequests}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Need your response
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock size={21} />
                </div>

              </div>

            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/40 hover:-translate-y-1 transition-all">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Active
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {loading ? '—' : activeDonations}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Approved / pickup
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <Truck size={21} />
                </div>

              </div>

            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/40 hover:-translate-y-1 transition-all">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Delivered
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {loading ? '—' : deliveredRequests}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Successfully completed
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CheckCircle size={21} />
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            REQUESTS + SIDEBAR
        ====================================================== */}

        <div className="grid lg:grid-cols-3 gap-6 mt-8">

          {/* ===================================================
              REQUESTS
          =================================================== */}

          <section className="lg:col-span-2">

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

              {/* HEADER */}

              <div className="px-5 sm:px-7 py-6 border-b border-slate-100">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <Bell size={19} />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          Food Requests
                        </h2>

                        <p className="text-sm text-slate-500 mt-0.5">
                          Review and manage requests for your donations.
                        </p>
                      </div>

                    </div>

                  </div>

                  <button
                    onClick={fetchRequests}
                    disabled={loading}
                    className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition disabled:opacity-50"
                    title="Refresh requests"
                  >
                    <RefreshCw
                      size={17}
                      className={loading ? 'animate-spin' : ''}
                    />
                  </button>

                </div>

              </div>

              {/* CONTENT */}

              <div className="p-5 sm:p-7">

                {loading ? (

                  <div className="space-y-4">

                    {[1, 2, 3].map((item) => (

                      <div
                        key={item}
                        className="animate-pulse border border-slate-100 rounded-2xl p-5"
                      >

                        <div className="flex justify-between gap-4">

                          <div className="flex gap-3">

                            <div className="w-11 h-11 bg-slate-200 rounded-xl" />

                            <div>
                              <div className="h-5 bg-slate-200 rounded w-40 mb-2" />
                              <div className="h-4 bg-slate-200 rounded w-28" />
                            </div>

                          </div>

                          <div className="h-7 bg-slate-200 rounded-full w-20" />

                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 mt-5">

                          <div className="h-16 bg-slate-100 rounded-xl" />
                          <div className="h-16 bg-slate-100 rounded-xl" />

                        </div>

                      </div>

                    ))}

                  </div>

                ) : requests.length === 0 ? (

                  <div className="py-14 text-center">

                    <div className="w-20 h-20 mx-auto rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
                      <UtensilsCrossed size={34} />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mt-5">
                      No requests yet
                    </h3>

                    <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                      Once an NGO requests one of your food
                      donations, the request will appear here.
                    </p>

                    <Link
                      to="/add-food"
                      className="inline-flex items-center gap-2 mt-6 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-md"
                    >
                      <Plus size={18} />
                      Create Donation
                    </Link>

                  </div>

                ) : (

                  <div className="space-y-4">

                    {requests.map((request) => {

                      const statusInfo = getStatusInfo(
                        request.status
                      );

                      const progress = getProgress(
                        request.status
                      );

                      const isUpdating =
                        updatingRequest === request._id;

                      return (

                        <article
                          key={request._id}
                          className="group border border-slate-200 rounded-2xl p-5 hover:border-green-200 hover:shadow-lg transition-all duration-300"
                        >

                          {/* TOP */}

                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                            <div className="flex items-start gap-3 min-w-0">

                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 text-green-600 flex items-center justify-center shrink-0">
                                <UtensilsCrossed size={21} />
                              </div>

                              <div className="min-w-0">

                                <h3 className="text-lg font-bold text-slate-900 truncate">
                                  {request.foodId?.foodName ||
                                    'Food Donation'}
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                  Requested by{' '}
                                  <span className="font-semibold text-slate-700">
                                    {request.receiverId?.name ||
                                      'NGO'}
                                  </span>
                                </p>

                              </div>

                            </div>

                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold w-fit capitalize ${statusInfo.style}`}
                            >
                              {statusInfo.icon}
                              {statusInfo.label}
                            </span>

                          </div>

                          {/* DETAILS */}

                          <div className="grid sm:grid-cols-2 gap-3 mt-5">

                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50">

                              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-500 shadow-sm">
                                <Package size={17} />
                              </div>

                              <div className="min-w-0">

                                <p className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">
                                  Quantity
                                </p>

                                <p className="text-sm font-semibold text-slate-700 mt-0.5 truncate">
                                  {request.foodId?.quantity ||
                                    'N/A'}
                                </p>

                              </div>

                            </div>

                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50">

                              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-500 shadow-sm">
                                <MapPin size={17} />
                              </div>

                              <div className="min-w-0">

                                <p className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">
                                  Pickup Location
                                </p>

                                <p
                                  className="text-sm font-semibold text-slate-700 mt-0.5 truncate"
                                  title={request.foodId?.location}
                                >
                                  {request.foodId?.location ||
                                    'N/A'}
                                </p>

                              </div>

                            </div>

                          </div>

                          {/* PROGRESS */}

                          {request.status !== 'rejected' && (

                            <div className="mt-5">

                              <div className="flex items-center justify-between mb-2">

                                <span className="text-xs font-semibold text-slate-500">
                                  Delivery Progress
                                </span>

                                <span className="text-xs font-bold text-green-600">
                                  {progress}%
                                </span>

                              </div>

                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                                <div
                                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${progress}%`,
                                  }}
                                />

                              </div>

                              <div className="grid grid-cols-4 mt-2 text-[10px] sm:text-xs text-slate-400">

                                <span
                                  className={
                                    progress >= 25
                                      ? 'text-green-600 font-semibold'
                                      : ''
                                  }
                                >
                                  Requested
                                </span>

                                <span
                                  className={`text-center ${
                                    progress >= 50
                                      ? 'text-green-600 font-semibold'
                                      : ''
                                  }`}
                                >
                                  Approved
                                </span>

                                <span
                                  className={`text-center ${
                                    progress >= 75
                                      ? 'text-green-600 font-semibold'
                                      : ''
                                  }`}
                                >
                                  Picked Up
                                </span>

                                <span
                                  className={`text-right ${
                                    progress >= 100
                                      ? 'text-green-600 font-semibold'
                                      : ''
                                  }`}
                                >
                                  Delivered
                                </span>

                              </div>

                            </div>

                          )}

                          {/* PENDING ACTIONS */}

                          {request.status === 'pending' && (

                            <div className="flex flex-col sm:flex-row gap-3 mt-5 pt-5 border-t border-slate-100">

                              <button
                                onClick={() =>
                                  updateRequestStatus(
                                    request._id,
                                    'approved'
                                  )
                                }
                                disabled={isUpdating}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-green-700 hover:shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {isUpdating ? (
                                  <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle size={18} />
                                    Approve Request
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() =>
                                  updateRequestStatus(
                                    request._id,
                                    'rejected'
                                  )
                                }
                                disabled={isUpdating}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-red-600 border border-red-200 py-3 px-4 rounded-xl font-bold text-sm hover:bg-red-50 hover:border-red-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                <XCircle size={18} />
                                Reject Request
                              </button>

                            </div>

                          )}

                          {/* APPROVED */}

                          {request.status === 'approved' && (

                            <div className="mt-5 pt-4 border-t border-slate-100">

                              <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                  <CheckCircle size={18} />
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-green-700">
                                    Request approved
                                  </p>

                                  <p className="text-xs text-slate-500 mt-0.5">
                                    Waiting for volunteer pickup.
                                  </p>
                                </div>

                              </div>

                            </div>

                          )}

                          {/* PICKED UP */}

                          {(request.status === 'picked_up' ||
                            request.status === 'pickedup') && (

                            <div className="mt-5 pt-4 border-t border-slate-100">

                              <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                  <Truck size={18} />
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-blue-700">
                                    Food picked up
                                  </p>

                                  <p className="text-xs text-slate-500 mt-0.5">
                                    The donation is on its way.
                                  </p>
                                </div>

                              </div>

                            </div>

                          )}

                          {/* DELIVERED */}

                          {request.status === 'delivered' && (

                            <div className="mt-5 pt-4 border-t border-slate-100">

                              <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                  <CheckCircle size={18} />
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-purple-700">
                                    Donation delivered 🎉
                                  </p>

                                  <p className="text-xs text-slate-500 mt-0.5">
                                    Your food successfully reached
                                    the receiver.
                                  </p>
                                </div>

                              </div>

                            </div>

                          )}

                          {/* REJECTED */}

                          {request.status === 'rejected' && (

                            <div className="mt-5 pt-4 border-t border-slate-100">

                              <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                                  <XCircle size={18} />
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-red-700">
                                    Request rejected
                                  </p>

                                  <p className="text-xs text-slate-500 mt-0.5">
                                    This request was not approved.
                                  </p>
                                </div>

                              </div>

                            </div>

                          )}

                        </article>
                      );
                    })}

                  </div>

                )}

              </div>

            </div>

          </section>

          {/* ===================================================
              SIDEBAR
          =================================================== */}

          <aside className="space-y-6">

            {/* QUICK ACTIONS */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">

              <h2 className="text-lg font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Manage your food donations
              </p>

              <Link
                to="/add-food"
                className="group flex items-center justify-between gap-3 p-4 mt-5 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center">
                    <Plus size={19} />
                  </div>

                  <div>
                    <p className="font-bold text-sm text-slate-800">
                      Donate Food
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Create a new donation
                    </p>
                  </div>

                </div>

                <ArrowRight
                  size={18}
                  className="text-green-500 group-hover:translate-x-1 transition"
                />

              </Link>

              <Link
                to="/food"
                className="group flex items-center justify-between gap-3 p-4 mt-3 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Package size={19} />
                  </div>

                  <div>
                    <p className="font-bold text-sm text-slate-800">
                      Food Listings
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5">
                      View available donations
                    </p>
                  </div>

                </div>

                <ArrowRight
                  size={18}
                  className="text-blue-500 group-hover:translate-x-1 transition"
                />

              </Link>

            </div>

            {/* IMPACT */}

            <div className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">

              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />

              <div className="relative">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                    <UtensilsCrossed size={22} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">
                      Your Impact
                    </h3>

                    <p className="text-green-100 text-xs">
                      Every donation counts.
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">

                  <div className="bg-white/10 border border-white/10 rounded-xl p-4">

                    <p className="text-green-100 text-xs">
                      Donations
                    </p>

                    <p className="text-2xl font-bold mt-2">
                      {totalDonations}
                    </p>

                  </div>

                  <div className="bg-white/10 border border-white/10 rounded-xl p-4">

                    <p className="text-green-100 text-xs">
                      People Served
                    </p>

                    <p className="text-2xl font-bold mt-2">
                      {deliveredPeople}
                    </p>

                  </div>

                  <div className="bg-white/10 border border-white/10 rounded-xl p-4">

                    <p className="text-green-100 text-xs">
                      Delivered
                    </p>

                    <p className="text-2xl font-bold mt-2">
                      {deliveredRequests}
                    </p>

                  </div>

                  <div className="bg-white/10 border border-white/10 rounded-xl p-4">

                    <p className="text-green-100 text-xs">
                      Active
                    </p>

                    <p className="text-2xl font-bold mt-2">
                      {activeDonations}
                    </p>

                  </div>

                </div>

                <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between">

                  <span className="text-green-100 text-sm">
                    Rejected Requests
                  </span>

                  <span className="inline-flex items-center gap-1.5 font-bold text-sm">
                    <XCircle size={15} />
                    {rejectedRequests}
                  </span>

                </div>

              </div>

            </div>

            {/* MOTIVATION */}

            <div className="bg-white rounded-2xl border border-slate-200 p-5">

              <div className="flex gap-3">

                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl shrink-0">
                  💚
                </div>

                <div>
                  <h3 className="font-bold text-slate-800">
                    Keep sharing
                  </h3>

                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    A small donation can become a meaningful
                    meal for someone in need.
                  </p>
                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};

export default DonorDashboard;
