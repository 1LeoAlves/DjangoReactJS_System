import axios from 'axios';

const API = axios.create({
  baseURL: 'http://djangoreactjssystem-production.up.railway.app:2703/api',
});

export default API;
