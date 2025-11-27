import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  });

  const [error, setError] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);

  if (isAuthenticated) {
    return navigate("/home");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingBtn(true);

    const result = await login(
      formData.username,
      formData.password,
      formData.rememberMe
    );

    if (!result.success) {
      setError(result.error);
      setLoadingBtn(false);
      return;
    }

    navigate("/home");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Entrar</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Usuário"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />

      <input
        type="password"
        placeholder="Senha"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <label>
        <input
          type="checkbox"
          checked={formData.rememberMe}
          onChange={(e) =>
            setFormData({ ...formData, rememberMe: e.target.checked })
          }
        />
        Lembrar-me
      </label>

      <button disabled={loadingBtn}>
        {loadingBtn ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
};

export default Login;
