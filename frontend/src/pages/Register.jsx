import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        role
      });

      login(data);

      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

        <div className="grid md:grid-cols-2">

          {/* LEFT BRANDING */}
          <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-green-800 p-10 lg:p-14 text-white">

            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-24 -right-20 w-72 h-72 bg-white/10 rounded-full"></div>

            <div className="relative z-10 flex flex-col justify-between w-full">

              <div>

                <div className="flex items-center gap-3 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl">
                    🌿
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold">
                      SHAREbite
                    </h1>

                    <p className="text-green-100 text-xs">
                      Share Food • Share Hope
                    </p>
                  </div>
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-5">
                  Join the
                  <br />
                  Movement!
                </h2>

                <p className="text-green-50 leading-relaxed max-w-sm">
                  Create an account and become part of a community
                  working together to reduce food waste and fight hunger.
                </p>

              </div>

              <div className="mt-12">

                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10">

                  <p className="text-sm text-green-100 mb-3">
                    Choose your role
                  </p>

                  <div className="space-y-3 text-sm">

                    <div className="flex items-center gap-3">
                      <span className="text-xl">🍱</span>
                      <span>Donor — Share surplus food</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xl">🏢</span>
                      <span>NGO — Receive food for communities</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xl">🚚</span>
                      <span>Volunteer — Help deliver food</span>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="p-7 sm:p-10 lg:p-14">

            {/* MOBILE LOGO */}
            <div className="md:hidden text-center mb-8">

              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 text-2xl mb-3">
                🌿
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                SHAREbite
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Share Food • Share Hope
              </p>

            </div>

            <div className="max-w-md mx-auto">

              <div className="mb-8">

                <p className="text-sm font-semibold text-green-600 mb-2">
                  GET STARTED
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                  Create account
                </h2>

                <p className="text-slate-500 mt-2">
                  Join SHAREbite and start making an impact today.
                </p>

              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* NAME */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      👤
                    </span>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition"
                    />

                  </div>

                </div>

                {/* EMAIL */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      ✉️
                    </span>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition"
                    />

                  </div>

                </div>

                {/* PASSWORD */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      🔒
                    </span>

                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Create a password"
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-600 transition"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>

                  </div>

                </div>

                {/* ROLE */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    I want to
                  </label>

                  <div className="grid grid-cols-3 gap-2">

                    <button
                      type="button"
                      onClick={() => setRole('donor')}
                      className={`p-3 rounded-xl border text-center transition ${
                        role === 'donor'
                          ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/10'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-green-300'
                      }`}
                    >
                      <div className="text-xl mb-1">🍱</div>
                      <div className="text-xs font-semibold">
                        Donor
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('ngo')}
                      className={`p-3 rounded-xl border text-center transition ${
                        role === 'ngo'
                          ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/10'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-green-300'
                      }`}
                    >
                      <div className="text-xl mb-1">🏢</div>
                      <div className="text-xs font-semibold">
                        NGO
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('volunteer')}
                      className={`p-3 rounded-xl border text-center transition ${
                        role === 'volunteer'
                          ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/10'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-green-300'
                      }`}
                    >
                      <div className="text-xl mb-1">🚚</div>
                      <div className="text-xs font-semibold">
                        Volunteer
                      </div>
                    </button>

                  </div>

                </div>

                {/* REGISTER */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold shadow-lg shadow-green-600/20 hover:from-green-700 hover:to-emerald-600 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Creating account...
                    </span>
                  ) : (
                    'Create Account →'
                  )}
                </button>

              </form>

              {/* LOGIN LINK */}
              <div className="relative my-7">

                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-xs text-slate-400">
                    ALREADY A MEMBER?
                  </span>
                </div>

              </div>

              <p className="text-center text-slate-500">

                Already have an account?{' '}

                <Link
                  to="/login"
                  className="font-bold text-green-600 hover:text-green-700 hover:underline transition"
                >
                  Sign in
                </Link>

              </p>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Register;
