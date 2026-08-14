import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Loading from '../components/Loading';
import AdminProblemModal from '../components/AdminProblemModal';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';
import { InstagramIcon, LinkedinIcon, GlobeIcon } from '../components/SocialIcons';
import { SOCIAL_LINKS } from '../config/social';
import {
  Users,
  CheckCircle2,
  Hourglass,
  FileText,
  Edit3,
  RefreshCw,
  Megaphone,
  ArrowUpRight,
  Download,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ totalTeams: 10, selectedTeams: 0, remainingTeams: 10, availableProblems: 10 });
  const [teams, setTeams] = useState([]);
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAdminData = async (showSpinner = true) => {
    if (showSpinner) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMsg('');

    try {
      const res = await api.getAdminStatus();
      if (res.success) {
        if (res.stats) setStats(res.stats);
        if (res.teams) setTeams(res.teams);
        if (res.problems) setProblems(res.problems);
      } else {
        setErrorMsg(res.message || 'Failed to load admin dashboard telemetry.');
      }
    } catch (err) {
      setErrorMsg('Network error connecting to Google Sheets database.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData(true);
  }, []);

  const handleSaveProblem = async (problemId, title, description) => {
    const res = await api.updateProblem(problemId, title, description);
    if (res.success) {
      setSuccessMsg(`Problem ${problemId} updated successfully.`);
      await fetchAdminData(false);
    } else {
      throw new Error(res.message || 'Failed to update problem statement.');
    }
  };

  const handleExportCSV = () => {
    const csvRows = ['Team ID,Team Name,Selected Problem ID,Status,Selected At'];
    teams.forEach((t) => {
      csvRows.push(`"${t.id}","${t.name}","${t.selectedProblemId}","${t.status}","${t.selectedAt}"`);
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IEEE_SMC_KARE_Selections_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loading message="Loading IEEE SMC KARE Dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={admin}
        isAdmin={true}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        {/* Top Header */}
        <Header
          user={admin}
          isAdmin={true}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {/* Notifications */}
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
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs">
              <span>🎉 {successMsg}</span>
              <button onClick={() => setSuccessMsg('')} className="text-emerald-600 underline font-bold cursor-pointer">
                Dismiss
              </button>
            </div>
          )}

          {/* 4 STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Teams</span>
                <div className="text-2xl font-black text-slate-900 leading-none my-1">{stats.totalTeams}</div>
                <span className="text-[11px] font-medium text-slate-400">Registered in Sheet</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Selected Teams</span>
                <div className="text-2xl font-black text-slate-900 leading-none my-1">{stats.selectedTeams}</div>
                <span className="text-[11px] font-medium text-slate-400">Confirmed Selections</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Hourglass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Remaining</span>
                <div className="text-2xl font-black text-slate-900 leading-none my-1">{stats.remainingTeams}</div>
                <span className="text-[11px] font-medium text-slate-400">Awaiting Selection</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Available Problems</span>
                <div className="text-2xl font-black text-slate-900 leading-none my-1">{stats.availableProblems}</div>
                <span className="text-[11px] font-medium text-slate-400">Open for Selection</span>
              </div>
            </div>
          </div>

          {/* MAIN GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: Teams Overview Table */}
            <div className="lg:col-span-2 space-y-8">
              {(activeTab === 'dashboard' || activeTab === 'teams') && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-600" />
                        <span>Teams Overview</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Live roster of all registered teams and their selection status.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fetchAdminData(false)}
                        disabled={isRefreshing}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
                        title="Sync Sheet Data"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-xs border border-orange-200 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/80 text-slate-500 font-extrabold border-b border-slate-200 uppercase tracking-wider">
                        <tr>
                          <th className="py-3.5 px-4">Team ID</th>
                          <th className="py-3.5 px-4">Team Name</th>
                          <th className="py-3.5 px-4">Selected Problem</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {teams.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4 font-extrabold text-slate-900">{t.id}</td>
                            <td className="py-3.5 px-4 font-bold text-orange-700">{t.name}</td>
                            <td className="py-3.5 px-4">
                              {t.selectedProblemId !== '—' ? (
                                <span className="font-extrabold px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200">
                                  {t.selectedProblemId}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <StatusBadge status={t.status === 'Selected' ? 'SELECTED' : 'AVAILABLE'} />
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 text-[11px]">{t.selectedAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Problems Management Table */}
              {(activeTab === 'dashboard' || activeTab === 'problems') && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-orange-600" />
                        <span>Problem Statements Management</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Edit title/description and monitor allocation</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/80 text-slate-500 font-extrabold border-b border-slate-200 uppercase tracking-wider">
                        <tr>
                          <th className="py-3.5 px-4">ID</th>
                          <th className="py-3.5 px-4">Title & Description</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Selected By</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {problems.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-4 px-4 font-black text-orange-600 align-top">{p.id}</td>
                            <td className="py-4 px-4 max-w-xs align-top">
                              <div className="font-bold text-slate-900 text-sm mb-1">{p.title}</div>
                              <p className="text-slate-600 text-xs leading-relaxed">{p.description}</p>
                            </td>
                            <td className="py-4 px-4 align-top">
                              <StatusBadge status={p.status === 'Selected' ? 'SELECTED' : 'AVAILABLE'} />
                            </td>
                            <td className="py-4 px-4 text-slate-600 font-semibold align-top">
                              {p.selectedBy !== '—' ? p.selectedBy : <span className="text-slate-400">—</span>}
                            </td>
                            <td className="py-4 px-4 text-right align-top">
                              <button
                                onClick={() => setEditingProblem(p)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-semibold text-xs transition-all cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Sidebar Cards */}
            <div className="space-y-6">
              {/* Announcements Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <Megaphone className="w-5 h-5 text-orange-600" />
                  <h4 className="text-sm font-extrabold text-slate-900">Announcements</h4>
                </div>

                <div className="p-4 rounded-xl bg-orange-50/80 border border-orange-100 text-orange-950 text-xs leading-relaxed mb-4">
                  <div className="font-bold mb-1 flex items-center justify-between">
                    <span>Welcome Admin!</span>
                    <Megaphone className="w-4 h-4 text-orange-600" />
                  </div>
                  Use the side menu to manage teams, problems, and view live selections.
                </div>

                <p className="text-xs font-semibold text-slate-500">
                  Keep the challenge fair. Keep the spirit high!
                </p>
              </div>

              {/* Quick Links Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <h4 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <GlobeIcon className="w-4 h-4 text-orange-600" />
                  <span>Quick Links</span>
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

        {/* Footer */}
        <footer className="py-4 text-center text-xs font-semibold text-slate-400 border-t border-slate-200 bg-white">
          Problem Statement Selection Portal by <span className="font-extrabold text-slate-700">IEEE SMC KARE</span>
        </footer>
      </div>

      {/* Edit Modal */}
      <AdminProblemModal
        problem={editingProblem}
        isOpen={!!editingProblem}
        onClose={() => setEditingProblem(null)}
        onSave={handleSaveProblem}
      />
    </div>
  );
}
