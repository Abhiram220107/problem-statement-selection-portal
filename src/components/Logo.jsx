import React, { useState } from 'react';

export default function Logo({ className = "h-10", showSubtext = true, lightMode = false }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {!imgError ? (
        <img
          src="/logo.png"
          alt="IEEE SMC KARE Logo"
          className={`${className} object-contain`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex items-center gap-3 select-none">
          {/* Custom IEEE SMC Gold Brain/Globe Emblem */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0 border border-amber-300/40">
            <svg className="w-6 h-6 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>

          {/* Typography */}
          <div>
            <div className="flex items-center gap-1">
              <span className={`font-black text-sm tracking-tight ${lightMode ? 'text-slate-900' : 'text-white'}`}>
                IEEE
              </span>
              <span className="font-black text-sm tracking-tight text-amber-400">
                SMC
              </span>
            </div>
            {showSubtext && (
              <div className={`text-[9px] font-extrabold tracking-wider uppercase ${lightMode ? 'text-slate-500' : 'text-purple-300/90'}`}>
                KARE Student Branch
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
