import React from 'react';
import { Link } from 'react-router-dom';

import {
  Heart,
  Utensils,
  Users,
  Truck,
  ArrowRight,
  CheckCircle,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Building2,
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white">

        {/* Decorative circles */}
        <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-white/5"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-emerald-300/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT */}
            <div className="text-center lg:text-left">

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-green-50 mb-6">
                <Leaf size={16} />
                Together Against Food Waste
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight">
                Share Food.
                <br />
                <span className="text-green-200">
                  Spread Hope.
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg lg:text-xl text-green-50 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Turn surplus food into meaningful support.
                SHAREbite connects food donors, NGOs and
                volunteers to help communities in need.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-8">

                <Link
                  to="/add-food"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-green-700 font-bold shadow-xl hover:bg-green-50 hover:-translate-y-0.5 transition-all"
                >
                  <Heart size={19} />

                  Donate Food

                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  to="/food"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold backdrop-blur-sm hover:bg-white/20 transition-all"
                >
                  <Utensils size={18} />
                  Find Food
                </Link>

              </div>

              {/* Trust points */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 mt-8 text-sm text-green-100">

                <div className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  Easy to use
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} />
                  Secure platform
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  Location based
                </div>

              </div>

            </div>

            {/* RIGHT VISUAL */}
            <div className="relative max-w-lg mx-auto lg:max-w-none w-full">

              {/* Main card */}
              <div className="relative bg-white/10 border border-white/15 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-2xl">

                <div className="flex items-center justify-between mb-5">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-green-700 shadow-lg">
                      <Utensils size={23} />
                    </div>

                    <div>
                      <p className="font-bold text-white">
                        Food Donation
                      </p>

                      <p className="text-xs text-green-100">
                        Making every meal count
                      </p>
                    </div>

                  </div>

                  <span className="px-3 py-1.5 rounded-full bg-emerald-400/20 text-emerald-100 text-xs font-bold">
                    Available
                  </span>

                </div>

                {/* Food card */}
                <div className="bg-white rounded-2xl p-5 text-slate-900 shadow-xl">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                        <Leaf size={12} />
                        Veg
                      </div>

                      <h3 className="text-xl font-bold mt-3">
                        Fresh Cooked Meals
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Nutritious food ready for pickup
                      </p>

                    </div>

                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl">
                      🍱
                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5">

                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-400">
                        Quantity
                      </p>

                      <p className="font-bold text-slate-800 mt-1">
                        25 Meals
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-400">
                        People Served
                      </p>

                      <p className="font-bold text-slate-800 mt-1">
                        25 People
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                    <MapPin size={16} className="text-green-600" />
                    Local community pickup
                  </div>

                </div>

                {/* Bottom stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">

                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <Heart
                      size={18}
                      className="mx-auto text-green-200"
                    />

                    <p className="text-lg font-bold mt-1">
                      1
                    </p>

                    <p className="text-[11px] text-green-100">
                      Donation
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <Users
                      size={18}
                      className="mx-auto text-green-200"
                    />

                    <p className="text-lg font-bold mt-1">
                      25
                    </p>

                    <p className="text-[11px] text-green-100">
                      People
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <Truck
                      size={18}
                      className="mx-auto text-green-200"
                    />

                    <p className="text-lg font-bold mt-1">
                      1
                    </p>

                    <p className="text-[11px] text-green-100">
                      Delivery
                    </p>
                  </div>

                </div>

              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-white text-slate-800 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                  <Heart size={19} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Small action
                  </p>

                  <p className="text-sm font-bold">
                    Big impact 💚
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          IMPACT STRIP
      ===================================================== */}
      <section className="bg-white border-b border-slate-100">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            <div className="text-center md:border-r border-slate-100">
              <p className="text-2xl sm:text-3xl font-extrabold text-green-700">
                Reduce
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Food Waste
              </p>
            </div>

            <div className="text-center md:border-r border-slate-100">
              <p className="text-2xl sm:text-3xl font-extrabold text-green-700">
                Connect
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Local Communities
              </p>
            </div>

            <div className="text-center md:border-r border-slate-100">
              <p className="text-2xl sm:text-3xl font-extrabold text-green-700">
                Deliver
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Surplus Food
              </p>
            </div>

            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-green-700">
                Support
              </p>

              <p className="text-sm text-slate-500 mt-1">
                People in Need
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section className="py-16 sm:py-20">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-12">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-bold mb-4">
              <Sparkles size={15} />
              Simple & Meaningful
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How SHAREbite Works
            </h2>

            <p className="text-slate-500 mt-4 leading-relaxed">
              A simple process that turns extra food into
              meaningful community support.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* STEP 1 */}
            <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm p-7 hover:-translate-y-2 hover:shadow-xl transition-all">

              <div className="flex items-center justify-between mb-6">

                <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center">
                  <Users size={25} />
                </div>

                <span className="text-5xl font-black text-slate-100 group-hover:text-green-50 transition">
                  01
                </span>

              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Create an Account
              </h3>

              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                Join SHAREbite as a donor, NGO or volunteer
                and become part of the food-sharing community.
              </p>

            </div>

            {/* STEP 2 */}
            <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm p-7 hover:-translate-y-2 hover:shadow-xl transition-all">

              <div className="flex items-center justify-between mb-6">

                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Utensils size={25} />
                </div>

                <span className="text-5xl font-black text-slate-100 group-hover:text-orange-50 transition">
                  02
                </span>

              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Share or Request Food
              </h3>

              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                Donors can list surplus food while NGOs can
                discover available donations and request them.
              </p>

            </div>

            {/* STEP 3 */}
            <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm p-7 hover:-translate-y-2 hover:shadow-xl transition-all">

              <div className="flex items-center justify-between mb-6">

                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Truck size={25} />
                </div>

                <span className="text-5xl font-black text-slate-100 group-hover:text-blue-50 transition">
                  03
                </span>

              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Connect & Deliver
              </h3>

              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                Once approved, volunteers help coordinate
                pickup and delivery to complete the journey.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          ROLES SECTION
      ===================================================== */}
      <section className="bg-white py-16 sm:py-20 border-y border-slate-100">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-12">

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Everyone Has a Role
            </h2>

            <p className="text-slate-500 mt-4">
              SHAREbite brings different people together to
              make food redistribution easier.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* DONOR */}
            <div className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-7">

              <div className="w-14 h-14 rounded-2xl bg-white text-green-700 flex items-center justify-center shadow-sm">
                <Heart size={26} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-5">
                Donors
              </h3>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Share surplus food instead of letting it go to
                waste and help make it available to communities.
              </p>

              <Link
                to="/add-food"
                className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-green-700 hover:gap-3 transition-all"
              >
                Donate Food
                <ArrowRight size={16} />
              </Link>

            </div>

            {/* NGO */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-7">

              <div className="w-14 h-14 rounded-2xl bg-white text-blue-700 flex items-center justify-center shadow-sm">
                <BuildingIcon />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-5">
                NGOs
              </h3>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Discover food donations, request what your
                community needs and track the delivery process.
              </p>

              <Link
                to="/food"
                className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-blue-700 hover:gap-3 transition-all"
              >
                Find Food
                <ArrowRight size={16} />
              </Link>

            </div>

            {/* VOLUNTEER */}
            <div className="rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-7">

              <div className="w-14 h-14 rounded-2xl bg-white text-orange-600 flex items-center justify-center shadow-sm">
                <Truck size={26} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-5">
                Volunteers
              </h3>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Help move food from donors to NGOs and make
                the final delivery possible.
              </p>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-orange-700 hover:gap-3 transition-all"
              >
                Get Involved
                <ArrowRight size={16} />
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="py-16 sm:py-20 px-4">

        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white p-8 sm:p-12 lg:p-14 text-center shadow-xl">

          <div className="absolute -top-24 -right-20 w-64 h-64 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-white/10"></div>

          <div className="relative">

            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/10 flex items-center justify-center mx-auto mb-5">
              <Heart size={28} />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Your Extra Food Can Make a Difference
            </h2>

            <p className="text-green-50 max-w-2xl mx-auto mt-4 leading-relaxed">
              Start sharing today and help create a community
              where good food reaches people instead of going
              to waste.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

              <Link
                to="/add-food"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-green-700 font-bold hover:bg-green-50 transition shadow-lg"
              >
                <Heart size={18} />
                Donate Food
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-green-900/20 border border-white/20 text-white font-bold hover:bg-green-900/30 transition"
              >
                Join SHAREbite
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

/* Small reusable icon for the NGO card */
const BuildingIcon = () => (
  <Building2 size={26} />
);

export default Home;
