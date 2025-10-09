import React from 'react';
import { useTask } from '../contexts/TaskContext';
import { List, Clock, CircleCheck as CheckCircle } from 'lucide-react';

const StatsCards = () => {
  const { getStats } = useTask();
  const { total, pending, completed } = getStats();

  const stats = [
    {
      title: 'Total de Tarefas',
      value: total,
      icon: List,
      color: 'blue'
    },
    {
      title: 'Pendentes',
      value: pending,
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Concluídas',
      value: completed,
      icon: CheckCircle,
      color: 'green'
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">
              <IconComponent size={24} />
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;