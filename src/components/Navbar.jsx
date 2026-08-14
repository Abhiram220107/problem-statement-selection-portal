import React from 'react';
import { LogOut, ShieldCheck, User, Sparkles } from 'lucide-react';

export default function Navbar({ user, isAdmin, onLogout, mockNotice = false }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {mockNotice && (
        <div className="bg-amber-500 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>⚡ Demo / Local Test Mode active (Connect Google Apps Script URL in VITE_API_URL for live Sheet production)</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Event Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 flex items-center justify-center text-white shadow-md font-bold text-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Problem Statement Selection
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                IEEE SMC KARE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Technical Event Portal</p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Admin: {user.username}</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>{user.name || user.username} ({user.id})</span>
                </>
              )}
            </div>
          )}

          {user && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
