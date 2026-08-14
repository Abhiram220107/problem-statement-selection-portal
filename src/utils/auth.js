/**
 * Authentication & Session Management Utilities
 */

const TEAM_SESSION_KEY = 'pas_team_session';
const ADMIN_SESSION_KEY = 'pas_admin_session';

export const auth = {
  // Team Session
  setTeamSession: (teamData) => {
    localStorage.setItem(TEAM_SESSION_KEY, JSON.stringify(teamData));
  },
  getTeamSession: () => {
    const data = localStorage.getItem(TEAM_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },
  clearTeamSession: () => {
    localStorage.removeItem(TEAM_SESSION_KEY);
  },

  // Admin Session
  setAdminSession: (adminData) => {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminData));
  },
  getAdminSession: () => {
    const data = localStorage.getItem(ADMIN_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },
  clearAdminSession: () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  },

  // Clear all
  clearAll: () => {
    localStorage.removeItem(TEAM_SESSION_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
};
