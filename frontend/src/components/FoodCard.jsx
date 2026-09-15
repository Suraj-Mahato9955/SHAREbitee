import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const FoodCard = ({ food, onRequest, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const { user } = useContext(AuthContext);

  const isDonor =
    user &&
    food.donorId &&
    (user._id === food.donorId._id ||
      user._id === food.donorId);

  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expiry = new Date(food.expiryTime).getTime();
      const now = new Date().getTime();

      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const totalMinutes = Math.floor(
        difference / (1000 * 60)
      );

      const days = Math.floor(
        totalMinutes / (60 * 24)
      );

      const hours = Math.floor(
        (totalMinutes % (60 * 24)) / 60
      );

      const minutes = totalMinutes % 60;

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTimeLeft();

    const timer = setInterval(
      calculateTimeLeft,
      60000
    );

    return () => clearInterval(timer);
  }, [food.expiryTime]);

  const isExpired = timeLeft === 'Expired';

  const getStatusStyle = () => {
    switch (food.status) {
      case 'requested':
        return 'bg-blue-50 text-blue-700 border-blue-100';

      case 'accepted':
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';

      case 'pickedup':
      case 'picked_up':
        return 'bg-purple-50 text-purple-700 border-purple-100';

      case 'delivered':
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-100';

      case 'expired':
        return 'bg-red-50 text-red-700 border-red-100';

      default:
        return 'bg-green-50 text-green-700 border-green-100';
    }
  };

  const getPriorityStyle = () => {
    switch (food.priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-100';

      case 'medium':
        return 'bg-orange-50 text-orange-700 border-orange-100';

      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">

      {/* CARD TOP */}
      <div className="relative">

        {/* FOOD IMAGE / PLACEHOLDER */}
        {food.image ? (
          <div className="h-44 overflow-hidden bg-slate-100">
            <img
              src={food.image}
              alt={food.foodName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="h-44 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex items-center justify-center">

            <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
              🍱
            </div>

          </div>
        )}

        {/* CATEGORY BADGE */}
        {food.foodCategory && (
          <div className="absolute top-3 left-3">

            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-sm capitalize">
              🍽️ {food.foodCategory}
            </span>

          </div>
        )}

        {/* EXPIRY BADGE */}
        <div className="absolute top-3 right-3">

          <span
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
              isExpired
                ? 'bg-red-500 text-white'
                : 'bg-white/95 backdrop-blur text-orange-600'
            }`}
          >
            {isExpired ? '🔴 Expired' : `⏰ ${timeLeft}`}
          </span>

        </div>

      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-grow">

        {/* FOOD NAME */}
        <div className="mb-3">

          <h3 className="text-xl font-bold text-slate-900 capitalize line-clamp-1">
            {food.foodName}
          </h3>

          <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-[2.5rem]">
            {food.description ||
              'A food donation shared by a generous member of the community.'}
          </p>

        </div>

        {/* QUICK INFO */}
        <div className="grid grid-cols-2 gap-2 mb-4">

          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1">
              Quantity
            </p>

            <p className="font-bold text-slate-800 text-sm truncate">
              📦 {food.quantity}
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-xs text-green-600 mb-1">
              Serves
            </p>

            <p className="font-bold text-green-700 text-sm">
              👥 {food.servesPeople || 0} people
            </p>
          </div>

        </div>

        {/* DETAILS */}
        <div className="space-y-3 mb-4">

          {/* LOCATION */}
          <div className="flex items-start gap-3">

            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              📍
            </div>

            <div className="min-w-0">
              <p className="text-xs text-slate-400">
                Pickup Location
              </p>

              <p className="text-sm font-semibold text-slate-700 truncate">
                {food.location}
              </p>
            </div>

          </div>

          {/* DONOR */}
          {food.donorId?.name && (
            <div className="flex items-center gap-3">

              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                👤
              </div>

              <div className="min-w-0">

                <p className="text-xs text-slate-400">
                  Donated by
                </p>

                <p className="text-sm font-semibold text-slate-700 truncate">
                  {food.donorId.name}
                </p>

              </div>

            </div>
          )}

        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mt-auto">

          {/* FOOD TYPE */}
          {food.foodType && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${
                food.foodType === 'veg'
                  ? 'bg-green-50 text-green-700 border-green-100'
                  : 'bg-red-50 text-red-700 border-red-100'
              }`}
            >
              {food.foodType === 'veg'
                ? '🟢 Veg'
                : '🔴 Non-Veg'}
            </span>
          )}

          {/* STATUS */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusStyle()}`}
          >
            ● {food.status || 'available'}
          </span>

          {/* PRIORITY */}
          {food.priority && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${getPriorityStyle()}`}
            >
              ⚡ {food.priority}
            </span>
          )}

        </div>

      </div>

      {/* ACTION AREA */}
      <div className="px-5 py-4 bg-slate-50/70 border-t border-slate-100">

        {user ? (
          <div className="flex gap-2">

            {/* REQUEST */}
            {!isDonor && user.role !== 'admin' && (
              <button
                onClick={() => onRequest(food._id)}
                disabled={isExpired}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                  isExpired
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-green-600 text-white shadow-md shadow-green-600/20 hover:bg-green-700 hover:-translate-y-0.5'
                }`}
              >
                {isExpired
                  ? 'Food Expired'
                  : 'Request Food →'}
              </button>
            )}

            {/* DELETE */}
            {(isDonor || isAdmin) && onDelete && (
              <button
                onClick={() => onDelete(food._id)}
                className={`${
                  isDonor && user.role !== 'admin'
                    ? 'flex-1'
                    : 'w-full'
                } py-3 rounded-xl font-bold text-sm bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all`}
              >
                🗑️ Delete Post
              </button>
            )}

          </div>
        ) : (

          <div className="text-center">

            <p className="text-sm text-slate-500">
              🔐 Please log in to request this donation.
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default FoodCard;
