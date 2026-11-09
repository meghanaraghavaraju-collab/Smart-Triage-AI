const API_BASE = 'http://127.0.0.1:5000/api';

export const api = {
  // Patients
  async getPatients(search = '') {
    try {
      const url = search ? `${API_BASE}/patients?search=${encodeURIComponent(search)}` : `${API_BASE}/patients`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch patients list');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('[API Fallback] Using local patient data:', e.message);
      return null;
    }
  },

  async getPatientById(id) {
    try {
      const res = await fetch(`${API_BASE}/patients/${id}`);
      if (!res.ok) throw new Error('Failed to fetch patient');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('[API Fallback] Using local patient:', e.message);
      return null;
    }
  },

  // Triage & Assessment
  async getTriageQueue(filter = {}) {
    try {
      let query = '';
      if (filter.riskLevel) query += `?riskLevel=${filter.riskLevel}`;
      const res = await fetch(`${API_BASE}/triage/queue${query}`);
      if (!res.ok) throw new Error('Failed to fetch triage queue');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('[API Fallback] Using local queue data:', e.message);
      return null;
    }
  },

  async assessPatient(assessmentPayload) {
    const res = await fetch(`${API_BASE}/triage/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessmentPayload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.errors?.join(', ') || 'Failed to submit triage assessment');
    }
    return data.data;
  },

  async dispatchPatient(id, department) {
    try {
      const res = await fetch(`${API_BASE}/triage/${id}/dispatch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department }),
      });
      if (!res.ok) throw new Error('Dispatch failed');
      return await res.json();
    } catch (e) {
      console.warn('[API Fallback] Using local dispatch update:', e.message);
      return null;
    }
  },

  // Departments
  async getDepartments() {
    try {
      const res = await fetch(`${API_BASE}/departments`);
      if (!res.ok) throw new Error('Failed to fetch departments');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('[API Fallback] Using local departments:', e.message);
      return null;
    }
  },

  // Analytics
  async getOverviewStats() {
    try {
      const res = await fetch(`${API_BASE}/analytics/overview`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('[API Fallback] Using local analytics:', e.message);
      return null;
    }
  },

  // Auth
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return await res.json();
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await res.json();
  }
};
