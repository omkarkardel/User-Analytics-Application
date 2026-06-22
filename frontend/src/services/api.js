import axios from 'axios';

// Backend base URL.
// By default we assume backend runs on http://localhost:4000
// (because server.js uses PORT=4000 from your current backend/.env).
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: BASE_URL,
});

