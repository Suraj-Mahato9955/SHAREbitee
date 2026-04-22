import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const FoodCard = ({ food, onRequest, onDelete }) => {
  const { user } = useContext(AuthContext);

  const isDonor = user && food.donorId && (user._id === food.donorId._id || user._id === food.donorId);
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition duration-300 border border-gray-100">
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{food.foodName}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">{food.description || 'No description provided'}</p>
        
        <div className="mt-auto space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <p className="flex justify-between"><span className="font-semibold text-gray-700">Quantity:</span> <span>{food.quantity}</span></p>
          <p className="flex justify-between"><span className="font-semibold text-gray-700">Location:</span> <span className="text-right">{food.location}</span></p>
          <p className="flex justify-between"><span className="font-semibold text-gray-700">Expiry:</span> <span>{new Date(food.expiryTime).toLocaleString()}</span></p>
          {food.donorId && food.donorId.name && (
            <p className="flex justify-between"><span className="font-semibold text-gray-700">Donor:</span> <span>{food.donorId.name}</span></p>
          )}
        </div>
      </div>
      
      <div className="px-5 py-4 bg-white border-t flex gap-2">
        {user ? (
          <>
            {!isDonor && user.role !== 'admin' && (
               <button 
                 onClick={() => onRequest(food._id)} 
                 className="flex-1 bg-primary text-white py-2 rounded hover:bg-secondary transition font-semibold shadow-sm"
               >
                 Request Food
               </button>
            )}
            
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
          <p className="text-sm text-center w-full text-gray-500 italic">Log in to request</p>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
