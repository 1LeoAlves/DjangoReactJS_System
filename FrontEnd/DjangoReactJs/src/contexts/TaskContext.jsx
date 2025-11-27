import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const TaskContext = createContext();
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within a TaskProvider');
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // ================================
  // Load tasks from API on mount
  // ================================
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get('/tasks/');
        setTasks(res.data);
      } catch (err) {
        console.error('Erro ao carregar tarefas', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // ================================
  // Helpers
  // ================================
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addTask = async (text) => {
    if (!text.trim()) return null;
    try {
      const res = await API.post('/tasks/', { text, completed: false });
      setTasks(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error('Erro ao adicionar tarefa', err);
      return null;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await API.put(`/tasks/${id}/`, updates);
      setTasks(prev => prev.map(task => (task.id === id ? res.data : task)));
    } catch (err) {
      console.error('Erro ao atualizar tarefa', err);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const res = await API.put(`/tasks/${id}/`, {
        ...task,
        completed: !task.completed,
      });
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
