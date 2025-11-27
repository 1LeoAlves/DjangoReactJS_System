import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { CircleCheck as CheckCircle, User, Lock, CircleAlert as AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.username.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    try {
      // Criação do usuário no backend
      await API.post('/users/', {
        username: formData.username,
        password: formData.password
      });

      // Redireciona para login após cadastro
      navigate('/login');
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
      setError('Não foi possível cadastrar. Tente outro usuário.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Left Section */}
        <div className="left-section">
          <div className="welcome-content">
            <div className="logo-section">
              <div className="logo-icon">
                <CheckCircle size={64} />
              </div>
              <h1>TaskFlow</h1>
            </div>
            <p className="lead">Organize suas tarefas de forma inteligente e produtiva</p>
            <div className="features">
              <div className="feature-item">
                <CheckCircle size={20} />
                <span>Gerencie suas tarefas facilmente</span>
              </div>
              <div className="feature-item">
                <Lock size={20} />
                <span>Mantenha suas informações seguras</span>
              </div>
              <div className="feature-item">
                <User size={20} />
                <span>Crie sua conta em segundos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="login-form-container">
            <div className="login-header">
              <h2>Cadastre-se</h2>
              <p>Crie sua conta para começar a organizar suas tarefas</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    name="username"
                    placeholder="Usuário"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirme a senha"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </button>

              {error && (
                <div className="error-message">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <div className="demo-info">
                <small>Já tem uma conta? <button type="button" onClick={() => navigate('/login')}>Entre aqui</button></small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
