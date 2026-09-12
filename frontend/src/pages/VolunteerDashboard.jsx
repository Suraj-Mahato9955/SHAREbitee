import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

import {
  Truck,
  Package,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Building2,
  RefreshCw,
  ArrowRight,
  Navigation,
  HeartHandshake,
  XCircle,
} from 'lucide-react';

const VolunteerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =========================
  // FETCH REQUESTS
  // =========================
  const fetchRequests = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get('/request/volunteer');

      setRequests(response.data);
    } catch (error) {
      console.error('VOLUNTEER ERROR:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to load volunteer requests'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // =========================
  // ACCEPT PICKUP
  // =========================
  const handleAcceptPickup = async (requestId) => {
    try {
      await api.put('/request/assign', { requestId });

      toast.success('Pickup accepted successfully! 🚚');

      fetchRequests();
    } catch (error) {
      console.error('ASSIGN ERROR:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to accept pickup'
      );
    }
  };

  // =========================
  // MARK PICKED UP
  // =========================
  const handlePickup = async (requestId) => {
    try {
      await api.put('/request/pickup', { requestId });

      toast.success('Food marked as picked up! 📦');

      fetchRequests();
    } catch (error) {
      console.error('PICKUP ERROR:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to mark as picked up'
      );
    }
  };

  // =========================
  // MARK DELIVERED
  // =========================
  const handleDeliver = async (requestId) => {
    try {
      await api.put('/request/deliver', { requestId });

      toast.success('Food delivered successfully! 🎉');

      fetchRequests();
    } catch (error) {
      console.error('DELIVERY ERROR:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to mark as delivered'
      );
    }
  };

  // =========================
  // GOOGLE MAPS
  // =========================
  const handleViewLocation = (latitude, longitude) => {
    if (!latitude || !longitude) {
      toast.error(
        'Pickup location coordinates are not available'
      );
      return;
    }

    const googleMapsUrl =
      `https://www.google.com/maps?q=${latitude},${longitude}`;

    window.open(googleMapsUrl, '_blank');
  };

  // =========================
  // STATS
  // =========================
  const totalRequests = requests.length;

  const availableRequests = requests.filter(
    (request) =>
      request.status === 'approved' &&
      !request.volunteerId
  ).length;

  const assignedRequests = requests.filter(
    (request) =>
      request.status === 'approved' &&
      request.volunteerId
  ).length;

  const pickedUpRequests = requests.filter(
    (request) => request.status === 'picked_up'
  ).length;

  const deliveredRequests = requests.filter(
    (request) => request.status === 'delivered'
  ).length;

  // =========================
  // STATUS HELPER
  // =========================
  const getStatusInfo = (status, volunteerId) => {
    if (status === 'approved' && !volunteerId) {
      return {
        text: 'Available',
        className:
          'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: <Clock size={14} />,
      };
    }

    if (status === 'approved' && volunteerId) {
      return {
        text: 'Assigned',
        className:
          'bg-blue-100 text-blue-700 border-blue-200',
        icon: <Truck size={14} />,
      };
    }

    if (status === 'picked_up') {
      return {
        text: 'Picked Up',
        className:
          'bg-orange-100 text-orange-700 border-orange-200',
        icon: <Package size={14} />,
      };
    }

    if (status === 'delivered') {
      return {
        text: 'Delivered',
        className:
          'bg-green-100 text-green-700 border-green-200',
        icon: <CheckCircle size={14} />,
      };
    }

    if (status === 'rejected') {
      return {
        text: 'Rejected',
        className:
          'bg-red-100 text-red-700 border-red-200',
        icon: <XCircle size={14} />,
      };
    }

    return {
      text: status?.replace('_', ' ') || 'Unknown',
      className:
        'bg-gray-100 text-gray-700 border-gray-200',
      icon: <Clock size={14} />,
    };
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-5 text-gray-600 font-medium">
            Loading volunteer dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Truck size={22} />
                </div>

                <span className="text-blue-100 font-medium">
                  Volunteer Panel
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">
                Make Every Delivery Count 🚚
              </h1>

              <p className="mt-3 text-blue-100 max-w-2xl">
                Help move surplus food from donors to people
                who need it. Your contribution can make a real
                difference.
              </p>
            </div>

            <button
              onClick={() => fetchRequests(true)}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-50 transition disabled:opacity-70"
            >
              <RefreshCw
                size={18}
                className={refreshing ? 'animate-spin' : ''}
              />

              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>

          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

          {/* Total */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                <Truck size={22} />
              </div>

              <span className="text-xs font-medium text-gray-400">
                TOTAL
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              {totalRequests}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Food Requests
            </p>
          </div>

          {/* Available */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl">
                <Clock size={22} />
              </div>

              <span className="text-xs font-medium text-gray-400">
                AVAILABLE
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              {availableRequests}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Need Pickup
            </p>
          </div>

          {/* Assigned */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                <Navigation size={22} />
              </div>

              <span className="text-xs font-medium text-gray-400">
                ASSIGNED
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              {assignedRequests}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Your Pickups
            </p>
          </div>

          {/* Picked Up */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                <Package size={22} />
              </div>

              <span className="text-xs font-medium text-gray-400">
                PICKED UP
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              {pickedUpRequests}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              In Transit
            </p>
          </div>

          {/* Delivered */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                <CheckCircle size={22} />
              </div>

              <span className="text-xs font-medium text-gray-400">
                DELIVERED
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              {deliveredRequests}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Completed
            </p>
          </div>

        </div>

        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Delivery Requests
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Manage pickups and deliveries assigned to you.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <HeartHandshake size={18} className="text-blue-600" />
            Making an impact together
          </div>

        </div>

        {/* ================= EMPTY STATE ================= */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Truck size={38} />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mt-5">
              No delivery requests yet
            </h3>

            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              There are currently no approved food requests
              waiting for volunteer pickup.
            </p>

            <button
              onClick={() => fetchRequests(true)}
              className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              <RefreshCw size={18} />
              Check Again
            </button>

          </div>
        ) : (

          /* ================= REQUEST GRID ================= */
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {requests.map((request) => {

              const statusInfo = getStatusInfo(
                request.status,
                request.volunteerId
              );

              return (
                <div
                  key={request._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 overflow-hidden"
                >

                  {/* CARD TOP */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-center gap-3">

                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                          <Package size={24} />
                        </div>

                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {request.foodId?.foodName ||
                              'Food Donation'}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {request.foodId?.quantity ||
                              'Quantity not available'}
                          </p>
                        </div>

                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusInfo.className}`}
                      >
                        {statusInfo.icon}
                        {statusInfo.text}
                      </span>

                    </div>

                    {/* FOOD DETAILS */}
                    <div className="mt-5 space-y-3">

                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <div className="text-gray-400 mt-0.5">
                          <MapPin size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 uppercase font-semibold">
                            Pickup Location
                          </p>

                          <p className="text-sm text-gray-700 mt-0.5">
                            {request.foodId?.location ||
                              'Location unavailable'}
                          </p>
                        </div>
                      </div>

                      {/* Donor */}
                      <div className="flex items-start gap-3">
                        <div className="text-gray-400 mt-0.5">
                          <User size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 uppercase font-semibold">
                            Donor
                          </p>

                          <p className="text-sm text-gray-700 mt-0.5">
                            {request.foodId?.donorId?.name ||
                              'Unknown Donor'}
                          </p>

                          {request.foodId?.donorId?.email && (
                            <p className="text-xs text-gray-400">
                              {request.foodId.donorId.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Receiver */}
                      <div className="flex items-start gap-3">
                        <div className="text-gray-400 mt-0.5">
                          <Building2 size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 uppercase font-semibold">
                            Receiver / NGO
                          </p>

                          <p className="text-sm text-gray-700 mt-0.5">
                            {request.receiverId?.name ||
                              'Unknown Receiver'}
                          </p>

                          {request.receiverId?.email && (
                            <p className="text-xs text-gray-400">
                              {request.receiverId.email}
                            </p>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* MAP BUTTON */}
                    {request.foodId?.latitude &&
                      request.foodId?.longitude && (
                        <button
                          onClick={() =>
                            handleViewLocation(
                              request.foodId.latitude,
                              request.foodId.longitude
                            )
                          }
                          className="w-full mt-5 flex items-center justify-center gap-2 border border-blue-200 text-blue-600 bg-blue-50 py-2.5 rounded-xl font-semibold hover:bg-blue-100 transition"
                        >
                          <MapPin size={18} />
                          View Pickup Location
                          <ArrowRight size={16} />
                        </button>
                      )}

                  </div>

                  {/* ================= ACTION AREA ================= */}
                  <div className="bg-gray-50 border-t border-gray-100 p-5">

                    {/* AVAILABLE */}
                    {request.status === 'approved' &&
                      !request.volunteerId && (
                        <button
                          onClick={() =>
                            handleAcceptPickup(request._id)
                          }
                          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm"
                        >
                          <Truck size={19} />
                          Accept Pickup
                          <ArrowRight size={17} />
                        </button>
                      )}

                    {/* ASSIGNED */}
                    {request.status === 'approved' &&
                      request.volunteerId && (
                        <button
                          onClick={() =>
                            handlePickup(request._id)
                          }
                          className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition shadow-sm"
                        >
                          <Package size={19} />
                          Mark as Picked Up
                          <ArrowRight size={17} />
                        </button>
                      )}

                    {/* PICKED UP */}
                    {request.status === 'picked_up' &&
                      request.volunteerId && (
                        <button
                          onClick={() =>
                            handleDeliver(request._id)
                          }
                          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-sm"
                        >
                          <CheckCircle size={19} />
                          Mark as Delivered
                          <ArrowRight size={17} />
                        </button>
                      )}

                    {/* DELIVERED */}
                    {request.status === 'delivered' && (
                      <div className="flex items-center justify-center gap-2 bg-green-100 text-green-700 py-3 rounded-xl font-semibold">
                        <CheckCircle size={19} />
                        Delivery Completed
                      </div>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* ================= IMPACT BANNER ================= */}
        {requests.length > 0 && (
          <div className="mt-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 md:p-8 text-white">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div className="flex items-start gap-4">

                <div className="bg-white/20 p-3 rounded-xl">
                  <HeartHandshake size={28} />
                </div>

                <div>
                  <h3 className="text-xl font-bold">
                    Your work creates real impact ❤️
                  </h3>

                  <p className="text-blue-100 mt-1 max-w-2xl">
                    Every successful pickup and delivery helps
                    reduce food waste and supports someone in need.
                  </p>
                </div>

              </div>

              <div className="text-left md:text-right">
                <p className="text-3xl font-bold">
                  {deliveredRequests}
                </p>

                <p className="text-blue-100 text-sm">
                  Successful Deliveries
                </p>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default VolunteerDashboard;
