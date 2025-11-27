import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { CircleCheck as CheckCircle, Lock, User, LogIn, CircleAlert as AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!formData.name.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não conferem.');
      setIsLoading(false);
      return;
    }

    try {
        const response = await API.post('/users/', {
        name: formData.name,
        password: formData.password
        });


      if (response.status === 201) {
        setSuccess('Cadastro realizado com sucesso! Redirecionando para login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Erro ao cadastrar:', err.response || err);
      if (err.response && err.response.data) {
        const messages = Object.entries(err.response.data)
          .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
          .join(' | ');
        setError(messages);
      } else {
        setError('Erro ao cadastrar usuário.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="right-section">
          <div className="login-form-container">
            <div className="login-header">
              <h2>Cadastro</h2>
              <p>Crie sua conta para começar</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    name="username"
                    placeholder="Usuário"
                    value={formData.name}
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
                {isLoading ? 'Cadastrando...' : <>
                  <LogIn size={20} /> Cadastrar
                </>}
              </button>
            </form>

            {error && (
              <div className="error-message">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="success-message">
                <CheckCircle size={20} />
                <span>{success}</span>
              </div>
            )}

            <div className="demo-info">
              <small>Já possui conta? <span className="link" onClick={() => navigate('/login')}>Faça login</span></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
