import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega sessão ao abrir página
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    if (token) {
      setIsAuthenticated(true);
      setUser(username);
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async (username, password, rememberMe) => {
    try {
      const resp = await API.post("/token/", { username, password });
      const { access, refresh } = resp.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("username", username);

      setIsAuthenticated(true);
      setUser(username);

      if (rememberMe) localStorage.setItem("rememberMe", "true");
      else localStorage.removeItem("rememberMe");

      return { success: true };

    } catch (err) {
      return { success: false, error: "Usuário ou senha incorretos." };
    }
  };

  // LOGOUT GLOBAL
  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      loading,
    }}>
      {loading ? <p>Carregando...</p> : children}
    </AuthContext.Provider>
  );
};
