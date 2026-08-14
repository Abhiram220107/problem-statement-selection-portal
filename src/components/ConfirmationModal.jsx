import React from 'react';
import { AlertTriangle, Lock, X } from 'lucide-react';

export default function ConfirmationModal({ problem, isOpen, onClose, onConfirm, isSubmitting }) {
  if (!isOpen || !problem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Confirm Selection</h3>
            <p className="text-xs text-slate-500 font-medium">IEEE SMC KARE Portal</p>
          </div>
        </div>

        {/* Selected Problem Highlight Box */}
        <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-extrabold text-orange-600 tracking-wider mb-1">
            PROBLEM ID: {problem.id}
          </div>
          <h4 className="text-base font-bold text-slate-900 leading-snug">
            {problem.title}
          </h4>
          <p className="text-xs text-slate-600 mt-2 line-clamp-3">
            {problem.description}
          </p>
        </div>

        {/* Strict Lock Warning Banner */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-start gap-2 mb-6">
          <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Once selected, this cannot be changed or undone under any circumstances.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-200 transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Locking Selection...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Confirm Selection</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
