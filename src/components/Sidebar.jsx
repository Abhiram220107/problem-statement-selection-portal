import React from 'react';
import Logo from './Logo';
import { InstagramIcon, LinkedinIcon, GlobeIcon } from './SocialIcons';
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, isAdmin = false, onLogout, isOpen, setIsOpen }) {
  const navItems = isAdmin
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'teams', label: 'Teams Overview', icon: Users },
        { id: 'problems', label: 'Manage Problems', icon: FileText },
      ]
    : [
        { id: 'problems', label: 'Problem Statements', icon: FileText },
      ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-60 bg-[#120d08] text-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-orange-950/40 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Logo Section */}
        <div>
          <div className="p-5 border-b border-orange-950/50 flex items-center justify-between">
            <Logo className="h-10" />
          </div>

          {/* Clean Functional Nav Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (!isAdmin && item.id === 'problems');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-950/50 border border-orange-400/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer mt-4"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Footer Box */}
        <div className="p-4 m-3 rounded-xl bg-orange-950/20 border border-orange-900/30 text-center">
          <p className="text-[11px] font-semibold italic text-orange-200 mb-2">
            "Engineering Intelligence for a Better Tomorrow."
          </p>

          <div className="flex items-center justify-center gap-2 mb-3">
            <a
              href="https://instagram.com/ieeesmckare"
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-pink-600/30 text-pink-400 flex items-center justify-center transition-all border border-white/10"
              title="Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://linkedin.com/company/ieee-smc-kare"
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-blue-600/30 text-blue-400 flex items-center justify-center transition-all border border-white/10"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://ieeesmckare.in"
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-orange-600/30 text-orange-400 flex items-center justify-center transition-all border border-white/10"
              title="Website"
            >
              <GlobeIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="text-[10px] font-medium text-slate-500">
            © 2026 IEEE SMC KARE SB
          </div>
        </div>
      </aside>
    </>
  );
}
