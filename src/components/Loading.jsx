import React from 'react';

export default function Loading({ message = 'Loading selection portal...' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
        <div className="absolute font-bold text-xs text-indigo-600">⚡</div>
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-500 animate-pulse">{message}</p>
    </div>
  );
}
