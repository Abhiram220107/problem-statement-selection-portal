import React from 'react';
import { Menu } from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from './SocialIcons';

export default function Header({ user, isAdmin, onToggleSidebar }) {
  const name = user?.name || user?.username || 'User';
  const role = isAdmin ? 'Administrator' : 'Participating Team';
  const initials = isAdmin ? 'AA' : (user?.id || 'T01');

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-extrabold text-slate-900 leading-tight">
            Problem Statement Selection Portal
          </h1>
          <p className="text-xs font-black text-orange-600">
            IEEE SMC KARE
          </p>
        </div>
      </div>

      {/* Right: Social Links & Profile */}
      <div className="flex items-center gap-4">
        {/* Social Badges */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://instagram.com/ieeesmckare"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-semibold border border-pink-200 transition-all"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>@ieeesmckare</span>
          </a>

          <a
            href="https://linkedin.com/company/ieee-smc-kare"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-all"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
            <span>IEEE SMC KARE</span>
          </a>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-extrabold text-slate-900 leading-tight">
              {isAdmin ? `Admin ${name}` : name}
            </div>
            <div className="text-[10px] font-semibold text-slate-500">
              {role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
