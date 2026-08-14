import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProblemCard from '../components/ProblemCard';
import ConfirmationModal from '../components/ConfirmationModal';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';
import { InstagramIcon, LinkedinIcon, GlobeIcon } from '../components/SocialIcons';
import { SOCIAL_LINKS } from '../config/social';
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Megaphone,
  ArrowUpRight
} from 'lucide-react';

export default function TeamDashboard({ team, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [teamState, setTeamState] = useState(team);
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProblemForModal, setSelectedProblemForModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchDashboardData = async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMsg('');

    try {
      const teamRes = await api.getTeamStatus(team.id);
      if (teamRes.success && teamRes.team) {
        setTeamState(teamRes.team);
      }

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loading message="Connecting to IEEE SMC KARE selection server..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={teamState}
        isAdmin={false}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        {/* Top Header */}
        <Header
          user={teamState}
          isAdmin={false}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {/* Greeting Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Welcome, {teamState.name || `Team ${teamState.id}`}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-orange-100 text-orange-800 border border-orange-200">
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
              <RefreshCw className={`w-3.5 h-3.5 text-orange-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Live Status'}</span>
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg('')} className="text-rose-600 underline font-bold cursor-pointer">
                Dismiss
              </button>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>🎉 {successMsg}</span>
            </div>
          )}

          {/* RULE 4 PERSISTENT CONFIRMED SELECTION BANNER */}
          {hasSelectedProblem && selectedProblemDetails && (
            <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 text-white shadow-2xl relative overflow-hidden border border-orange-800">
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

                <div className="text-xs font-extrabold tracking-widest text-orange-300 uppercase mb-1">
                  Selected Challenge ID: {selectedProblemDetails.id}
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
                  {selectedProblemDetails.title}
                </h3>

                <p className="text-xs text-orange-100/90 leading-relaxed max-w-3xl mb-6">
                  {selectedProblemDetails.description}
                </p>

                <div className="pt-4 border-t border-orange-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-orange-200">
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

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (2/3): Problem Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  {hasSelectedProblem ? 'All Problem Statements' : 'Available Problem Statements'}
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  Total: {problems.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            {/* Right Column (1/3): Announcements & Links */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <Megaphone className="w-5 h-5 text-orange-600" />
                  <h4 className="text-sm font-extrabold text-slate-900">Event Announcements</h4>
                </div>

                <div className="p-4 rounded-xl bg-orange-50/80 border border-orange-100 text-orange-950 text-xs leading-relaxed mb-4">
                  <div className="font-bold mb-1">Attention Teams!</div>
                  Select your problem statement carefully. Once selected, your choice is final and locked.
                </div>

                <p className="text-xs font-semibold text-slate-500">
                  Good luck with your hackathon challenge!
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <h4 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <GlobeIcon className="w-4 h-4 text-orange-600" />
                  <span>IEEE SMC KARE Links</span>
                </h4>

                <div className="space-y-3 text-xs font-semibold">
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-pink-50 text-slate-700 hover:text-pink-700 border border-slate-200/80 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <InstagramIcon className="w-4 h-4 text-pink-600" />
                      <span>Instagram</span>
                    </div>
                    <span className="text-slate-400 group-hover:text-pink-600 flex items-center gap-1 font-bold text-[11px]">
                      {SOCIAL_LINKS.instagramHandle}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </a>

                  <a
                    href={SOCIAL_LINKS.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <LinkedinIcon className="w-4 h-4 text-blue-600" />
                      <span>LinkedIn</span>
                    </div>
                    <span className="text-slate-400 group-hover:text-blue-600 flex items-center gap-1 font-bold text-[11px]">
                      {SOCIAL_LINKS.linkedinHandle}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </a>

                  <a
                    href={SOCIAL_LINKS.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-slate-200/80 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <GlobeIcon className="w-4 h-4 text-orange-600" />
                      <span>Website</span>
                    </div>
                    <span className="text-slate-400 group-hover:text-orange-600 flex items-center gap-1 font-bold text-[11px]">
                      {SOCIAL_LINKS.websiteHandle}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-4 text-center text-xs font-semibold text-slate-400 border-t border-slate-200 bg-white">
          Problem Statement Selection Portal by <span className="font-extrabold text-slate-700">IEEE SMC KARE</span>
        </footer>
      </div>

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
