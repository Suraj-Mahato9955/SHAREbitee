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
} from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==============================
  // FETCH DONOR REQUESTS
  // ==============================

  const fetchRequests = async () => {
    try {
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

  // ==============================
  // UPDATE REQUEST STATUS
  // ==============================

  const updateRequestStatus = async (requestId, status) => {
    try {
      await api.put('/request/update-status', {
        requestId,
        status,
      });

      toast.success(
        status === 'approved'
          ? 'Request approved successfully!'
          : 'Request rejected'
      );

      fetchRequests();
    } catch (error) {
      console.error('STATUS ERROR:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to update request'
      );
    }
  };

  // ==============================
  // REQUEST STATISTICS
  // ==============================

  const pendingRequests = requests.filter(
    (request) => request.status === 'pending'
  ).length;

  const approvedRequests = requests.filter(
    (request) => request.status === 'approved'
  ).length;

  const deliveredRequests = requests.filter(
    (request) => request.status === 'delivered'
  ).length;

  const rejectedRequests = requests.filter(
    (request) => request.status === 'rejected'
  ).length;

  // ==============================
  // IMPACT STATISTICS
  // ==============================

  const totalDonations = new Set(
    requests
      .map((request) => request.foodId?._id)
      .filter(Boolean)
  ).size;

  const deliveredPeople = requests
    .filter((request) => request.status === 'delivered')
    .reduce(
      (total, request) =>
        total + (Number(request.foodId?.servesPeople) || 0),
      0
    );

  const activeDonations = requests.filter(
    (request) =>
      request.status === 'approved' ||
      request.status === 'picked_up'
  ).length;

  // ==============================
  // STATUS HELPERS
  // ==============================

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
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-50 pb-16">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white">

        {/* Decorative circles */}

        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />

        <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 lg:py-14">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

            {/* Hero text */}

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-green-50 text-sm mb-5 backdrop-blur-sm">
                <Sparkles size={15} />
                Donor Dashboard
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Welcome back, {user?.name}! 👋
              </h1>

              <p className="text-green-50/90 mt-4 text-base sm:text-lg leading-relaxed max-w-xl">
                Every donation helps turn surplus food into meaningful
                support for someone who needs it.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-green-100">

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <TrendingUp size={16} />
                  </div>
                  Making an impact
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                  Helping communities
                </div>

              </div>

            </div>

            {/* Donate button */}

            <Link
              to="/add-food"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-6 py-3.5 rounded-xl font-bold shadow-xl hover:bg-green-50 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
              <Plus size={20} />
              Donate Food
            </Link>

          </div>

        </div>
      </section>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="-mt-6 relative z-10">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Total */}

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/40 hover:-translate-y-1 transition-all duration-200">

              <div className="flex items-start justify-between gap-3">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Requests
                  </p>

                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {requests.length}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    All food requests
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package size={21} />
                </div>

              </div>

            </div>


            {/* Pending */}

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/40 hover:-translate-y-1 transition-all duration-200">

              <div className="flex items-start justify-between gap-3">

                <div>
                  <p className="text-sm text-slate-500">
                    Pending
                  </p>

                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {pendingRequests}
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


            {/* Approved */}

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/40 hover:-translate-y-1 transition-all duration-200">

              <div className="flex items-start justify-between gap-3">

                <div>
                  <p className="text-sm text-slate-500">
                    Approved
                  </p>

                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {approvedRequests}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Awaiting pickup
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <CheckCircle size={21} />
                </div>

              </div>

            </div>


            {/* Delivered */}

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/40 hover:-translate-y-1 transition-all duration-200">

              <div className="flex items-start justify-between gap-3">

                <div>
                  <p className="text-sm text-slate-500">
                    Delivered
                  </p>

                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {deliveredRequests}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Successfully delivered
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Truck size={21} />
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="grid lg:grid-cols-3 gap-6 mt-8">

          {/* ===================================================
              REQUESTS
          =================================================== */}

          <section className="lg:col-span-2">

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Header */}

              <div className="px-5 sm:px-6 py-5 border-b border-slate-100">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-2">

                      <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <Bell size={18} />
                      </div>

                      <h2 className="text-xl font-bold text-slate-800">
                        Food Requests
                      </h2>

                    </div>

                    <p className="text-sm text-slate-500 mt-2">
                      Review and manage requests for your donations.
                    </p>

                  </div>

                  {requests.length > 0 && (
                    <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                      {requests.length} request
                      {requests.length !== 1 ? 's' : ''}
                    </span>
                  )}

                </div>

              </div>


              {/* Content */}

              <div className="p-5 sm:p-6">

                {/* Loading */}

                {loading ? (

                  <div className="py-14 text-center">

                    <div className="w-11 h-11 border-4 border-green-100 border-t-green-600 rounded-full animate-spin mx-auto" />

                    <p className="text-slate-500 mt-4 text-sm">
                      Loading your requests...
                    </p>

                  </div>

                ) : requests.length === 0 ? (

                  /* Empty */

                  <div className="py-14 text-center">

                    <div className="w-20 h-20 mx-auto rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
                      <UtensilsCrossed size={34} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mt-5">
                      No requests yet
                    </h3>

                    <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                      Once an NGO requests one of your food donations,
                      the request will appear here.
                    </p>

                    <Link
                      to="/add-food"
                      className="inline-flex items-center gap-2 mt-6 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                      <Plus size={18} />
                      Create Donation
                    </Link>

                  </div>

                ) : (

                  /* Requests */

                  <div className="space-y-4">

                    {requests.map((request) => (

                      <article
                        key={request._id}
                        className="group rounded-2xl border border-slate-200 p-5 hover:border-green-200 hover:shadow-md transition-all duration-200"
                      >

                        {/* Request top */}

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                          <div className="min-w-0">

                            <div className="flex items-start gap-3">

                              <div className="w-11 h-11 shrink-0 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                <UtensilsCrossed size={20} />
                              </div>

                              <div className="min-w-0">

                                <h3 className="text-base sm:text-lg font-bold text-slate-800 truncate">
                                  {request.foodId?.foodName ||
                                    'Food Donation'}
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                  Requested by{' '}
                                  <span className="font-semibold text-slate-700">
                                    {request.receiverId?.name || 'NGO'}
                                  </span>
                                </p>

                              </div>

                            </div>

                          </div>


                          {/* Status */}

                          <span
                            className={`inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full border text-xs font-bold capitalize ${getStatusStyle(
                              request.status
                            )}`}
                          >
                            {getStatusIcon(request.status)}
                            {request.status.replace('_', ' ')}
                          </span>

                        </div>


                        {/* Details */}

                        <div className="grid sm:grid-cols-2 gap-3 mt-5">

                          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">

                            <Package
                              size={17}
                              className="text-slate-500 shrink-0"
                            />

                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
                                Quantity
                              </p>

                              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                                {request.foodId?.quantity || 'N/A'}
                              </p>
                            </div>

                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">

                            <MapPin
                              size={17}
                              className="text-slate-500 shrink-0"
                            />

                            <div>
                              <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
                                Donation Location
                              </p>

                              <p className="text-sm font-semibold text-slate-700 mt-0.5 truncate">
                                {request.foodId?.location || 'N/A'}
                              </p>
                            </div>

                          </div>

                        </div>


                        {/* Actions */}

                        {request.status === 'pending' && (

                          <div className="flex flex-col sm:flex-row gap-3 mt-5 pt-5 border-t border-slate-100">

                            <button
                              onClick={() =>
                                updateRequestStatus(
                                  request._id,
                                  'approved'
                                )
                              }
                              className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-green-700 hover:shadow-md transition-all"
                            >
                              <CheckCircle size={18} />
                              Approve Request
                            </button>

                            <button
                              onClick={() =>
                                updateRequestStatus(
                                  request._id,
                                  'rejected'
                                )
                              }
                              className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-red-600 border border-red-200 py-2.5 px-4 rounded-xl font-semibold hover:bg-red-50 transition-all"
                            >
                              <XCircle size={18} />
                              Reject
                            </button>

                          </div>

                        )}


                        {/* Approved */}

                        {request.status === 'approved' && (

                          <div className="mt-5 pt-4 border-t border-slate-100">

                            <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">

                              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                                <CheckCircle size={16} />
                              </div>

                              Approved — waiting for volunteer pickup

                            </div>

                          </div>

                        )}


                        {/* Picked up */}

                        {request.status === 'picked_up' && (

                          <div className="mt-5 pt-4 border-t border-slate-100">

                            <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold">

                              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Truck size={16} />
                              </div>

                              Food has been picked up and is on the way

                            </div>

                          </div>

                        )}


                        {/* Delivered */}

                        {request.status === 'delivered' && (

                          <div className="mt-5 pt-4 border-t border-slate-100">

                            <div className="flex items-center gap-2 text-purple-700 text-sm font-semibold">

                              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                                <CheckCircle size={16} />
                              </div>

                              Food successfully delivered 🎉

                            </div>

                          </div>

                        )}

                      </article>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </section>


          {/* ===================================================
              SIDEBAR
          =================================================== */}

          <aside>

            {/* Quick Actions */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-bold text-slate-800">
                    Quick Actions
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Manage your donations
                  </p>

                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <ArrowRight size={18} />
                </div>

              </div>


              {/* Donate */}

              <Link
                to="/add-food"
                className="group flex items-center justify-between gap-3 p-4 mt-5 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 hover:border-green-200 transition-all"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-sm">
                    <Plus size={19} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-800 text-sm">
                      Donate Food
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Create a new donation
                    </p>
                  </div>

                </div>

                <ArrowRight
                  size={18}
                  className="text-green-500 group-hover:translate-x-1 transition-transform"
                />

              </Link>


              {/* Food listings */}

              <Link
                to="/food"
                className="group flex items-center justify-between gap-3 p-4 mt-3 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <Package size={19} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-800 text-sm">
                      Food Listings
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5">
                      View available food
                    </p>
                  </div>

                </div>

                <ArrowRight
                  size={18}
                  className="text-blue-500 group-hover:translate-x-1 transition-transform"
                />

              </Link>

            </div>


            {/* =================================================
                IMPACT
            ================================================= */}

            <div className="relative overflow-hidden mt-6 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">

              {/* Decorative */}

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

                    <p className="text-green-100 text-xs mt-0.5">
                      Every donation counts.
                    </p>

                  </div>

                </div>


                {/* Stats */}

                <div className="grid grid-cols-2 gap-3 mt-6">

                  <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm">

                    <div className="flex items-center justify-between">

                      <p className="text-green-100 text-xs">
                        Donations
                      </p>

                      <Package size={15} className="text-green-100" />

                    </div>

                    <p className="text-2xl font-bold mt-2">
                      {totalDonations}
                    </p>

                  </div>


                  <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm">

                    <div className="flex items-center justify-between">

                      <p className="text-green-100 text-xs">
                        People Served
                      </p>

                      <Users size={15} className="text-green-100" />

                    </div>

                    <p className="text-2xl font-bold mt-2">
                      {deliveredPeople}
                    </p>

                  </div>


                  <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm">

                    <div className="flex items-center justify-between">

                      <p className="text-green-100 text-xs">
                        Delivered
                      </p>

                      <CheckCircle size={15} className="text-green-100" />

                    </div>

                    <p className="text-2xl font-bold mt-2">
                      {deliveredRequests}
                    </p>

                  </div>


                  <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm">

                    <div className="flex items-center justify-between">

                      <p className="text-green-100 text-xs">
                        Active
                      </p>

                      <Truck size={15} className="text-green-100" />

                    </div>

                    <p className="text-2xl font-bold mt-2">
                      {activeDonations}
                    </p>

                  </div>

                </div>


                {/* Rejected */}

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

          </aside>

        </div>

      </main>

    </div>
  );
};

export default DonorDashboard;
