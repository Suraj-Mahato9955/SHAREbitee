import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const AddFood = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    foodType: '',
    foodCategory: '',
    location: '',
    latitude: '',
    longitude: '',
    expiryTime: '',
    description: '',
    image: '',
    servesPeople: ''
  });

  if (!user || (user.role !== 'donor' && user.role !== 'admin')) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          const address =
            data.display_name || 'Current location';

          setFormData((prev) => ({
            ...prev,
            location: address,
            latitude,
            longitude
          }));

          toast.success('Current location detected! 📍');

        } catch (error) {
          console.error('ADDRESS ERROR:', error);

          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude
          }));

          toast.warning(
            'Coordinates detected, but address could not be found.'
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error('LOCATION ERROR:', error);

        setLocationLoading(false);

        toast.error(
          'Unable to get your location. Please allow location access.'
        );
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      toast.error('Please select your current location 📍');
      return;
    }

    try {
      setLoading(true);

      await api.post('/food/add', formData);

      toast.success('Food listed successfully!');

      navigate('/food');

    } catch (error) {
      console.log('FOOD ERROR:', error);
      console.log('SERVER RESPONSE:', error.response?.data);

      toast.error(
        error.response?.data?.message ||
        'Failed to add food'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

      <div className="max-w-5xl mx-auto">

        {/* PAGE HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white p-7 sm:p-10 mb-8 shadow-lg">

          <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/10"></div>

          <div className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-white/10"></div>

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-sm mb-4">
              <span>🍱</span>
              <span>Make a Difference</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Donate Food
            </h1>

            <p className="mt-3 text-green-50 max-w-2xl leading-relaxed">
              Share surplus food with people and communities
              who need it. Every donation can make a difference.
            </p>

          </div>

        </div>

        {/* MAIN FORM */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

          {/* FORM HEADER */}
          <div className="px-6 sm:px-8 lg:px-10 py-6 border-b border-slate-100">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">
                🥗
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Food Donation Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Tell us about the food you would like to donate.
                </p>
              </div>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 lg:p-10"
          >

            {/* BASIC INFORMATION */}
            <div className="mb-10">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  1
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Basic Information
                  </h3>

                  <p className="text-xs text-slate-400">
                    What food are you donating?
                  </p>
                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                {/* FOOD NAME */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Food Name
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      🍛
                    </span>

                    <input
                      type="text"
                      name="foodName"
                      value={formData.foodName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Biryani"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition"
                    />

                  </div>
                </div>

                {/* QUANTITY */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Quantity
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      📦
                    </span>

                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 25 plates"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition"
                    />

                  </div>
                </div>

              </div>

            </div>

            {/* FOOD TYPE & CATEGORY */}
            <div className="mb-10">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  2
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Food Classification
                  </h3>

                  <p className="text-xs text-slate-400">
                    Help receivers understand the donation.
                  </p>
                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                {/* FOOD TYPE */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Food Type
                  </label>

                  <select
                    name="foodType"
                    value={formData.foodType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition cursor-pointer"
                  >
                    <option value="">
                      Select Food Type
                    </option>

                    <option value="veg">
                      🟢 Veg
                    </option>

                    <option value="non-veg">
                      🔴 Non-Veg
                    </option>

                  </select>

                </div>

                {/* CATEGORY */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Food Category
                  </label>

                  <select
                    name="foodCategory"
                    value={formData.foodCategory}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition cursor-pointer"
                  >
                    <option value="">
                      Select Category
                    </option>

                    <option value="cooked">
                      🍛 Cooked Food
                    </option>

                    <option value="packed">
                      📦 Packed Food
                    </option>

                    <option value="fruits">
                      🍎 Fruits
                    </option>

                    <option value="vegetables">
                      🥦 Vegetables
                    </option>

                    <option value="bakery">
                      🥐 Bakery
                    </option>

                  </select>

                </div>

              </div>

            </div>

            {/* LOCATION */}
            <div className="mb-10">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  3
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Pickup Location
                  </h3>

                  <p className="text-xs text-slate-400">
                    Where can the food be collected?
                  </p>
                </div>

              </div>

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Location / Address
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-4 text-lg">
                    📍
                  </span>

                  <textarea
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="Enter pickup address"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition resize-none"
                  />

                </div>

                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className="mt-3 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-50 text-green-700 border border-green-100 font-semibold hover:bg-green-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {locationLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-green-300 border-t-green-700 rounded-full animate-spin"></span>
                      Detecting location...
                    </>
                  ) : (
                    <>
                      📍 Use My Current Location
                    </>
                  )}
                </button>

                {formData.latitude && formData.longitude && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-xs font-semibold">
                    ✓ Location coordinates captured
                  </div>
                )}

              </div>

            </div>

            {/* EXPIRY & SERVES */}
            <div className="mb-10">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  4
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Availability
                  </h3>

                  <p className="text-xs text-slate-400">
                    Let people know how long the food is available.
                  </p>
                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                {/* EXPIRY */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Expiry Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    name="expiryTime"
                    value={formData.expiryTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition"
                  />

                </div>

                {/* SERVES */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Number of People Served
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      👥
                    </span>

                    <input
                      type="number"
                      name="servesPeople"
                      min="1"
                      value={formData.servesPeople}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 25"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="mb-10">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  5
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Additional Details
                  </h3>

                  <p className="text-xs text-slate-400">
                    Add anything important about the donation.
                  </p>
                </div>

              </div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add details such as ingredients, preparation time, dietary information, packaging, etc."
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition resize-none"
              />

            </div>

            {/* INFO BOX */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-8">

              <div className="flex gap-3">

                <div className="text-2xl">
                  💚
                </div>

                <div>

                  <h4 className="font-bold text-green-800">
                    Thank you for donating!
                  </h4>

                  <p className="text-sm text-green-700 mt-1 leading-relaxed">
                    Please make sure the food is safe to consume
                    and the pickup information is accurate before
                    posting your donation.
                  </p>

                </div>

              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold shadow-lg shadow-green-600/20 hover:from-green-700 hover:to-emerald-600 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    Posting Donation...
                  </span>
                ) : (
                  '🍱 Post Food Donation →'
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/food')}
                className="sm:w-40 py-4 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default AddFood;
