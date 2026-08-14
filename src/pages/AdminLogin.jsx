import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

export default function AdminLogin({ onAdminLoginSuccess, switchToTeam }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both admin username and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await api.adminLogin(username.trim(), password.trim());
      if (res.success && res.admin) {
        onAdminLoginSuccess(res.admin);
      } else {
        setError(res.message || 'Invalid admin credentials.');
      }
    } catch (err) {
      setError('Admin authentication failed. Check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950 text-slate-100">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Top Decorative Banner Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600"></div>

          {/* Logo & Header */}
          <div className="text-center mb-8 pt-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 mb-2 text-[11px] font-extrabold tracking-widest text-purple-300 bg-purple-950/60 border border-purple-800 rounded-full">
              ADMIN CONTROL PANEL
            </span>

            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Event Admin Login
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              IEEE SMC KARE Technical Event Management
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-3 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Abhi"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying Admin Rights...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>ACCESS ADMIN DASHBOARD</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Toggle to Team */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <button
              onClick={switchToTeam}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Team Selection Portal</span>
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] font-medium text-slate-500 mt-6">
          IEEE SMC KARE — Authorized Event Personnel Only
        </p>
      </div>
    </div>
  );
}
