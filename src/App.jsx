import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import TeamDashboard from './pages/TeamDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { auth } from './utils/auth';

export default function App() {
  const [view, setView] = useState('team_login'); // 'team_login' | 'team_dashboard' | 'admin_login' | 'admin_dashboard'
  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  // Restore persistent sessions on app load
  useEffect(() => {
    const savedAdmin = auth.getAdminSession();
    if (savedAdmin) {
      setCurrentAdmin(savedAdmin);
      setView('admin_dashboard');
      return;
    }

    const savedTeam = auth.getTeamSession();
    if (savedTeam) {
      setCurrentTeam(savedTeam);
      setView('team_dashboard');
    }
  }, []);

  // Team Handlers
  const handleTeamLoginSuccess = (teamData) => {
    setCurrentTeam(teamData);
    auth.setTeamSession(teamData);
    setView('team_dashboard');
  };

  const handleTeamLogout = () => {
    auth.clearTeamSession();
    setCurrentTeam(null);
    setView('team_login');
  };

  // Admin Handlers
  const handleAdminLoginSuccess = (adminData) => {
    setCurrentAdmin(adminData);
    auth.setAdminSession(adminData);
    setView('admin_dashboard');
  };

  const handleAdminLogout = () => {
    auth.clearAdminSession();
    setCurrentAdmin(null);
    setView('admin_login');
  };

  // Navigation View Router
  if (view === 'team_dashboard' && currentTeam) {
    return <TeamDashboard team={currentTeam} onLogout={handleTeamLogout} />;
  }

  if (view === 'admin_login') {
    return (
      <AdminLogin
        onAdminLoginSuccess={handleAdminLoginSuccess}
        switchToTeam={() => setView('team_login')}
      />
    );
  }

  if (view === 'admin_dashboard' && currentAdmin) {
    return <AdminDashboard admin={currentAdmin} onLogout={handleAdminLogout} />;
  }

  // Default: Team Login Page
  return (
    <Login
      onLoginSuccess={handleTeamLoginSuccess}
      switchToAdmin={() => setView('admin_login')}
    />
  );
}
