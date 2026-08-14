import React from 'react';
import { CheckCircle2, XCircle, Lock } from 'lucide-react';

export default function StatusBadge({ status, isLocked = false }) {
  if (isLocked) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
        <Lock className="w-3.5 h-3.5 text-amber-600" />
        🔒 SELECTION LOCKED
      </span>
    );
  }

  if (status === 'AVAILABLE' || status === 'Available') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        🟢 AVAILABLE
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
      🔴 ALREADY SELECTED
    </span>
  );
}
