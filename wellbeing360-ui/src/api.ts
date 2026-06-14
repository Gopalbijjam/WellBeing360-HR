const BASE_URL = 'http://localhost:5201/api';

// Globally selected user ID to simulate authenticated sessions
let currentUserId = 1;
let authToken = localStorage.getItem('wellbeing360_token') || '';

export function setCurrentUserId(id: number) {
    currentUserId = id;
}

export function getCurrentUserId() {
    return currentUserId;
}

export function setAuthToken(token: string) {
    authToken = token;
    if (token) {
        localStorage.setItem('wellbeing360_token', token);
    } else {
        localStorage.removeItem('wellbeing360_token');
    }
}

export function getAuthToken() {
    return authToken;
}

async function request(path: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (currentUserId) {
        headers.set('X-User-Id', currentUserId.toString());
    }
    if (authToken) {
        headers.set('Authorization', `Bearer ${authToken}`);
    }

    const response = await fetch(`${BASE_URL}/${path}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorJson;
        try {
            errorJson = JSON.parse(errorText);
        } catch {
            // Not JSON
        }
        throw new Error(errorJson?.message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export const api = {
    // Auth & Users
    login: (data: any) => request('auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: any) => request('auth/register', { method: 'POST', body: JSON.stringify(data) }),
    getUsers: () => request('auth/users'),
    getUser: (id: number) => request(`users/${id}`),
    updateUser: (id: number, data: any) => request(`users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    createUser: (data: any) => request('users', { method: 'POST', body: JSON.stringify(data) }),

    // Benefits
    getPlans: () => request('benefitplans'),
    getPlan: (id: number) => request(`benefitplans/${id}`),
    createPlan: (data: any) => request('benefitplans', { method: 'POST', body: JSON.stringify(data) }),
    getBuckets: (planId: number) => request(`benefitplans/${planId}/buckets`),
    getWindows: () => request('enrolments/windows'),
    getCurrentWindow: () => request('enrolments/windows/current'),
    createWindow: (data: any) => request('enrolments/windows', { method: 'POST', body: JSON.stringify(data) }),
    enrol: (data: any) => request('enrolments/enrol', { method: 'POST', body: JSON.stringify(data) }),
    getMyEnrolments: () => request('enrolments/my-enrolments'),
    getMyDependents: () => request('enrolments/my-dependents'),
    addDependent: (data: any) => request('enrolments/my-dependents', { method: 'POST', body: JSON.stringify(data) }),
    removeDependent: (id: number) => request(`enrolments/dependents/${id}`, { method: 'DELETE' }),

    // Wellness
    getWellnessPrograms: () => request('wellness/programs'),
    createWellnessProgram: (data: any) => request('wellness/programs', { method: 'POST', body: JSON.stringify(data) }),
    getChallenges: (programId: number) => request(`wellness/programs/${programId}/challenges`),
    createChallenge: (data: any) => request('wellness/challenges', { method: 'POST', body: JSON.stringify(data) }),
    logActivity: (data: any) => request('wellness/log-activity', { method: 'POST', body: JSON.stringify(data) }),
    getMyLogs: () => request('wellness/my-logs'),
    getAllActivityLogs: () => request('wellness/all-logs'),
    getLeaderboard: (programId: number) => request(`wellness/programs/${programId}/leaderboard`),

    // EAP
    getEapServices: () => request('eap/services'),
    createEapService: (data: any) => request('eap/services', { method: 'POST', body: JSON.stringify(data) }),
    bookSession: (data: any) => request('eap/book', { method: 'POST', body: JSON.stringify(data) }),
    getMySessions: () => request('eap/my-sessions'),
    getAllSessions: () => request('eap/sessions'),
    updateSessionStatus: (id: number, status: string, counsellorRef: string) => 
        request(`eap/sessions/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, counsellorRef }) }),

    // Recognition
    nominateAward: (data: any) => request('recognition/nominate', { method: 'POST', body: JSON.stringify(data) }),
    getMyAwardsReceived: () => request('recognition/my-awards/received'),
    getMyAwardsSent: () => request('recognition/my-awards/sent'),
    getAllAwards: () => request('recognition/awards'),
    getAllPointsBalances: () => request('recognition/points'),
    getMyPoints: () => request('recognition/my-points'),
    getCatalog: () => request('recognition/catalog'),
    createCatalogItem: (data: any) => request('recognition/catalog', { method: 'POST', body: JSON.stringify(data) }),
    redeemItem: (itemId: number) => request('recognition/redeem', { method: 'POST', body: JSON.stringify({ itemId }) }),

    // Reports
    getReports: () => request('reports'),
    generateReport: (scope: string) => request(`reports/generate?scope=${scope}`, { method: 'POST' }),

    // Notifications
    getNotifications: () => request('notifications'),
    markNotificationRead: (id: number) => request(`notifications/${id}/read`, { method: 'PUT' })
};
