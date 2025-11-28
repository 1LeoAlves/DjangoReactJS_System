import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within a TaskProvider');
  return context;
};

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState(null); // null = não carregado ainda
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // ================================
  // Load tasks from API after login
  // ================================
  useEffect(() => {
    const fetchTasks = async () => {
      if (!isAuthenticated) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        const res = await API.get('/tasks/');
        setTasks(res.data);
      } catch (err) {
        console.error('Erro ao carregar tarefas', err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchTasks();
  }, [isAuthenticated, authLoading]);

  // ================================
  // Helpers
  // ================================
const addTask = async (title) => {
  if (!title.trim()) return null;
  try {
    const res = await API.post('/tasks/', { 
      title: title,
      completed: false 
    });
    setTasks(prev => [...prev, res.data]);
    return res.data;
  } catch (err) {
    console.error('Erro ao adicionar tarefa', err);
    return null;
  }
};

  const updateTask = async (id, updates) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const res = await API.put(`/tasks/${id}/`, { ...task, ...updates });
      setTasks(prev => prev.map(t => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error('Erro ao atualizar tarefa', err);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const res = await API.put(`/tasks/${id}/`, { ...task, completed: !task.completed });
      setTasks(prev => prev.map(t => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error('Erro ao alternar tarefa', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}/`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Erro ao deletar tarefa', err);
    }
  };

  const getFilteredTasks = () => {
    if (!tasks) return [];
    switch (filter) {
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  const getStats = () => {
    if (!tasks) return { total: 0, completed: 0, pending: 0 };
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const value = {
    tasks,
    filter,
    setFilter,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    getFilteredTasks,
    getStats,
    loading,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
