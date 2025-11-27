import axios from 'axios';

const API = axios.create({
  baseURL: 'https://djangoreactjssystem-production.up.railway.app/api',
});

export default API;
