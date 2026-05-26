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

  async getSelic() {
    const res = await fetch(`${API_BASE}/market/selic`);
    if (!res.ok) throw new Error(`getSelic failed: ${res.status}`);
    return res.json();
  },

  async getIpca() {
    const res = await fetch(`${API_BASE}/market/ipca`);
    if (!res.ok) throw new Error(`getIpca failed: ${res.status}`);
    return res.json();
  },

  async getPoupanca() {
    const res = await fetch(`${API_BASE}/market/poupanca`);
    if (!res.ok) throw new Error(`getPoupanca failed: ${res.status}`);
    return res.json();
  },

  async getCdi() {
    const res = await fetch(`${API_BASE}/market/cdi`);
    if (!res.ok) throw new Error(`getCdi failed: ${res.status}`);
    return res.json();
  },

  async getQuote(ticker) {
    const res = await fetch(`${API_BASE}/market/quote/${encodeURIComponent(ticker)}`);
    if (!res.ok) throw new Error(`getQuote failed: ${res.status}`);
    return res.json();
  },

  async getFundQuota(cnpj) {
    const res = await fetch(`${API_BASE}/market/fund/${encodeURIComponent(cnpj)}/quota`);
    if (!res.ok) throw new Error(`getFundQuota failed: ${res.status}`);
    return res.json();
  },

  async askRag(userId, question) {
    const res = await fetch(`${API_BASE}/rag/ask/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error(`askRag failed: ${res.status}`);
    return res.json();
  },
};
