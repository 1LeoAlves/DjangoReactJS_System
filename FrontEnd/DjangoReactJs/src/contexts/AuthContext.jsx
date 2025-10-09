import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Check if user is logged in on app start
    const savedAuth = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('username');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = (username, password, rememberMe) => {
    // Simple validation - accept any non-empty credentials
    if (username.trim().length >= 2 && password.trim().length >= 2) {
      setIsAuthenticated(true);
      setUser(username);
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      localStorage.setItem('rememberMe', rememberMe);
      
      return { success: true };
    }
    
    return { 
      success: false, 
      error: 'Usuário deve ter pelo menos 2 caracteres e senha pelo menos 2 caracteres.' 
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    
    if (localStorage.getItem('rememberMe') !== 'true') {
      localStorage.clear();
    }
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
      {children}
    </AuthContext.Provider>
  );
};