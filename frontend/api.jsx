/* global */
// Tio Patinhas — API client (browser global, no ES modules)

const API_BASE = "http://localhost:8000";

const api = {
  // Creates user or returns existing one (idempotent)
  async createOrGetUser(name, email) {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (!res.ok) throw new Error(`createOrGetUser failed: ${res.status}`);
    return res.json();
  },

  // Saves (or updates) financial profile for userId
  async saveProfile(userId, profileData) {
    const res = await fetch(`${API_BASE}/financial-profile/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error(`saveProfile failed: ${res.status}`);
    return res.json();
  },

  // Runs full analysis (Freud + Moriarty + Athena)
  async runFullAnalysis(userId) {
    const res = await fetch(`${API_BASE}/run-full-analysis/${userId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error(`runFullAnalysis failed: ${res.status}`);
    return res.json();
  },

  // Returns nodes for user
  async getNodes(userId) {
    const res = await fetch(`${API_BASE}/nodes/${userId}`);
    if (!res.ok) throw new Error(`getNodes failed: ${res.status}`);
    return res.json();
  },
};
