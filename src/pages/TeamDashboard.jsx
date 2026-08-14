import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProblemCard from '../components/ProblemCard';
import ConfirmationModal from '../components/ConfirmationModal';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';
import { Lock, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function TeamDashboard({ team, onLogout }) {
  const [teamState, setTeamState] = useState(team);
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProblemForModal, setSelectedProblemForModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Synchronize state with Google Apps Script backend source-of-truth
  const fetchDashboardData = async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMsg('');

    try {
      // 1. Fetch team latest status (persistence check)
      const teamRes = await api.getTeamStatus(team.id);
      if (teamRes.success && teamRes.team) {
        setTeamState(teamRes.team);
      }

      // 2. Fetch all problems list
      const probRes = await api.getProblems();
      if (probRes.success && probRes.problems) {
        setProblems(probRes.problems);
      }
    } catch (err) {
      setErrorMsg('Failed to sync latest problem statement status from server.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(true);
  }, [team.id]);

  // Handle problem selection submission
  const handleConfirmSelection = async () => {
    if (!selectedProblemForModal) return;
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await api.selectProblem(team.id, selectedProblemForModal.id);
      if (response.success) {
        setSuccessMsg(response.message || 'Problem selected successfully!');
        setSelectedProblemForModal(null);
        // Refresh dashboard state immediately
        await fetchDashboardData(false);
      } else {
        setErrorMsg(response.message || 'Selection failed.');
        setSelectedProblemForModal(null);
      }
    } catch (err) {
      setErrorMsg('Network error. Unable to record selection.');
      setSelectedProblemForModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasSelectedProblem = !!(teamState?.selectedProblemId || teamState?.selectedProblem);
  const selectedProblemDetails = teamState?.selectedProblem;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar user={teamState} isAdmin={false} onLogout={onLogout} mockNotice={api.isUsingMock()} />
        <Loading message="Connecting to IEEE SMC KARE selection server..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <Navbar user={teamState} isAdmin={false} onLogout={onLogout} mockNotice={api.isUsingMock()} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Sync / Refresh Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Welcome, {teamState.name || `Team ${teamState.id}`}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200">
                {teamState.id}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              {hasSelectedProblem
                ? 'Your problem selection is confirmed and locked.'
                : 'Choose your problem statement. Only one problem can be selected.'}
            </p>
          </div>

          <button
            onClick={() => fetchDashboardData(false)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Live Status'}</span>
          </button>
        </div>

        {/* Global Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-shake">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>⚠️ {errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg('')}
              className="text-rose-600 hover:text-rose-900 text-xs underline font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Global Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>🎉 {successMsg}</span>
          </div>
        )}

        {/* RULE 4 PERSISTENT CONFIRMED SELECTION BANNER */}
        {hasSelectedProblem && selectedProblemDetails && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-2xl relative overflow-hidden border border-indigo-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  SELECTION CONFIRMED
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  🔒 Selection Locked
                </span>
              </div>

              <div className="text-xs font-extrabold tracking-widest text-indigo-300 uppercase mb-1">
                Selected Challenge ID: {selectedProblemDetails.id}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
                {selectedProblemDetails.title}
              </h3>

              <p className="text-xs text-indigo-200/90 leading-relaxed max-w-3xl mb-6">
                {selectedProblemDetails.description}
              </p>

              <div className="pt-4 border-t border-indigo-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-indigo-300">
                <div>
                  Confirmed At: <span className="font-bold text-white">{selectedProblemDetails.selectedAt || teamState.selectedAt || 'Recorded'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold bg-amber-950/50 px-3 py-1.5 rounded-xl border border-amber-800/50">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Your selection is locked and cannot be changed.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Problem Statements Cards Section */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            {hasSelectedProblem ? 'All Problem Statements' : 'Available Problem Statements'}
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            Total Problems: {problems.length}
          </span>
        </div>

        {/* 10 Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              teamHasSelection={hasSelectedProblem}
              onSelect={(p) => setSelectedProblemForModal(p)}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        problem={selectedProblemForModal}
        isOpen={!!selectedProblemForModal}
        onClose={() => setSelectedProblemForModal(null)}
        onConfirm={handleConfirmSelection}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
