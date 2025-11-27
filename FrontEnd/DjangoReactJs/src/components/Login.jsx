import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");

  if (isAuthenticated) return navigate("/home");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const r = await login(form.username, form.password, form.rememberMe);

    if (!r.success) return setError(r.error);

    navigate("/home");
  };

  return (
    <div>
      <h2>Entrar</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Senha"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label>
          <input
            type="checkbox"
            checked={form.rememberMe}
            onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
          />
          Lembrar-me
        </label>

        <button>Entrar</button>
      </form>
    </div>
  );
}

export default Login;
