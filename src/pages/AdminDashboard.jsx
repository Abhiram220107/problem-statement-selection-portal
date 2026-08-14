import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import AdminProblemModal from '../components/AdminProblemModal';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';
import { Users, CheckCircle2, Clock, FileText, Edit3, RefreshCw, Shield, AlertCircle } from 'lucide-react';

export default function AdminDashboard({ admin, onLogout }) {
  const [stats, setStats] = useState({ totalTeams: 10, selectedTeams: 0, remainingTeams: 10, availableProblems: 10 });
  const [teams, setTeams] = useState([]);
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'teams' | 'problems'
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
      setErrorMsg('Network error while connecting to Google Sheets database.');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar user={admin} isAdmin={true} onLogout={onLogout} mockNotice={api.isUsingMock()} />
        <Loading message="Loading Admin Telemetry & Google Sheets Data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <Navbar user={admin} isAdmin={true} onLogout={onLogout} mockNotice={api.isUsingMock()} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Admin Command Dashboard
              </h2>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              IEEE SMC KARE Event Selection Overview & Live Control
            </p>
          </div>

          <button
            onClick={() => fetchAdminData(false)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-200 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Sheet Data'}</span>
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-rose-600 underline font-bold">
              Dismiss
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <span>🎉 {successMsg}</span>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-600 underline font-bold">
              Dismiss
            </button>
          </div>
        )}

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase text-slate-400">Total Teams</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.totalTeams}</div>
            <span className="text-[11px] font-semibold text-slate-500">Registered in Sheet</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase text-emerald-600">Selected</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-700">{stats.selectedTeams}</div>
            <span className="text-[11px] font-semibold text-emerald-600">Confirmed Teams</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase text-amber-600">Remaining</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-amber-700">{stats.remainingTeams}</div>
            <span className="text-[11px] font-semibold text-amber-600">Awaiting Selection</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase text-indigo-600">Available Problems</span>
              <FileText className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-indigo-700">{stats.availableProblems}</div>
            <span className="text-[11px] font-semibold text-indigo-600">Open for Selection</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Tables Overview
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'teams'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Teams Selection Status ({teams.length})
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'problems'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Problem Statements & Edit ({problems.length})
          </button>
        </div>

        {/* Section 1: Teams Selection Table */}
        {(activeTab === 'overview' || activeTab === 'teams') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Teams Status Summary</h3>
                <p className="text-xs text-slate-500">Live roster of registered teams and their selected challenge</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200 uppercase tracking-wider">
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
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{t.id}</td>
                      <td className="py-3.5 px-4 font-bold text-indigo-700">{t.name}</td>
                      <td className="py-3.5 px-4">
                        {t.selectedProblemId !== '—' ? (
                          <span className="font-extrabold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
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

        {/* Section 2: Problems Management Table */}
        {(activeTab === 'overview' || activeTab === 'problems') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Problem Statements Management</h3>
                <p className="text-xs text-slate-500">Edit titles/descriptions and monitor allocation</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Problem ID</th>
                    <th className="py-3.5 px-4">Title & Description</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Selected By</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {problems.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-black text-indigo-700 align-top">{p.id}</td>
                      <td className="py-4 px-4 max-w-md align-top">
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold text-xs transition-all cursor-pointer"
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
      </main>

      {/* Edit Problem Modal */}
      <AdminProblemModal
        problem={editingProblem}
        isOpen={!!editingProblem}
        onClose={() => setEditingProblem(null)}
        onSave={handleSaveProblem}
      />
    </div>
  );
}
