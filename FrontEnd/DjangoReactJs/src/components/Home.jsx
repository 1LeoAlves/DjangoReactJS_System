import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navbar from './Navbar';
import StatsCards from './StatsCards';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter.jsx';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <Navbar />
      
      <div className="main-content">
        <div className="container">
          {/* Header Section */}
          <div className="welcome-header">
            <h1>
              <span className="welcome-icon">📋</span>
              Suas Tarefas
            </h1>
            <p>Organize e gerencie suas atividades diárias</p>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Task Controls */}
          <div className="task-controls">
            <div className="task-form-section">
              <TaskForm />
            </div>
            <div className="filter-section">
              <TaskFilter />
            </div>
          </div>

          {/* Task List */}
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Home;