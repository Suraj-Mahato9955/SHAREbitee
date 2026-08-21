import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const FoodCard = ({ food, onRequest, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const { user } = useContext(AuthContext);

  const isDonor =
    user &&
    food.donorId &&
    (user._id === food.donorId._id || user._id === food.donorId);

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

const days = Math.floor(totalMinutes / (60 * 24));

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

  const timer = setInterval(calculateTimeLeft, 60000);

  return () => clearInterval(timer);
}, [food.expiryTime]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition duration-300 border border-gray-100">

      {/* Food Information */}
      <div className="p-5 flex flex-col flex-grow">

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {food.foodName}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">
          {food.description || 'No description provided'}
        </p>


        {/* Food Details */}
        <div className="mt-auto space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">

          {/* Quantity */}
          <p className="flex justify-between">
            <span className="font-semibold text-gray-700">
              Quantity:
            </span>

            <span>{food.quantity}</span>
          </p>


          {/* Food Type */}
          {food.foodType && (
            <p className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Food Type:
              </span>

              <span className="capitalize">
                {food.foodType}
              </span>
            </p>
          )}


          {/* Food Category */}
          {food.foodCategory && (
            <p className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Category:
              </span>

              <span className="capitalize">
                {food.foodCategory}
              </span>
            </p>
          )}


          {/* People Served */}
          {food.servesPeople && (
            <p className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Serves:
              </span>

              <span>
                {food.servesPeople} people
              </span>
            </p>
          )}


          {/* Location */}
          <p className="flex justify-between">
            <span className="font-semibold text-gray-700">
              Location:
            </span>

            <span className="text-right">
              {food.location}
            </span>
          </p>


          {/* Expiry */}
          <p className="flex justify-between">
  <span className="font-semibold text-gray-700">
    Expiry:
  </span>

  <span
    className={
      timeLeft === 'Expired'
        ? 'text-red-600 font-semibold'
        : 'text-orange-600 font-semibold'
    }
  >
    {timeLeft === 'Expired'
      ? '🔴 Food Expired'
      : `⏰ ${timeLeft}`}
  </span>
</p>


          {/* Donor */}
          {food.donorId && food.donorId.name && (
            <p className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Donor:
              </span>

              <span>
                {food.donorId.name}
              </span>
            </p>
          )}


          {/* Status & Priority */}
          <div className="mt-3 flex flex-wrap gap-2">

  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
    🟢 {food.status || 'Available'}
  </span>

  {food.priority && (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
      🟡 Priority: {food.priority}
    </span>
  )}

</div>
          

        </div>
      </div>


      {/* Buttons */}
      <div className="px-5 py-4 bg-white border-t flex gap-2">

        {user ? (
          <>

            {/* Request Food */}
            {!isDonor && user.role !== 'admin' && (
              <button
                onClick={() => onRequest(food._id)}
                className="flex-1 bg-primary text-white py-2 rounded hover:bg-secondary transition font-semibold shadow-sm"
              >
                Request Food
              </button>
            )}


            {/* Delete Food */}
            {(isDonor || isAdmin) && onDelete && (
              <button
                onClick={() => onDelete(food._id)}
                className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded hover:bg-red-100 transition font-semibold"
              >
                Delete Post
              </button>
            )}

          </>
        ) : (

          <p className="text-sm text-center w-full text-gray-500 italic">
            Log in to request
          </p>

        )}

      </div>

    </div>
  );
};

export default FoodCard;