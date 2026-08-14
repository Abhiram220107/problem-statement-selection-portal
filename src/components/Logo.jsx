import React, { useState } from 'react';

export default function Logo({ className = "h-12", showSubtext = true, lightMode = false }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {!imgError ? (
        <img
          src="/logo.png"
          alt="IEEE SMC KARE"
          className={`${className} object-contain`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 via-amber-600 to-purple-700 flex items-center justify-center text-white font-extrabold shadow-md shrink-0">
            SMC
          </div>
          <div>
            <div className={`font-black text-sm leading-tight ${lightMode ? 'text-slate-900' : 'text-white'}`}>
              IEEE <span className="text-purple-400">SMC</span>
            </div>
            {showSubtext && (
              <div className={`text-[10px] font-bold tracking-wider uppercase ${lightMode ? 'text-slate-500' : 'text-purple-300'}`}>
                KARE Student Branch
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
