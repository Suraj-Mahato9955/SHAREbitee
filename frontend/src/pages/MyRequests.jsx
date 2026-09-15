import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyRequests = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // ACCESS CONTROL
  // =========================================================

  if (!user || (user.role !== 'ngo' && user.role !== 'admin')) {
    return <Navigate to="/dashboard" />;
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
          icon: '✓',
          className:
            'bg-emerald-50 text-emerald-700 border-emerald-100',
        };

      case 'picked_up':
      case 'pickedup':
        return {
          label: 'Picked Up',
          icon: '🚚',
          className:
            'bg-purple-50 text-purple-700 border-purple-100',
        };

      case 'delivered':
        return {
          label: 'Delivered',
          icon: '✓',
          className:
            'bg-green-50 text-green-700 border-green-100',
        };

      case 'rejected':
        return {
          label: 'Rejected',
          icon: '✕',
          className:
            'bg-red-50 text-red-700 border-red-100',
        };

      case 'pending':
      default:
        return {
          label: 'Pending',
          icon: '⏳',
          className:
            'bg-amber-50 text-amber-700 border-amber-100',
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

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) => request.status === 'pending'
  ).length;

  const approvedRequests = requests.filter(
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

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">

          <div className="animate-pulse">

            <div className="h-10 bg-slate-200 rounded-lg w-72 mb-3"></div>

            <div className="h-5 bg-slate-200 rounded w-96 max-w-full mb-8"></div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl border border-slate-100 p-5"
                >
                  <div className="w-11 h-11 bg-slate-200 rounded-xl mb-4"></div>
                  <div className="h-7 bg-slate-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-28"></div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6">
              <div className="h-7 bg-slate-200 rounded w-52 mb-6"></div>

              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-40 bg-slate-100 rounded-2xl"
                  ></div>
                ))}
              </div>
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
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            HERO
        ====================================================== */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white p-7 sm:p-10 mb-8 shadow-lg">

          <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/10"></div>

          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-white/10"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-sm mb-4">
                <span>📋</span>
                <span>Request Management</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                My Food
                <span className="text-green-100">
                  {' '}Requests
                </span>
              </h1>

              <p className="mt-4 text-green-50 text-sm sm:text-base leading-relaxed max-w-xl">
                Track all the food donations you have requested,
                monitor their progress and stay updated until
                delivery.
              </p>

            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 min-w-[190px]">

              <p className="text-green-100 text-sm">
                Total Requests
              </p>

              <p className="text-4xl font-bold mt-1">
                {totalRequests}
              </p>

              <p className="text-green-100 text-xs mt-1">
                Community food requests
              </p>

            </div>

          </div>
        </div>

        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          {/* Total */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-1 transition-all">

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl mb-4">
              📋
            </div>

            <p className="text-2xl font-bold text-slate-900">
              {totalRequests}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Total Requests
            </p>

          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-1 transition-all">

            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-xl mb-4">
              ⏳
            </div>

            <p className="text-2xl font-bold text-slate-900">
              {pendingRequests}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Pending
            </p>

          </div>

          {/* Active */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-1 transition-all">

            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-xl mb-4">
              🚚
            </div>

            <p className="text-2xl font-bold text-slate-900">
              {approvedRequests}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Active Requests
            </p>

          </div>

          {/* Delivered */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-1 transition-all">

            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl mb-4">
              ❤️
            </div>

            <p className="text-2xl font-bold text-slate-900">
              {deliveredRequests}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Delivered
            </p>

          </div>

        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        {requests.length === 0 ? (

          /* EMPTY STATE */

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-6 py-16">

            <div className="w-24 h-24 mx-auto rounded-3xl bg-green-50 flex items-center justify-center text-5xl mb-6">
              🍱
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              No requests yet
            </h2>

            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              You haven't requested any food donations yet.
              Explore available food and request a donation
              when you find something your organization needs.
            </p>

          </div>

        ) : (

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

            {/* SECTION HEADER */}

            <div className="px-6 sm:px-8 py-6 border-b border-slate-100">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Request History
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Track the status of your food requests.
                  </p>
                </div>

                <div className="text-sm text-slate-500">
                  {rejectedRequests > 0 && (
                    <span className="text-red-500 font-semibold">
                      {rejectedRequests} rejected
                    </span>
                  )}
                </div>

              </div>

            </div>

            {/* REQUEST LIST */}

            <div className="p-4 sm:p-6 space-y-4">

              {requests.map((req) => {

                const statusInfo = getStatusInfo(req.status);
                const progress = getProgress(req.status);

                return (
                  <div
                    key={req._id}
                    className="group border border-slate-100 rounded-2xl p-5 hover:border-green-200 hover:shadow-md transition-all duration-300"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-start gap-5">

                      {/* FOOD ICON */}

                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-3xl shrink-0">
                        🍱
                      </div>

                      {/* MAIN INFORMATION */}

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                          <div>

                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                              {req.foodId?.foodName || 'Item Deleted'}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                              Requested on{' '}
                              <span className="font-medium text-slate-700">
                                {new Date(
                                  req.createdAt
                                ).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </p>

                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold w-fit ${statusInfo.className}`}
                          >
                            <span>{statusInfo.icon}</span>
                            {statusInfo.label}
                          </span>

                        </div>

                        {/* DETAILS */}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">

                          <div className="bg-slate-50 rounded-xl p-3">

                            <p className="text-xs text-slate-400 mb-1">
                              Quantity
                            </p>

                            <p className="text-sm font-bold text-slate-700">
                              📦 {req.foodId?.quantity || 'N/A'}
                            </p>

                          </div>

                          <div className="bg-slate-50 rounded-xl p-3">

                            <p className="text-xs text-slate-400 mb-1">
                              Pickup Location
                            </p>

                            <p className="text-sm font-bold text-slate-700 truncate">
                              📍 {req.foodId?.location || 'N/A'}
                            </p>

                          </div>

                          <div className="bg-slate-50 rounded-xl p-3">

                            <p className="text-xs text-slate-400 mb-1">
                              People Served
                            </p>

                            <p className="text-sm font-bold text-slate-700">
                              👥 {req.foodId?.servesPeople || 0}
                            </p>

                          </div>

                        </div>

                        {/* PROGRESS */}

                        {req.status !== 'rejected' && (

                          <div className="mt-5">

                            <div className="flex items-center justify-between mb-2">

                              <p className="text-xs font-semibold text-slate-500">
                                Delivery Progress
                              </p>

                              <p className="text-xs font-bold text-green-600">
                                {progress}%
                              </p>

                            </div>

                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                                style={{
                                  width: `${progress}%`
                                }}
                              ></div>

                            </div>

                            <div className="flex justify-between mt-2 text-[11px] text-slate-400">

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
                                className={
                                  progress >= 50
                                    ? 'text-green-600 font-semibold'
                                    : ''
                                }
                              >
                                Approved
                              </span>

                              <span
                                className={
                                  progress >= 75
                                    ? 'text-green-600 font-semibold'
                                    : ''
                                }
                              >
                                Picked Up
                              </span>

                              <span
                                className={
                                  progress >= 100
                                    ? 'text-green-600 font-semibold'
                                    : ''
                                }
                              >
                                Delivered
                              </span>

                            </div>

                          </div>

                        )}

                        {/* REJECTED MESSAGE */}

                        {req.status === 'rejected' && (

                          <div className="mt-5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">

                            <p className="text-sm text-red-700 font-medium">
                              This food request was rejected by the donor.
                            </p>

                          </div>

                        )}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        )}

        {/* =====================================================
            IMPACT BANNER
        ====================================================== */}

        {requests.length > 0 && (

          <div className="mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 to-emerald-500 text-white p-7 sm:p-8">

            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💚</span>

                  <h3 className="text-xl font-bold">
                    Your requests create impact
                  </h3>
                </div>

                <p className="text-green-50 text-sm max-w-2xl">
                  Every successful food delivery helps reduce
                  food waste and supports people in need.
                </p>

              </div>

              <div className="flex gap-8">

                <div>
                  <p className="text-3xl font-bold">
                    {deliveredRequests}
                  </p>

                  <p className="text-xs text-green-100">
                    Delivered
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-bold">
                    {requests.reduce(
                      (total, request) =>
                        total +
                        (Number(
                          request.foodId?.servesPeople
                        ) || 0),
                      0
                    )}
                  </p>

                  <p className="text-xs text-green-100">
                    Potential meals
                  </p>
                </div>

              </div>

            </div>

          </div>

        )}

      </div>
    </div>
  );
};

export default MyRequests;
