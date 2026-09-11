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
  UtensilsCrossed
} from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/request/donor');
      setRequests(data);
    } catch (error) {
      console.error('DONOR REQUEST ERROR:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const updateRequestStatus = async (requestId, status) => {
    try {
      await api.put('/request/update-status', {
        requestId,
        status
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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* HERO */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

            <div>
              <p className="text-green-100 mb-2">
                Donor Dashboard
              </p>

              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome back, {user?.name}! 👋
              </h1>

              <p className="text-green-100 mt-2 max-w-xl">
                Your food donation can make someone's day better.
                Keep making a difference with SHAREbite.
              </p>
            </div>

            <Link
              to="/add-food"
              className="flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-green-50 transition"
            >
              <Plus size={20} />
              Donate Food
            </Link>

          </div>

        </div>
      </div>


      <div className="max-w-7xl mx-auto px-6 -mt-6">

        {/* STATISTICS */}
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
                <Truck size={22} />
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
                    Food Requests
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Manage requests for your donations
                  </p>
                </div>

                <div className="bg-green-100 text-green-700 p-3 rounded-xl">
                  <Bell size={20} />
                </div>

              </div>


              <div className="p-6">

                {loading ? (

                  <div className="text-center py-10">
                    <div className="animate-spin w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full mx-auto"></div>

                    <p className="text-gray-500 mt-3">
                      Loading requests...
                    </p>
                  </div>

                ) : requests.length === 0 ? (

                  <div className="text-center py-12">

                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                      <UtensilsCrossed size={34} />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-700 mt-4">
                      No requests yet
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      Requests for your food donations will appear here.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-4">

                    {requests.map(request => (

                      <div
                        key={request._id}
                        className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                      >

                        <div className="flex flex-col md:flex-row justify-between gap-4">

                          <div>

                            <h3 className="text-lg font-bold text-gray-800">
                              🍚 {request.foodId?.foodName || 'Food Donation'}
                            </h3>

                            <p className="text-gray-500 text-sm mt-1">
                              Requested by{' '}
                              <span className="font-semibold text-gray-700">
                                {request.receiverId?.name || 'NGO'}
                              </span>
                            </p>

                            <p className="text-gray-500 text-sm mt-1">
                              Quantity: {request.foodId?.quantity || 'N/A'}
                            </p>

                          </div>


                          <div>

                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                                request.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : request.status === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : request.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : request.status === 'picked_up'
                                  ? 'bg-blue-100 text-blue-700'
                                  : request.status === 'delivered'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {request.status.replace('_', ' ')}
                            </span>

                          </div>

                        </div>


                        {/* ACTIONS */}

                        {request.status === 'pending' && (

                          <div className="flex gap-3 mt-5 pt-4 border-t">

                            <button
                              onClick={() =>
                                updateRequestStatus(
                                  request._id,
                                  'approved'
                                )
                              }
                              className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition"
                            >
                              <span className="flex items-center justify-center gap-2">
                                <CheckCircle size={18} />
                                Approve
                              </span>
                            </button>


                            <button
                              onClick={() =>
                                updateRequestStatus(
                                  request._id,
                                  'rejected'
                                )
                              }
                              className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-lg font-semibold hover:bg-red-100 transition"
                            >
                              <span className="flex items-center justify-center gap-2">
                                <XCircle size={18} />
                                Reject
                              </span>
                            </button>

                          </div>

                        )}


                        {request.status === 'approved' && (

                          <div className="mt-4 pt-4 border-t">

                            <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                              <CheckCircle size={18} />
                              Approved — waiting for volunteer pickup
                            </div>

                          </div>

                        )}


                        {request.status === 'picked_up' && (

                          <div className="mt-4 pt-4 border-t">

                            <div className="flex items-center gap-2 text-blue-700 text-sm font-medium">
                              <Truck size={18} />
                              Food has been picked up
                            </div>

                          </div>

                        )}


                        {request.status === 'delivered' && (

                          <div className="mt-4 pt-4 border-t">

                            <div className="flex items-center gap-2 text-purple-700 text-sm font-medium">
                              <CheckCircle size={18} />
                              Food successfully delivered
                            </div>

                          </div>

                        )}

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">

              <h2 className="text-xl font-bold text-gray-800">
                Quick Actions
              </h2>

              <p className="text-sm text-gray-500 mt-1 mb-5">
                Manage your donations
              </p>


              <Link
                to="/add-food"
                className="flex items-center justify-between p-4 rounded-xl bg-green-50 hover:bg-green-100 transition group"
              >

                <div className="flex items-center gap-3">

                  <div className="bg-green-600 text-white p-2.5 rounded-lg">
                    <Plus size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      Donate Food
                    </p>

                    <p className="text-xs text-gray-500">
                      Create a new donation
                    </p>
                  </div>

                </div>

                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-green-600 transition"
                />

              </Link>


              <Link
                to="/food"
                className="flex items-center justify-between p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition group mt-3"
              >

                <div className="flex items-center gap-3">

                  <div className="bg-blue-600 text-white p-2.5 rounded-lg">
                    <Package size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      Food Listings
                    </p>

                    <p className="text-xs text-gray-500">
                      View all donations
                    </p>
                  </div>

                </div>

                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-blue-600 transition"
                />

              </Link>

            </div>


            {/* IMPACT CARD */}

            <div className="mt-6 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl p-6 text-white shadow-md">

              <div className="text-3xl mb-3">
                ❤️
              </div>

              <h3 className="text-xl font-bold">
                Your Impact
              </h3>

              <p className="text-green-100 text-sm mt-2">
                Every donation helps reduce food waste and
                supports people who need a meal.
              </p>

              <div className="mt-5 pt-4 border-t border-green-400">

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

export default DonorDashboard;
