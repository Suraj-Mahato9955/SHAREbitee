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
  RefreshCw
} from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const NGODashboard = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* HERO */}
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

      {/* STATISTICS */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

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

        {/* MAIN CONTENT */}
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

                  <div className="space-y-4">

                    {requests.map(request => (

                      <div
                        key={request._id}
                        className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                      >

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
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold capitalize ${getStatusStyle(
                                request.status
                              )}`}
                            >
                              {getStatusIcon(request.status)}
                              {request.status.replace('_', ' ')}
                            </span>

                          </div>

                        </div>

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

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </div>

          {/* SIDE PANEL */}
          <div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">

              <h2 className="text-xl font-bold text-gray-800">
                Quick Actions
              </h2>

              <p className="text-sm text-gray-500 mt-1 mb-5">
                Manage food requests
              </p>

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

            {/* IMPACT */}
            <div className="mt-6 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-md">

              <div className="text-3xl mb-3">
                ❤️
              </div>

              <h3 className="text-xl font-bold">
                Community Impact
              </h3>

              <p className="text-blue-100 text-sm mt-2">
                Your organization helps connect surplus food
                with people who need it.
              </p>

              <div className="mt-5 pt-4 border-t border-blue-400">

                <div className="flex justify-between text-sm">
                  <span>Rejected Requests</span>

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