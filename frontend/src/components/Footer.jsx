import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} FoodShare Platform. All rights reserved.</p>
        <p className="text-sm mt-2">Connecting food donors with those in need to reduce food waste.</p>
      </div>
    </footer>
  );
};

export default Footer;
