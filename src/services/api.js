/**
 * API Service Layer for Problem Statement Selection Portal
 * Connects to Google Apps Script Web App API with fallback to Local Mock Mode.
 */

const RAW_API_URL = import.meta.env.VITE_API_URL || '';
const API_URL = RAW_API_URL.includes('YOUR_DEPLOYED_SCRIPT_ID') ? '' : RAW_API_URL;

// ============================================================================
// LOCAL MOCK STATE (Used when VITE_API_URL is not configured yet)
// ============================================================================
const MOCK_TEAMS_KEY = 'pas_mock_teams';
const MOCK_PROBLEMS_KEY = 'pas_mock_problems';

const INITIAL_PROBLEMS = [
  { id: 'P01', title: 'AI-Driven Smart Traffic Management', description: 'Develop an intelligent real-time computer vision system to optimize dynamic traffic signals and reduce city congestion.', status: 'AVAILABLE', selectedBy: null, selectedAt: null },
  { id: 'P02', title: 'IoT Smart Microgrid Energy Tracker', description: 'Design an IoT-enabled dashboard for dynamic load balancing and renewable energy distribution across smart campus grids.', status: 'AVAILABLE', selectedBy: null, selectedAt: null },
  { id: 'P03', title: 'Automated Healthcare Triage Assistant', description: 'Create an NLP-based patient diagnostic triage portal to prioritize emergency hospital care based on symptom urgency.', status: 'AVAILABLE', selectedBy: null, selectedAt: null },
  { id: 'P04', title: 'Blockchain Supply Chain Authenticator', description: 'Build a decentralized anti-counterfeiting tracking platform for pharmaceutical supply chains with QR verification.', status: 'AVAILABLE', selectedBy: null, selectedAt: null },
  { id: 'P05', title: 'Food Waste Prediction & Analytics', description: 'Develop a machine learning forecast engine to predict cafeteria food consumption patterns and eliminate kitchen waste.', status: 'AVAILABLE', selectedBy: null, selectedAt: null },
  { id: 'P06', title: 'Autonomous Drone Fleet Path Optimization', description: 'Design a dynamic graph routing algorithm for coordinated search and rescue multi-drone operations.', status: 'AVAILABLE', selectedBy: null, selectedAt: null },
  { id: 'P07', title: 'Cyber Threat Detection in Edge IoT', description: 'Implement a lightweight anomaly detection engine targeting industrial IoT sensor networks for unauthorized intrusion.', status: 'AVAILABLE', selectedBy: null, selectedAt: null },
  { id: 'P08', title: 'AR-Based Campus Navigation System', description: 'Create an augmented reality mobile WebApp that provides interactive 3D indoor directional overlays for campus visitors.', status: 'AVAILABLE', selectedBy: null, selectedAt: null },
  { id: 'P09', title: 'Real-Time Water Quality Monitoring System', description: 'Develop a wireless sensor node telemetry portal analyzing pH, turbidity, and chemical risk levels in city reservoirs.', status: 'AVAILABLE', selectedBy: null, selectedAt: null },
  { id: 'P10', title: 'Smart Disaster Response Logistics Portal', description: 'Construct a decentralized emergency relief allocation portal connecting victims, volunteers, and supply drop zones.', status: 'AVAILABLE', selectedBy: null, selectedAt: null }
];

const INITIAL_TEAMS = Array.from({ length: 10 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    id: `T${num}`,
    name: `Team ${i + 1}`,
    username: `team${num}`,
    password: '1234',
    selectedProblemId: null,
    selectedAt: null
  };
});

function getMockTeams() {
  const data = localStorage.getItem(MOCK_TEAMS_KEY);
  return data ? JSON.parse(data) : INITIAL_TEAMS;
}

function saveMockTeams(teams) {
  localStorage.setItem(MOCK_TEAMS_KEY, JSON.stringify(teams));
}

function getMockProblems() {
  const data = localStorage.getItem(MOCK_PROBLEMS_KEY);
  return data ? JSON.parse(data) : INITIAL_PROBLEMS;
}

function saveMockProblems(problems) {
  localStorage.setItem(MOCK_PROBLEMS_KEY, JSON.stringify(problems));
}

// Initialize mock storage if empty
if (!localStorage.getItem(MOCK_TEAMS_KEY)) saveMockTeams(INITIAL_TEAMS);
if (!localStorage.getItem(MOCK_PROBLEMS_KEY)) saveMockProblems(INITIAL_PROBLEMS);

/**
 * Generic fetch wrapper for Google Apps Script Web App
 */
async function callApi(payload) {
  if (!API_URL) {
    // Delay for realistic feel in Mock Mode
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockApiCall(payload);
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Google Apps Script request failed, falling back to mock:', err);
    return mockApiCall(payload);
  }
}

/**
 * Mock API Handler simulating backend rules exactly
 */
function mockApiCall(payload) {
  const { action } = payload;
  const teams = getMockTeams();
  const problems = getMockProblems();

  switch (action) {
    case 'login': {
      const { username, password } = payload;
      const team = teams.find(
        (t) => t.username.toLowerCase() === username.trim().toLowerCase() && t.password === password.trim()
      );
      if (!team) {
        return { success: false, message: 'Invalid team username or password.' };
      }
      const selectedProblem = team.selectedProblemId
        ? problems.find((p) => p.id === team.selectedProblemId)
        : null;
      return {
        success: true,
        team: {
          ...team,
          selectedProblem
        }
      };
    }

    case 'adminLogin': {
      const { username, password } = payload;
      if (username.trim() === 'Abhi' && password.trim() === 'Abhi#123') {
        return { success: true, admin: { username: 'Abhi' } };
      }
      return { success: false, message: 'Invalid admin credentials.' };
    }

    case 'getProblems': {
      return { success: true, problems };
    }

    case 'getTeamStatus': {
      const team = teams.find((t) => t.id === payload.teamId);
      if (!team) return { success: false, message: 'Team not found.' };
      const selectedProblem = team.selectedProblemId
        ? problems.find((p) => p.id === team.selectedProblemId)
        : null;
      return {
        success: true,
        team: { ...team, selectedProblem }
      };
    }

    case 'selectProblem': {
      const { teamId, problemId } = payload;
      const tIndex = teams.findIndex((t) => t.id === teamId);
      if (tIndex === -1) return { success: false, message: 'Team not found.' };

      // Rule 1 check:
      if (teams[tIndex].selectedProblemId) {
        return {
          success: false,
          message: 'You have already selected a problem statement. Selection cannot be changed.'
        };
      }

      const pIndex = problems.findIndex((p) => p.id === problemId);
      if (pIndex === -1) return { success: false, message: 'Problem statement not found.' };

      // Rule 2 check:
      if (problems[pIndex].status === 'SELECTED' || problems[pIndex].selectedBy) {
        return {
          success: false,
          message: 'This problem statement has already been selected by another team.'
        };
      }

      const now = new Date();
      const formattedTime = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) +
        ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      teams[tIndex].selectedProblemId = problemId;
      teams[tIndex].selectedAt = formattedTime;

      problems[pIndex].status = 'SELECTED';
      problems[pIndex].selectedBy = `${teams[tIndex].name} (${teams[tIndex].id})`;
      problems[pIndex].selectedAt = formattedTime;

      saveMockTeams(teams);
      saveMockProblems(problems);

      return {
        success: true,
        message: 'Problem statement selected successfully!',
        selectedProblem: problems[pIndex],
        selectedAt: formattedTime
      };
    }

    case 'updateProblem': {
      const { problemId, title, description } = payload;
      const pIndex = problems.findIndex((p) => p.id === problemId);
      if (pIndex === -1) return { success: false, message: 'Problem statement not found.' };

      problems[pIndex].title = title;
      problems[pIndex].description = description;
      saveMockProblems(problems);

      return { success: true, message: `Problem ${problemId} updated successfully.` };
    }

    case 'getAdminStatus': {
      const selectedTeamsCount = teams.filter((t) => t.selectedProblemId).length;
      const availableProblemsCount = problems.filter((p) => p.status === 'AVAILABLE').length;

      const formattedTeams = teams.map((t) => ({
        id: t.id,
        name: t.name,
        username: t.username,
        selectedProblemId: t.selectedProblemId || '—',
        selectedAt: t.selectedAt || '—',
        status: t.selectedProblemId ? 'Selected' : 'Not Selected'
      }));

      const formattedProblems = problems.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        status: p.status === 'SELECTED' ? 'Selected' : 'Available',
        selectedBy: p.selectedBy || '—',
        selectedAt: p.selectedAt || '—'
      }));

      return {
        success: true,
        stats: {
          totalTeams: teams.length,
          selectedTeams: selectedTeamsCount,
          remainingTeams: teams.length - selectedTeamsCount,
          availableProblems: availableProblemsCount
        },
        teams: formattedTeams,
        problems: formattedProblems
      };
    }

    default:
      return { success: false, message: 'Unknown API action.' };
  }
}

// Exported public API methods
export const api = {
  isUsingMock: () => !API_URL,
  login: (username, password) => callApi({ action: 'login', username, password }),
  adminLogin: (username, password) => callApi({ action: 'adminLogin', username, password }),
  getProblems: () => callApi({ action: 'getProblems' }),
  getTeamStatus: (teamId) => callApi({ action: 'getTeamStatus', teamId }),
  selectProblem: (teamId, problemId) => callApi({ action: 'selectProblem', teamId, problemId }),
  updateProblem: (problemId, title, description) => callApi({ action: 'updateProblem', problemId, title, description }),
  getAdminStatus: () => callApi({ action: 'getAdminStatus' })
};
