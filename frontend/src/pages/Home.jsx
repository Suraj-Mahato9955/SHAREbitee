
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full bg-green-50 rounded-2xl p-8 md:p-16 mb-12 text-center shadow-sm">
        <h1 className="text-4xl md:text-6xl font-extrabold text-green-800 mb-6 leading-tight">
          Share Food, <br/>Spread Hope
        </h1>
        <p className="text-lg md:text-xl text-green-700 max-w-2xl mx-auto mb-10">
          Join our mission to reduce food waste and help those in need. Easily donate extra food or find meals near you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/add-food" className="bg-primary text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-secondary transition shadow-md hover:shadow-lg">
            Donate Food
          </Link>
          <Link to="/food" className="bg-white text-primary border border-primary px-8 py-3 rounded-full text-lg font-bold hover:bg-green-50 transition shadow-sm hover:shadow-md">
            Request Food
          </Link>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-green-100 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5 shadow-inner">1</div>
            <h3 className="text-xl font-bold mb-3">Sign Up</h3>
            <p className="text-gray-600">Create an account as a donor or a receiver to get started on our platform.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-green-100 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5 shadow-inner">2</div>
            <h3 className="text-xl font-bold mb-3">Post or Browse</h3>
            <p className="text-gray-600">Donors can list their available food. Receivers can browse and request meals.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-green-100 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5 shadow-inner">3</div>
            <h3 className="text-xl font-bold mb-3">Connect</h3>
            <p className="text-gray-600">Once a request is approved, you can connect to arrange the pickup and share food.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
