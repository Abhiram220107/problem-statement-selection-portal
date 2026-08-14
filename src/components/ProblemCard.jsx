import React from 'react';
import StatusBadge from './StatusBadge';
import { ArrowRight, Lock } from 'lucide-react';

export default function ProblemCard({ problem, teamHasSelection, onSelect, isSubmitting }) {
  const isAvailable = problem.status === 'AVAILABLE' || problem.status === 'Available';

  return (
    <div
      className={`relative bg-white rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
        isAvailable
          ? 'border-slate-200 shadow-card shadow-card-hover hover:border-orange-300'
          : 'border-slate-200 bg-slate-50/70 opacity-90'
      }`}
    >
      <div>
        {/* Header: ID + Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-block px-3 py-1 text-xs font-extrabold tracking-wider text-orange-700 bg-orange-50 border border-orange-200 rounded-lg">
            {problem.id}
          </span>
          <StatusBadge status={problem.status} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
          {problem.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          {problem.description}
        </p>
      </div>

      {/* Footer / Action */}
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
        {problem.selectedBy && (
          <div className="text-[11px] text-slate-500 font-medium mb-1 flex items-center justify-between">
            <span>Selected by:</span>
            <span className="font-semibold text-slate-700">{problem.selectedBy}</span>
          </div>
        )}

        {isAvailable ? (
          teamHasSelection ? (
            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200"
            >
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Selection Locked</span>
            </button>
          ) : (
            <button
              onClick={() => onSelect(problem)}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Select Problem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )
        ) : (
          <button
            disabled
            className="w-full py-2.5 px-4 rounded-xl bg-rose-50 text-rose-400 font-semibold text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-rose-100"
          >
            <Lock className="w-4 h-4 text-rose-300" />
            <span>Unavailable</span>
          </button>
        )}
      </div>
    </div>
  );
}
