import React from 'react';
import { Lock } from 'lucide-react';

export default function StatusBadge({ status, isLocked = false }) {
  if (isLocked) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
        <Lock className="w-3.5 h-3.5 text-amber-600" />
        <span>SELECTION LOCKED</span>
      </span>
    );
  }

  if (status === 'AVAILABLE' || status === 'Available') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
        <span>AVAILABLE</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
      <span>ALREADY SELECTED</span>
    </span>
  );
}
