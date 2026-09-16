import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Leaf,
  Utensils,
  Users,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-auto">

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* BRAND */}
          <div className="lg:col-span-1">

            <Link
              to="/"
              className="inline-flex items-center gap-3 group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-green-900/20">
                <Leaf size={22} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  SHARE<span className="text-green-400">bite</span>
                </h2>

                <p className="text-[11px] text-slate-500 font-medium">
                  Share food. Spread hope.
                </p>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed mt-5 max-w-sm">
              Connecting food donors, NGOs and volunteers to
              help reduce food waste and make surplus food
              reach communities in need.
            </p>

            <div className="flex items-center gap-2 mt-5 text-sm text-green-400">
              <Heart size={16} fill="currentColor" />
              <span>Making every meal count.</span>
            </div>

          </div>

          {/* QUICK LINKS */}
          <div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Quick Links
            </h3>

            <div className="space-y-3">

              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-green-400 transition-colors"
              >
                Home
              </Link>

              <Link
                to="/food"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-green-400 transition-colors"
              >
                Food Listings
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-green-400 transition-colors"
              >
                Dashboard
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-green-400 transition-colors"
              >
                Join SHAREbite
              </Link>

            </div>

          </div>

          {/* GET INVOLVED */}
          <div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Get Involved
            </h3>

            <div className="space-y-4">

              <Link
                to="/add-food"
                className="group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
                  <Utensils size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-green-400 transition">
                    Donate Food
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Share surplus food
                  </p>
                </div>

                <ArrowUpRight
                  size={14}
                  className="ml-auto text-slate-600 group-hover:text-green-400 transition"
                />
              </Link>

              <Link
                to="/food"
                className="group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Users size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition">
                    Find Food
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Explore available donations
                  </p>
                </div>

                <ArrowUpRight
                  size={14}
                  className="ml-auto text-slate-600 group-hover:text-blue-400 transition"
                />
              </Link>

            </div>

          </div>

          {/* PLATFORM */}
          <div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Our Mission
            </h3>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>

              <h4 className="font-bold text-white">
                Food With Purpose
              </h4>

              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                We believe good food should reach people,
                not go to waste. Together, small actions can
                create meaningful change.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          BOTTOM BAR
      ===================================================== */}
      <div className="border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">

            <p className="text-xs sm:text-sm text-slate-500">
              © {new Date().getFullYear()} SHAREbite. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
              <span>Built with</span>

              <Heart
                size={14}
                className="text-green-500"
                fill="currentColor"
              />

              <span>for a better community.</span>
            </div>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;
