import axios from "axios";

const API = axios.create({
  baseURL: "https://djangoreactjssystem-production.up.railway.app/api",
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        })
        .catch(Promise.reject);
    }

    isRefreshing = true;

    try {
      const refresh = localStorage.getItem("refresh_token");
      const res = await axios.post(
        "https://djangoreactjssystem-production.up.railway.app/api/token/refresh/",
        { refresh }
      );

      const newAccess = res.data.access;

      localStorage.setItem("access_token", newAccess);
      API.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;

      processQueue(null, newAccess);
      isRefreshing = false;

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return API(originalRequest);

    } catch (err) {
      processQueue(err, null);
      isRefreshing = false;

      localStorage.clear();
      window.location.href = "/login";

      return Promise.reject(err);
    }
  }
);

export default API;
