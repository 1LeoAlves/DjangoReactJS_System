import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircleCheck as CheckCircle, CreditCard as Edit, Smartphone, User, Lock, LogIn, CircleAlert as AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Auto-fill if user was remembered
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const savedUsername = localStorage.getItem('username');
    
    if (rememberMe && savedUsername) {
      setFormData(prev => ({
        ...prev,
        username: savedUsername,
        rememberMe: true
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    const result = login(formData.username, formData.password, formData.rememberMe);
    
    if (result.success) {
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } else {
      setError(result.error);
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
                <Edit size={20} />
                <span>Edite e organize como quiser</span>
              </div>
              <div className="feature-item">
                <Smartphone size={20} />
                <span>Interface responsiva</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="login-form-container">
            <div className="login-header">
              <h2>Bem-vindo de volta!</h2>
              <p>Entre com suas credenciais para continuar</p>
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

              <div className="form-check">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe">Lembrar de mim</label>
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Entrar
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="error-message">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="demo-info">
              <small>Demo: Use qualquer usuário e senha para entrar</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;