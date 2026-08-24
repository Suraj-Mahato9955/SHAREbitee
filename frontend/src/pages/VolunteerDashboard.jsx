import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const VolunteerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/request/volunteer');
      setRequests(response.data);
    } catch (error) {
      console.error('VOLUNTEER ERROR:', error);
      toast.error(
        error.response?.data?.message || 'Failed to load requests'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Accept pickup
  const handleAcceptPickup = async (requestId) => {
    try {
      await api.put('/request/assign', { requestId });

      toast.success('Pickup accepted successfully!');

      fetchRequests();
    } catch (error) {
      console.error('ASSIGN ERROR:', error);

      toast.error(
        error.response?.data?.message || 'Failed to accept pickup'
      );
    }
  };

  // Mark picked up
  const handlePickup = async (requestId) => {
    try {
      await api.put('/request/pickup', { requestId });

      toast.success('Food marked as picked up!');

      fetchRequests();
    } catch (error) {
      console.error('PICKUP ERROR:', error);

      toast.error(
        error.response?.data?.message || 'Failed to mark as picked up'
      );
    }
  };

  // Mark delivered
  const handleDeliver = async (requestId) => {
    try {
      await api.put('/request/deliver', { requestId });

      toast.success('Food delivered successfully!');

      fetchRequests();
    } catch (error) {
      console.error('DELIVERY ERROR:', error);

      toast.error(
        error.response?.data?.message || 'Failed to mark as delivered'
      );
    }
  };
  const handleViewLocation = (latitude, longitude) => {
    if (!latitude || !longitude) {
      toast.error('Pickup location coordinates are not available');
      return;
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    window.open(googleMapsUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-xl">
        Loading volunteer requests...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 pb-10">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🚚 Volunteer Dashboard
      </h1>

      {requests.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">
            No approved food requests available.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {requests.map((request) => (

            <div
              key={request._id}
              className="bg-white rounded-lg shadow-md p-5 border"
            >

              <h2 className="text-xl font-bold text-gray-800 mb-3">
                🍚 {request.foodId?.foodName}
              </h2>

              <p className="text-gray-600">
                <strong>Quantity:</strong>{' '}
                {request.foodId?.quantity}
              </p>

              <p className="text-gray-600">
                <strong>Location:</strong>{' '}
                {request.foodId?.location}
              </p>
              {request.foodId?.latitude && request.foodId?.longitude && (
                <button
                  onClick={() =>
                    handleViewLocation(
                      request.foodId.latitude,
                      request.foodId.longitude
                    )
                  }
                  className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  🗺️ View Pickup Location
                </button>
              )}

              <p className="text-gray-600">
                <strong>Donor:</strong>{' '}
                {request.foodId?.donorId?.name || 'Unknown'}
              </p>

              <p className="text-gray-600">
                <strong>Receiver:</strong>{' '}
                {request.receiverId?.name || 'Unknown'}
              </p>

              <p className="mt-3">
                <strong>Status:</strong>{' '}
                <span className="font-semibold capitalize">
                  {request.status.replace('_', ' ')}
                </span>
              </p>

              {/* Approved - Nobody assigned */}
              {request.status === 'approved' &&
                !request.volunteerId && (
                  <button
                    onClick={() =>
                      handleAcceptPickup(request._id)
                    }
                    className="w-full mt-4 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-secondary transition"
                  >
                    🚚 Accept Pickup
                  </button>
                )}

              {/* Assigned to this volunteer */}
              {request.status === 'approved' &&
                request.volunteerId && (
                  <button
                    onClick={() =>
                      handlePickup(request._id)
                    }
                    className="w-full mt-4 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                  >
                    📦 Mark as Picked Up
                  </button>
                )}

              {/* Picked up */}
              {request.status === 'picked_up' &&
                request.volunteerId && (
                  <button
                    onClick={() =>
                      handleDeliver(request._id)
                    }
                    className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    🏢 Mark as Delivered
                  </button>
                )}

              {/* Delivered */}
              {request.status === 'delivered' && (
                <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg text-center font-semibold">
                  ✅ Food Delivered Successfully
                </div>
              )}

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default VolunteerDashboard;