import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FoodCard from '../components/FoodCard';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const FoodListings = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [type, setType] = useState('all');

  const fetchFoods = async () => {
    try {
      setLoading(true);

      const { data } = await api.get('/food');
      setFoods(data);
    } catch (error) {
      toast.error('Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleRequest = async (foodId) => {
    try {
      await api.post('/request/create', { foodId });

      toast.success('Food requested successfully!');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Failed to request food'
      );
    }
  };

  const handleDelete = async (foodId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this post?'
      )
    ) {
      try {
        await api.delete(`/food/${foodId}`);

        toast.success('Food post deleted');

        fetchFoods();
      } catch (error) {
        toast.error('Failed to delete food');
      }
    }
  };

  /* FILTER FOODS */
  const filteredFoods = foods.filter((food) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      food.foodName?.toLowerCase().includes(searchText) ||
      food.location?.toLowerCase().includes(searchText) ||
      food.foodCategory?.toLowerCase().includes(searchText);

    const matchesCategory =
      category === 'all' ||
      food.foodCategory?.toLowerCase() === category;

    const matchesType =
      type === 'all' ||
      food.foodType?.toLowerCase() === type;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType
    );
  });

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-12">
        <div className="max-w-7xl mx-auto">

          <div className="animate-pulse">

            <div className="h-10 bg-slate-200 rounded-lg w-72 mb-4"></div>

            <div className="h-5 bg-slate-200 rounded w-96 max-w-full mb-10"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl p-5 border border-slate-100"
                >
                  <div className="h-40 bg-slate-200 rounded-xl mb-5"></div>
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-5"></div>
                  <div className="h-10 bg-slate-200 rounded-lg"></div>
                </div>
              ))}

            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

      <div className="max-w-7xl mx-auto">

        {/* HERO HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white p-7 sm:p-10 mb-8 shadow-lg">

          {/* Decorative circles */}
          <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-white/10"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-sm mb-4">
                <span>🍱</span>
                <span>Community Food Network</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Available Food
                <br className="hidden sm:block" />
                <span className="text-green-100">
                  Donations
                </span>
              </h1>

              <p className="mt-4 text-green-50 text-sm sm:text-base leading-relaxed max-w-xl">
                Discover surplus food shared by generous donors
                and help make sure good food reaches people who
                need it.
              </p>

            </div>

            <Link
              to="/add-food"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-6 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              <span className="text-xl">+</span>
              Donate Food
            </Link>

          </div>

        </div>

        {/* SEARCH + FILTERS */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 mb-8">

          <div className="flex flex-col lg:flex-row gap-4">

            {/* SEARCH */}
            <div className="relative flex-1">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food, category or location..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition"
              />

            </div>

            {/* CATEGORY */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="lg:w-52 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="cooked">Cooked Food</option>
              <option value="packed">Packed Food</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="bakery">Bakery</option>
            </select>

            {/* FOOD TYPE */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="lg:w-44 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
            </select>

          </div>

          {/* RESULT COUNT */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">

            <p className="text-sm text-slate-500">
              Showing{' '}
              <span className="font-bold text-slate-800">
                {filteredFoods.length}
              </span>{' '}
              {filteredFoods.length === 1 ? 'donation' : 'donations'}
            </p>

            {(search || category !== 'all' || type !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                  setType('all');
                }}
                className="text-sm font-semibold text-green-600 hover:text-green-700"
              >
                Clear filters
              </button>
            )}

          </div>

        </div>

        {/* NO FOOD */}
        {foods.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-6 py-16">

            <div className="w-24 h-24 mx-auto rounded-3xl bg-green-50 flex items-center justify-center text-5xl mb-6">
              🍽️
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              No food donations yet
            </h2>

            <p className="text-slate-500 max-w-md mx-auto mb-6">
              There are currently no food listings available.
              Be the first person to share a meal with someone
              in need.
            </p>

            <Link
              to="/add-food"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg shadow-green-600/20"
            >
              🍱 Donate Food
            </Link>

          </div>

        ) : filteredFoods.length === 0 ? (

          /* FILTER EMPTY */
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-6 py-16">

            <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-4xl mb-5">
              🔎
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-2">
              No matching donations
            </h2>

            <p className="text-slate-500 mb-5">
              Try changing your search or filters.
            </p>

            <button
              onClick={() => {
                setSearch('');
                setCategory('all');
                setType('all');
              }}
              className="text-green-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>

          </div>

        ) : (

          /* FOOD GRID */
          <div>

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Fresh opportunities to help
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Choose a donation and make an impact.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Live listings
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

              {filteredFoods.map((food) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  onRequest={handleRequest}
                  onDelete={handleDelete}
                />
              ))}

            </div>

          </div>

        )}

      </div>
    </div>
  );
};

export default FoodListings;
