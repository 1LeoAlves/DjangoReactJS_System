import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // username
  const [loading, setLoading] = useState(true);

  // ================================
  // RESTAURATION + ADAPTAÇÃO JWT
  // ================================
  useEffect(() => {
    const access = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    if (access && username) {
      setIsAuthenticated(true);
      setUser(username);
    }

    setLoading(false);
  }, []);

  // ================================
  // LOGIN (agora usando Django)
  // ================================
  const login = async (username, password, rememberMe) => {
    try {
      const response = await fetch("https://djangoreactjssystem-production.up.railway.app/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: "Usuário ou senha inválidos.",
        };
      }

      const data = await response.json();

      // salva tokens
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // mantém compatibilidade com seu código frontend
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("rememberMe", rememberMe);

      setIsAuthenticated(true);
      setUser(username);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Erro ao conectar com o servidor.",
      };
    }
  };

  // ================================
  // LOGOUT
  // ================================
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    if (localStorage.getItem("rememberMe") !== "true") {
      localStorage.clear();
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
