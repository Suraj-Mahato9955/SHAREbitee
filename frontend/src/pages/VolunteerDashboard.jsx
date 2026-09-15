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
  Users,
  BarChart3,
  Sparkles,
} from 'lucide-react';

const VolunteerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleViewLocation = (latitude, longitude) => {
    if (!latitude || !longitude) {
      toast.error(
        'Pickup location coordinates are not available'
      );
      return;
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    window.open(googleMapsUrl, '_blank');
  };

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

  const peopleServed = requests
    .filter((request) => request.status === 'delivered')
    .reduce(
      (total, request) =>
        total +
        (Number(request.foodId?.servesPeople) || 0),
      0
    );

  const pickupsCompleted =
    pickedUpRequests + deliveredRequests;

  const activeDeliveries =
    assignedRequests + pickedUpRequests;

  const getStatusInfo = (status, volunteerId) => {
    if (status === 'approved' && !volunteerId) {
      return {
        text: 'Available',
        className:
          'bg-amber-50 text-amber-700 border-amber-200',
        icon: <Clock size={14} />,
      };
    }

    if (status === 'approved' && volunteerId) {
      return {
        text: 'Assigned',
        className:
          'bg-blue-50 text-blue-700 border-blue-200',
        icon: <Truck size={14} />,
      };
    }

    if (status === 'picked_up') {
      return {
        text: 'Picked Up',
        className:
          'bg-orange-50 text-orange-700 border-orange-200',
        icon: <Package size={14} />,
      };
    }

    if (status === 'delivered') {
      return {
        text: 'Delivered',
        className:
          'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <CheckCircle size={14} />,
      };
    }

    if (status === 'rejected') {
      return {
        text: 'Rejected',
        className:
          'bg-red-50 text-red-700 border-red-200',
        icon: <XCircle size={14} />,
      };
    }

    return {
      text: status?.replace('_', ' ') || 'Unknown',
      className:
        'bg-gray-50 text-gray-700 border-gray-200',
      icon: <Clock size={14} />,
    };
  };

  const getProgress = (status) => {
    if (status === 'approved') return 33;
    if (status === 'picked_up') return 66;
    if (status === 'delivered') return 100;
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-slate-600 font-semibold">
            Loading volunteer dashboard...
          </p>

          <p className="text-sm text-slate-400 mt-1">
            Preparing your delivery requests
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white">

        <div className="absolute -top-24 -right-20 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-sm px-3 py-2 rounded-full mb-5">
                <Truck size={17} />
                <span className="text-sm font-semibold">
                  Volunteer Dashboard
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Make Every Delivery Count 🚚
              </h1>

              <p className="mt-4 text-blue-100 text-base sm:text-lg leading-relaxed max-w-2xl">
                Help move surplus food from donors to people
                who need it. Every pickup and delivery brings
                us one step closer to reducing food waste.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">

                <div className="flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2 rounded-full text-sm">
                  <HeartHandshake size={16} />
                  Community Impact
                </div>

                <div className="flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2 rounded-full text-sm">
                  <Package size={16} />
                  Food Recovery
                </div>

              </div>

            </div>

            <button
              onClick={() => fetchRequests(true)}
              disabled={refreshing}
              className="self-start lg:self-center inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-5 py-3.5 rounded-xl font-bold shadow-xl hover:bg-blue-50 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <RefreshCw
                size={18}
                className={refreshing ? 'animate-spin' : ''}
              />

              {refreshing ? 'Refreshing...' : 'Refresh Requests'}
            </button>

          </div>

        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= STATS ================= */}
        <section className="-mt-7 relative z-10 mb-12">

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

            {[
              {
                label: 'TOTAL',
                value: totalRequests,
                text: 'Food Requests',
                icon: <Truck size={21} />,
                iconClass: 'bg-blue-50 text-blue-600',
              },
              {
                label: 'AVAILABLE',
                value: availableRequests,
                text: 'Need Pickup',
                icon: <Clock size={21} />,
                iconClass: 'bg-amber-50 text-amber-600',
              },
              {
                label: 'ASSIGNED',
                value: assignedRequests,
                text: 'Your Pickups',
                icon: <Navigation size={21} />,
                iconClass: 'bg-indigo-50 text-indigo-600',
              },
              {
                label: 'PICKED UP',
                value: pickedUpRequests,
                text: 'In Transit',
                icon: <Package size={21} />,
                iconClass: 'bg-orange-50 text-orange-600',
              },
              {
                label: 'DELIVERED',
                value: deliveredRequests,
                text: 'Completed',
                icon: <CheckCircle size={21} />,
                iconClass: 'bg-emerald-50 text-emerald-600',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >

                <div className="flex items-center justify-between">

                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconClass}`}
                  >
                    {stat.icon}
                  </div>

                  <span className="text-[10px] tracking-wider font-bold text-slate-400">
                    {stat.label}
                  </span>

                </div>

                <p className="text-3xl font-extrabold text-slate-800 mt-4">
                  {stat.value}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  {stat.text}
                </p>

              </div>
            ))}

          </div>

        </section>

        {/* ================= IMPACT ================= */}
        <section className="mb-12">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">

            <div>

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <BarChart3 size={19} />
                </div>

                <h2 className="text-2xl font-extrabold text-slate-800">
                  Your Impact
                </h2>
              </div>

              <p className="text-slate-500 text-sm mt-2">
                See how your volunteer work is helping the community.
              </p>

            </div>

            <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
              <HeartHandshake
                size={17}
                className="text-blue-600"
              />
              Making a difference together
            </div>

          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-5 shadow-lg">

              <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-white/10" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <CheckCircle size={23} />
                  </div>

                  <span className="text-[10px] font-bold tracking-wider text-green-100">
                    COMPLETED
                  </span>
                </div>

                <p className="text-3xl font-extrabold mt-5">
                  {deliveredRequests}
                </p>

                <p className="text-green-100 text-sm mt-1">
                  Deliveries Completed
                </p>
              </div>

            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl p-5 shadow-lg">

              <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-white/10" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Users size={23} />
                  </div>

                  <span className="text-[10px] font-bold tracking-wider text-blue-100">
                    IMPACT
                  </span>
                </div>

                <p className="text-3xl font-extrabold mt-5">
                  {peopleServed}
                </p>

                <p className="text-blue-100 text-sm mt-1">
                  People Served
                </p>
              </div>

            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl p-5 shadow-lg">

              <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-white/10" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Package size={23} />
                  </div>

                  <span className="text-[10px] font-bold tracking-wider text-orange-100">
                    PICKUPS
                  </span>
                </div>

                <p className="text-3xl font-extrabold mt-5">
                  {pickupsCompleted}
                </p>

                <p className="text-orange-100 text-sm mt-1">
                  Pickups Completed
                </p>
              </div>

            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl p-5 shadow-lg">

              <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-white/10" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Truck size={23} />
                  </div>

                  <span className="text-[10px] font-bold tracking-wider text-purple-100">
                    ACTIVE
                  </span>
                </div>

                <p className="text-3xl font-extrabold mt-5">
                  {activeDeliveries}
                </p>

                <p className="text-purple-100 text-sm mt-1">
                  Active Deliveries
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* ================= REQUEST HEADER ================= */}
        <section className="mb-6">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-slate-800">
                  Delivery Requests
                </h2>

                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {requests.length}
                </span>
              </div>

              <p className="text-slate-500 text-sm mt-1.5">
                Manage pickups and deliveries assigned to you.
              </p>
            </div>

            {activeDeliveries > 0 && (
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl">
                <Navigation size={16} />
                {activeDeliveries} active delivery
                {activeDeliveries !== 1 ? 'ies' : ''}
              </div>
            )}

          </div>

        </section>

        {/* ================= EMPTY STATE ================= */}
        {requests.length === 0 ? (

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 sm:p-14 text-center">

            <div className="relative w-24 h-24 mx-auto">

              <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse" />

              <div className="relative w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border-8 border-white shadow-sm">
                <Truck size={38} />
              </div>

            </div>

            <h3 className="text-2xl font-extrabold text-slate-800 mt-6">
              No delivery requests yet
            </h3>

            <p className="text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              There are currently no approved food requests
              waiting for volunteer pickup.
            </p>

            <button
              onClick={() => fetchRequests(true)}
              disabled={refreshing}
              className="mt-7 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-70"
            >
              <RefreshCw
                size={18}
                className={refreshing ? 'animate-spin' : ''}
              />
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

              const progress = getProgress(request.status);

              return (
                <article
                  key={request._id}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >

                  {/* CARD TOP */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-12 h-12 flex-shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                          <Package size={23} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-extrabold text-slate-800 text-lg truncate">
                            {request.foodId?.foodName ||
                              'Food Donation'}
                          </h3>

                          <p className="text-sm text-slate-500 mt-0.5">
                            {request.foodId?.quantity ||
                              'Quantity not available'}
                          </p>
                        </div>

                      </div>

                      <span
                        className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold border ${statusInfo.className}`}
                      >
                        {statusInfo.icon}
                        {statusInfo.text}
                      </span>

                    </div>

                    {/* PROGRESS */}
                    {progress > 0 && (
                      <div className="mt-5">

                        <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                          <span>Delivery Progress</span>
                          <span>{progress}%</span>
                        </div>

                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                      </div>
                    )}

                    {/* DETAILS */}
                    <div className="mt-5 space-y-4">

                      <div className="flex items-start gap-3">

                        <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center">
                          <MapPin size={17} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                            Pickup Location
                          </p>

                          <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">
                            {request.foodId?.location ||
                              'Location unavailable'}
                          </p>
                        </div>

                      </div>

                      <div className="flex items-start gap-3">

                        <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center">
                          <User size={17} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                            Donor
                          </p>

                          <p className="text-sm text-slate-700 mt-0.5">
                            {request.foodId?.donorId?.name ||
                              'Unknown Donor'}
                          </p>

                          {request.foodId?.donorId?.email && (
                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                              {request.foodId.donorId.email}
                            </p>
                          )}
                        </div>

                      </div>

                      <div className="flex items-start gap-3">

                        <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center">
                          <Building2 size={17} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                            Receiver / NGO
                          </p>

                          <p className="text-sm text-slate-700 mt-0.5">
                            {request.receiverId?.name ||
                              'Unknown Receiver'}
                          </p>

                          {request.receiverId?.email && (
                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                              {request.receiverId.email}
                            </p>
                          )}
                        </div>

                      </div>

                    </div>

                    {/* MAP */}
                    {request.foodId?.latitude &&
                      request.foodId?.longitude && (
                        <button
                          onClick={() =>
                            handleViewLocation(
                              request.foodId.latitude,
                              request.foodId.longitude
                            )
                          }
                          className="w-full mt-5 flex items-center justify-center gap-2 border border-blue-200 text-blue-700 bg-blue-50 py-2.5 rounded-xl font-bold hover:bg-blue-100 hover:border-blue-300 transition-all"
                        >
                          <MapPin size={17} />
                          View Pickup Location
                          <ArrowRight
                            size={15}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </button>
                      )}

                  </div>

                  {/* ACTION AREA */}
                  <div className="bg-slate-50 border-t border-slate-100 p-5">

                    {request.status === 'approved' &&
                      !request.volunteerId && (
                        <button
                          onClick={() =>
                            handleAcceptPickup(request._id)
                          }
                          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-sm"
                        >
                          <Truck size={19} />
                          Accept Pickup
                          <ArrowRight size={17} />
                        </button>
                      )}

                    {request.status === 'approved' &&
                      request.volunteerId && (
                        <button
                          onClick={() =>
                            handlePickup(request._id)
                          }
                          className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 hover:-translate-y-0.5 transition-all shadow-sm"
                        >
                          <Package size={19} />
                          Mark as Picked Up
                          <ArrowRight size={17} />
                        </button>
                      )}

                    {request.status === 'picked_up' &&
                      request.volunteerId && (
                        <button
                          onClick={() =>
                            handleDeliver(request._id)
                          }
                          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 hover:-translate-y-0.5 transition-all shadow-sm"
                        >
                          <CheckCircle size={19} />
                          Mark as Delivered
                          <ArrowRight size={17} />
                        </button>
                      )}

                    {request.status === 'delivered' && (
                      <div className="flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 py-3 rounded-xl font-bold">
                        <CheckCircle size={19} />
                        Delivery Completed
                      </div>
                    )}

                    {request.status === 'rejected' && (
                      <div className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold">
                        <XCircle size={18} />
                        Request Rejected
                      </div>
                    )}

                  </div>

                </article>
              );
            })}

          </div>
        )}

        {/* ================= IMPACT BANNER ================= */}
        {requests.length > 0 && (
          <section className="mt-12 relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 rounded-3xl p-6 md:p-8 text-white shadow-xl">

            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full" />
            <div className="absolute -left-16 -bottom-24 w-52 h-52 bg-white/10 rounded-full" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div className="flex items-start gap-4">

                <div className="flex-shrink-0 bg-white/15 border border-white/10 p-3.5 rounded-2xl">
                  <HeartHandshake size={29} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl md:text-2xl font-extrabold">
                      Your work creates real impact
                    </h3>

                    <Sparkles
                      size={19}
                      className="text-cyan-200"
                    />
                  </div>

                  <p className="text-blue-100 mt-2 max-w-2xl leading-relaxed">
                    Every successful pickup and delivery helps
                    reduce food waste and supports someone in need.
                  </p>
                </div>

              </div>

              <div className="md:text-right md:min-w-[150px]">

                <p className="text-4xl font-extrabold">
                  {deliveredRequests}
                </p>

                <p className="text-blue-100 text-sm mt-1">
                  Successful Deliveries
                </p>

              </div>

            </div>

          </section>
        )}

      </main>
    </div>
  );
};

export default VolunteerDashboard;
