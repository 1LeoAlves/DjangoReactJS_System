import axios from 'axios';

const API = axios.create({
  baseURL: "https://djangoreactjssystem-production.up.railway.app/api",
});

// injeta token automaticamente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
