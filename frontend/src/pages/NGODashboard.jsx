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
  Users
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
  // REQUEST STATISTICS
  // =========================================

  const pendingRequests = requests.filter(
    request => request.status === 'pending'
  ).length;

  const approvedRequests = requests.filter(
    request => request.status === 'approved'
  ).length;

  const deliveredRequests = requests.filter(
    request => request.status === 'delivered'
  ).length;

  const rejectedRequests = requests.filter(
    request => request.status === 'rejected'
  ).length;

  // =========================================
  // IMPACT STATISTICS
  // =========================================

  // Total people served through delivered food
  const peopleServed = requests
    .filter(request => request.status === 'delivered')
    .reduce(
      (total, request) =>
        total + (Number(request.foodId?.servesPeople) || 0),
      0
    );

  // Active deliveries
  const activeDeliveries = requests.filter(
    request =>
      request.status === 'approved' ||
      request.status === 'picked_up'
  ).length;

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'approved':
        return 'bg-green-100 text-green-700';

      case 'rejected':
        return 'bg-red-100 text-red-700';

      case 'picked_up':
        return 'bg-blue-100 text-blue-700';

      case 'delivered':
        return 'bg-purple-100 text-purple-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // =========================================
  // STATUS ICON
  // =========================================

  const getStatusIcon = status => {
    switch (status) {
      case 'pending':
        return <Clock size={17} />;

      case 'approved':
        return <CheckCircle size={17} />;

      case 'rejected':
        return <XCircle size={17} />;

      case 'picked_up':
        return <Truck size={17} />;

      case 'delivered':
        return <CheckCircle size={17} />;

      default:
        return <Package size={17} />;
    }
  };

  /*
    =====================================================
    DELIVERY TRACKING TIMELINE
    =====================================================
  */

  const trackingSteps = [
    {
      key: 'pending',
      label: 'Request Sent',
      description: 'Your food request has been sent to the donor.',
      icon: <Package size={18} />
    },
    {
      key: 'approved',
      label: 'Approved',
      description: 'The donor has approved your request.',
      icon: <CheckCircle size={18} />
    },
    {
      key: 'picked_up',
      label: 'Picked Up',
      description: 'Volunteer has picked up the food.',
      icon: <Truck size={18} />
    },
    {
      key: 'delivered',
      label: 'Delivered',
      description: 'Food has been delivered successfully.',
      icon: <Heart size={18} />
    }
  ];

  const getStepState = (status, stepIndex) => {
    const statusOrder = {
      pending: 0,
      approved: 1,
      picked_up: 2,
      delivered: 3
    };

    const currentIndex = statusOrder[status];

    if (status === 'rejected') {
      return 'inactive';
    }

    if (currentIndex === undefined) {
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

  const renderTrackingTimeline = request => {
    if (request.status === 'rejected') {
      return (
        <div className="mt-5 pt-5 border-t border-gray-200">

          <div className="rounded-xl bg-red-50 border border-red-100 p-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
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
      <div className="mt-5 pt-5 border-t border-gray-200">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h4 className="font-bold text-gray-800">
              Delivery Tracking
            </h4>

            <p className="text-xs text-gray-500 mt-1">
              Track your food request progress
            </p>

          </div>

          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
            Live Status
          </span>

        </div>

        <div className="relative">

          {/* CONNECTING LINE */}

          <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200"></div>

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

                  {/* ICON */}

                  <div
                    className={`
                      relative z-10 w-10 h-10 rounded-full
                      flex items-center justify-center
                      border-4 border-white
                      transition-all duration-300
                      ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-gray-100 text-gray-400'
                      }
                    `}
                  >

                    {isCompleted ? (
                      <CheckCircle size={18} />
                    ) : (
                      step.icon
                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="flex-1 pt-1">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">

                      <p
                        className={`
                          font-semibold
                          ${
                            isCompleted
                              ? 'text-green-700'
                              : isCurrent
                              ? 'text-blue-700'
                              : 'text-gray-400'
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
                        text-xs mt-1
                        ${
                          isCurrent || isCompleted
                            ? 'text-gray-500'
                            : 'text-gray-400'
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
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* =========================================
          HERO
      ========================================= */}

      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

            <div>

              <p className="text-blue-100 mb-2">
                NGO Dashboard
              </p>

              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome back, {user?.name}! 👋
              </h1>

              <p className="text-blue-100 mt-2 max-w-xl">
                Find available food donations and help deliver
                meals to people who need them.
              </p>

            </div>

            <Link
              to="/food"
              className="flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition"
            >
              <Search size={20} />
              Find Food
            </Link>

          </div>

        </div>

      </div>


      {/* =========================================
          STATISTICS
      ========================================= */}

      <div className="max-w-7xl mx-auto px-6 -mt-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* TOTAL */}

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Total Requests
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {requests.length}
                </h2>

              </div>

              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                <Package size={22} />
              </div>

            </div>

          </div>


          {/* PENDING */}

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Pending
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {pendingRequests}
                </h2>

              </div>

              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl">
                <Clock size={22} />
              </div>

            </div>

          </div>


          {/* APPROVED */}

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Approved
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {approvedRequests}
                </h2>

              </div>

              <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                <CheckCircle size={22} />
              </div>

            </div>

          </div>


          {/* DELIVERED */}

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Delivered
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {deliveredRequests}
                </h2>

              </div>

              <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                <Heart size={22} />
              </div>

            </div>

          </div>

        </div>


        {/* =========================================
            MAIN CONTENT
        ========================================= */}

        <div className="grid lg:grid-cols-3 gap-6 mt-8">

          {/* REQUESTS */}

          <div className="lg:col-span-2">

            <div className="bg-white rounded-2xl shadow-md border border-gray-100">

              <div className="p-6 border-b flex justify-between items-center">

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    My Food Requests
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Track all food requests made by your NGO
                  </p>

                </div>

                <button
                  onClick={fetchRequests}
                  className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-100 transition"
                  title="Refresh"
                >
                  <RefreshCw size={20} />
                </button>

              </div>


              <div className="p-6">

                {loading ? (

                  <div className="text-center py-12">

                    <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>

                    <p className="text-gray-500 mt-3">
                      Loading your requests...
                    </p>

                  </div>

                ) : requests.length === 0 ? (

                  <div className="text-center py-12">

                    <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-blue-400">
                      <Utensils size={34} />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-700 mt-4">
                      No food requests yet
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      Browse available food and request donations.
                    </p>

                    <Link
                      to="/food"
                      className="inline-flex items-center gap-2 mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      <Search size={18} />
                      Browse Food
                    </Link>

                  </div>

                ) : (

                  <div className="space-y-5">

                    {requests.map(request => (

                      <div
                        key={request._id}
                        className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                      >

                        {/* REQUEST HEADER */}

                        <div className="flex flex-col md:flex-row justify-between gap-4">

                          <div className="flex-1">

                            <h3 className="text-lg font-bold text-gray-800">
                              🍚 {request.foodId?.foodName || 'Food Donation'}
                            </h3>

                            <div className="grid sm:grid-cols-2 gap-2 mt-3">

                              <p className="text-sm text-gray-500 flex items-center gap-2">
                                <Package size={16} />
                                Quantity: {request.foodId?.quantity || 'N/A'}
                              </p>

                              <p className="text-sm text-gray-500 flex items-center gap-2">
                                <MapPin size={16} />
                                {request.foodId?.location || 'Location unavailable'}
                              </p>

                            </div>

                          </div>

                          <div>

                            <span
                              className={`
                                inline-flex items-center gap-2
                                px-3 py-1.5 rounded-full
                                text-sm font-semibold capitalize
                                ${getStatusStyle(request.status)}
                              `}
                            >

                              {getStatusIcon(request.status)}

                              {request.status.replace('_', ' ')}

                            </span>

                          </div>

                        </div>


                        {/* STATUS MESSAGE */}

                        {request.status === 'pending' && (
                          <div className="mt-4 pt-4 border-t">

                            <p className="text-sm text-yellow-700 font-medium">
                              ⏳ Waiting for the donor to approve your request.
                            </p>

                          </div>
                        )}


                        {request.status === 'approved' && (
                          <div className="mt-4 pt-4 border-t">

                            <p className="text-sm text-green-700 font-medium">
                              ✅ Request approved. A volunteer will pick up the food soon.
                            </p>

                          </div>
                        )}


                        {request.status === 'picked_up' && (
                          <div className="mt-4 pt-4 border-t">

                            <p className="text-sm text-blue-700 font-medium">
                              🚚 Food has been picked up and is on the way.
                            </p>

                          </div>
                        )}


                        {request.status === 'delivered' && (
                          <div className="mt-4 pt-4 border-t">

                            <p className="text-sm text-purple-700 font-medium">
                              ❤️ Food has been successfully delivered.
                            </p>

                          </div>
                        )}


                        {request.status === 'rejected' && (
                          <div className="mt-4 pt-4 border-t">

                            <p className="text-sm text-red-700 font-medium">
                              ❌ This request was rejected by the donor.
                            </p>

                          </div>
                        )}


                        {/* DELIVERY TRACKING */}

                        {renderTrackingTimeline(request)}

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </div>


          {/* =========================================
              SIDE PANEL
          ========================================= */}

          <div>

            {/* QUICK ACTIONS */}

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">

              <h2 className="text-xl font-bold text-gray-800">
                Quick Actions
              </h2>

              <p className="text-sm text-gray-500 mt-1 mb-5">
                Manage food requests
              </p>


              {/* FIND FOOD */}

              <Link
                to="/food"
                className="flex items-center justify-between p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition group"
              >

                <div className="flex items-center gap-3">

                  <div className="bg-blue-600 text-white p-2.5 rounded-lg">
                    <Search size={20} />
                  </div>

                  <div>

                    <p className="font-semibold text-gray-800">
                      Find Food
                    </p>

                    <p className="text-xs text-gray-500">
                      Browse available donations
                    </p>

                  </div>

                </div>

                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-blue-600 transition"
                />

              </Link>


              {/* MY REQUESTS */}

              <Link
                to="/my-requests"
                className="flex items-center justify-between p-4 rounded-xl bg-green-50 hover:bg-green-100 transition group mt-3"
              >

                <div className="flex items-center gap-3">

                  <div className="bg-green-600 text-white p-2.5 rounded-lg">
                    <Package size={20} />
                  </div>

                  <div>

                    <p className="font-semibold text-gray-800">
                      My Requests
                    </p>

                    <p className="text-xs text-gray-500">
                      View request history
                    </p>

                  </div>

                </div>

                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-green-600 transition"
                />

              </Link>

            </div>


            {/* =====================================
                COMMUNITY IMPACT
            ===================================== */}

            <div className="mt-6 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-md">

              {/* HEADER */}

              <div className="flex items-center gap-3">

                <div className="bg-white/20 p-3 rounded-xl">
                  <Heart size={24} />
                </div>

                <div>

                  <h3 className="text-xl font-bold">
                    Community Impact
                  </h3>

                  <p className="text-blue-100 text-sm">
                    Your NGO is making a difference.
                  </p>

                </div>

              </div>


              {/* IMPACT STATS */}

              <div className="grid grid-cols-2 gap-3 mt-6">

                {/* TOTAL REQUESTS */}

                <div className="bg-white/10 rounded-xl p-4">

                  <div className="flex items-center gap-2">

                    <Package size={17} />

                    <p className="text-blue-100 text-xs">
                      Requests
                    </p>

                  </div>

                  <p className="text-2xl font-bold mt-2">
                    {requests.length}
                  </p>

                </div>


                {/* PEOPLE SERVED */}

                <div className="bg-white/10 rounded-xl p-4">

                  <div className="flex items-center gap-2">

                    <Users size={17} />

                    <p className="text-blue-100 text-xs">
                      People Served
                    </p>

                  </div>

                  <p className="text-2xl font-bold mt-2">
                    {peopleServed}
                  </p>

                </div>


                {/* FOOD RECEIVED */}

                <div className="bg-white/10 rounded-xl p-4">

                  <div className="flex items-center gap-2">

                    <Heart size={17} />

                    <p className="text-blue-100 text-xs">
                      Food Received
                    </p>

                  </div>

                  <p className="text-2xl font-bold mt-2">
                    {deliveredRequests}
                  </p>

                </div>


                {/* ACTIVE DELIVERIES */}

                <div className="bg-white/10 rounded-xl p-4">

                  <div className="flex items-center gap-2">

                    <Truck size={17} />

                    <p className="text-blue-100 text-xs">
                      Active
                    </p>

                  </div>

                  <p className="text-2xl font-bold mt-2">
                    {activeDeliveries}
                  </p>

                </div>

              </div>


              {/* REJECTED */}

              <div className="mt-5 pt-4 border-t border-white/20">

                <div className="flex justify-between text-sm">

                  <span className="text-blue-100">
                    Rejected Requests
                  </span>

                  <span className="font-bold">
                    {rejectedRequests}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default NGODashboard;
