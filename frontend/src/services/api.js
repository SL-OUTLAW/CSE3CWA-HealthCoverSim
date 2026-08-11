import axios from "axios";

const BACKEND_PORT = 5678;

// axios instance
const api = axios.create({
  baseURL: `http://localhost:${BACKEND_PORT}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
