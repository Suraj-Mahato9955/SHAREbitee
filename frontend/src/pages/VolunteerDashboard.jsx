import React, { useEffect, useState } from 'react';
import api from '../services/api';

const VolunteerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/request/volunteer');
      setRequests(response.data);
    } catch (error) {
      console.error('VOLUNTEER ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading volunteer requests...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Volunteer Dashboard
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
                {request.foodId?.foodName}
              </h2>

              <p className="text-gray-600">
                <strong>Quantity:</strong>{' '}
                {request.foodId?.quantity}
              </p>

              <p className="text-gray-600">
                <strong>Location:</strong>{' '}
                {request.foodId?.location}
              </p>

              <p className="text-gray-600">
                <strong>Donor:</strong>{' '}
                {request.foodId?.donorId?.name || 'Unknown'}
              </p>

              <p className="text-gray-600">
                <strong>Status:</strong>{' '}
                {request.status}
              </p>

              <button
                className="w-full mt-4 bg-primary text-white py-2 rounded-lg font-semibold"
              >
                Accept Pickup
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;