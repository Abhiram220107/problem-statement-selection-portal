import React, { useState } from 'react';
import { LogIn, Shield, Lock, User, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function Login({ onLoginSuccess, switchToAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await api.login(username.trim(), password.trim());
      if (res.success && res.team) {
        onLoginSuccess(res.team);
      } else {
        setError(res.message || 'Invalid username or password.');
      }
    } catch (err) {
      setError('Unable to authenticate. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          {/* Top Decorative Banner Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600"></div>

          {/* Logo & Header */}
          <div className="text-center mb-8 pt-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 mb-4">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            
            <span className="inline-block px-3 py-1 mb-2 text-[11px] font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full">
              IEEE SMC KARE
            </span>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Problem Statement Selection
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Select your challenge for the technical event
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-3 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Team Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. team01"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Authenticating Team...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>LOGIN TO SELECTION PORTAL</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Toggle to Admin */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={switchToAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Are you an Administrator? Login here</span>
            </button>
          </div>
        </div>

        {/* Branding Footer */}
        <p className="text-center text-[11px] font-medium text-slate-400 mt-6">
          IEEE SMC KARE — Event Management Platform
        </p>
      </div>
    </div>
  );
}
