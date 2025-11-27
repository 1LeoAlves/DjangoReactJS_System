import React, { useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import { Plus } from 'lucide-react';

const TaskForm = () => {
  const [taskText, setTaskText] = useState('');
  const { addTask } = useTask();

  // ------------------------------
  // Notification system
  // ------------------------------
  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskText.trim()) return;

    const created = addTask(taskText);
    if (!created) return;

    setTaskText('');
    showNotification('Tarefa adicionada com sucesso!', 'success');
  };

  return (
    <div className="task-form-card">
      <form onSubmit={handleSubmit} className="task-form">
        <div className="input-group">
          <div className="input-icon">
            <Plus size={20} />
          </div>

          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Digite sua nova tarefa..."
            required
          />

          <button type="submit" className="btn-primary">
            <Plus size={16} />
            Adicionar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
