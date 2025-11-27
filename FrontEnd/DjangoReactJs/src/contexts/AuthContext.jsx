import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega token e usuário do localStorage ao iniciar
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');

    if (token && username) {
      setIsAuthenticated(true);
      setUser(username);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  // Função de login
  const login = async (username, password, rememberMe) => {
    try {
      const response = await API.post('/token/', { username, password });
      const { access, refresh } = response.data;

      // Salva tokens e username
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('username', username);

      API.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      setIsAuthenticated(true);
      setUser(username);

      if (rememberMe) localStorage.setItem('rememberMe', 'true');
      else localStorage.removeItem('rememberMe');

      return { success: true };
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      return { success: false, error: 'Usuário ou senha incorretos.' };
    }
  };

  // Função de logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('rememberMe');

    delete API.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {loading ? <p>Carregando...</p> : children}
    </AuthContext.Provider>
  );
};
