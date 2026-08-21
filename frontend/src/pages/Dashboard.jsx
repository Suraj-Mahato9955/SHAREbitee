import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    const fetchDonorRequests = async () => {
      if (user && (user.role === 'donor' || user.role === 'admin')) {
        try {
          setLoadingRequests(true);

          const { data } = await api.get('/request/donor');

          setRequests(data);
        } catch (error) {
          console.error('REQUEST ERROR:', error);
          toast.error('Failed to load requests');
        } finally {
          setLoadingRequests(false);
        }
      }
    };

    fetchDonorRequests();
  }, [user]);

  // Approve / Reject request
  const updateRequestStatus = async (requestId, status) => {
    try {
      await api.put('/request/update-status', {
        requestId,
        status
      });

      toast.success(`Request ${status} successfully!`);

      setRequests((prev) =>
        prev.map((request) =>
          request._id === requestId
            ? { ...request, status }
            : request
        )
      );

    } catch (error) {
      console.error('STATUS ERROR:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to update request'
      );
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">

      {/* User Information */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row items-center gap-8 mb-8">

        <div className="w-24 h-24 bg-green-100 text-primary rounded-full flex items-center justify-center text-4xl font-bold uppercase shadow-inner">
          {user.name.charAt(0)}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user.name}!
          </h2>

          <p className="text-gray-600 text-lg mb-1">
            <strong>Email:</strong> {user.email}
          </p>

          <p className="text-gray-600 text-lg">
            <strong>Role:</strong>{' '}
            <span className="capitalize text-primary font-semibold">
              {user.role}
            </span>
          </p>
        </div>

      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Donor Actions */}
        {(user.role === 'donor' || user.role === 'admin') && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">

            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Donor Actions
            </h3>

            <p className="text-gray-600 mb-6">
              Have extra food? Share it with those in need by creating
              a new food listing.
            </p>

            <Link
              to="/add-food"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary transition"
            >
              Donate Food
            </Link>

          </div>
        )}

        {/* NGO Actions */}
        {(user.role === 'ngo' || user.role === 'admin') && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">

            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              NGO Actions
            </h3>

            <p className="text-gray-600 mb-6">
              Browse available food and check your requested food.
            </p>

            <div className="flex gap-4">

              <Link
                to="/food"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary transition"
              >
                Browse Food
              </Link>

              <Link
                to="/my-requests"
                className="inline-block bg-white text-primary border border-primary px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition"
              >
                My Requests
              </Link>

            </div>

          </div>
        )}

      </div>

      {/* Food Requests */}
      {(user.role === 'donor' || user.role === 'admin') && (
        <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">

          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            📋 Food Requests
          </h3>

          {loadingRequests ? (
            <p className="text-gray-500">
              Loading requests...
            </p>
          ) : requests.length === 0 ? (
            <p className="text-gray-500">
              No food requests yet.
            </p>
          ) : (

            <div className="space-y-4">

              {requests.map((request) => (

                <div
                  key={request._id}
                  className="border rounded-lg p-5 bg-gray-50"
                >

                  <h4 className="text-lg font-bold text-gray-800">
                    {request.foodId?.foodName || 'Food'}
                  </h4>

                  <p className="text-gray-600 mt-1">
                    Requested by:{' '}
                    <strong>
                      {request.receiverId?.name || 'NGO'}
                    </strong>
                  </p>

                  <p className="mt-2">
                    Status:{' '}
                    <span className="font-semibold capitalize">
                      {request.status}
                    </span>
                  </p>

                  {/* Approve / Reject */}
                  {request.status === 'pending' && (
                    <div className="flex gap-3 mt-4">

                      <button
                        onClick={() =>
                          updateRequestStatus(
                            request._id,
                            'approved'
                          )
                        }
                        className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateRequestStatus(
                            request._id,
                            'rejected'
                          )
                        }
                        className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700"
                      >
                        Reject
                      </button>

                    </div>
                  )}

                </div>

              ))}

            </div>

          )}

        </div>
      )}

    </div>
  );
};

export default Dashboard;