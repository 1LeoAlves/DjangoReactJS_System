import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; // seu axios já configurado
import { CircleCheck as CheckCircle, Lock, User, CircleAlert as AlertCircle } from 'lucide-react';

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
      const response = await API.post('/users/', {
        username: formData.username,
        password: formData.password
      });

      // Salva tokens recebidos do backend
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('username', response.data.username);

      // Redireciona para /home após cadastro
      navigate('/home');
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
      setError('Não foi possível cadastrar. Tente outro usuário.');
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Cadastre-se</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
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

        <div className="form-group">
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

        <div className="form-group">
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

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
