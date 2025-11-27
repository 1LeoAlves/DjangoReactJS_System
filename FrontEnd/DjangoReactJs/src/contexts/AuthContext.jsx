import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API from '../services/api';

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

  // Carrega tokens do localStorage ao iniciar
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

  // Login real com Django JWT
  const login = async (username, password, rememberMe) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password
      });

      const { access, refresh } = response.data;

      // Salva tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('username', username);

      // Configura axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      setIsAuthenticated(true);
      setUser(username);

      // Se lembrar, mantém flag
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      return {
        success: false,
        error: 'Usuário ou senha incorretos.'
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

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <p>Carregando...</p> : children}
    </AuthContext.Provider>
  );
};
