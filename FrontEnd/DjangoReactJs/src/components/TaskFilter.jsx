import React from 'react';
import { useTask } from '../contexts/TaskContext';

const TaskFilter = () => {
  const { filter, setFilter } = useTask();

  const filterOptions = [
    { value: 'all', label: 'Todas as tarefas' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'completed', label: 'Concluídas' }
  ];

  return (
    <div className="filter-controls">
      <select 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)}
        className="filter-select"
      >
        {filterOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TaskFilter;