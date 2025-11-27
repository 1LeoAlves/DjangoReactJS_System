import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// URL base da sua API (do Railway)
const API_URL = import.meta.env.VITE_API_URL || "https://djangoreactjssystem-production.up.railway.app";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega tokens ao iniciar
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');

    if (token) {
      setIsAuthenticated(true);
      setUser(username);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // Login usando Django JWT
  const login = async (username, password, rememberMe) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/token/`,
        { username, password }
      );

      const { access, refresh } = response.data;

      // Salvar tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('username', username);

      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      setIsAuthenticated(true);
      setUser(username);

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      return { success: true };

    } catch (error) {
      console.error("Erro ao autenticar:", error.response?.data || error.message);

      return {
        success: false,
        error: "Usuário ou senha incorretos ou servidor indisponível."
      };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('rememberMe');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {loading ? <p>Carregando...</p> : children}
    </AuthContext.Provider>
  );
};
