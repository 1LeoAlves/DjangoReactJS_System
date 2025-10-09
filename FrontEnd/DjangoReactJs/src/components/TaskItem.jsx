import React, { useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import { CreditCard as Edit2, Trash2, Check, X } from 'lucide-react';

const TaskItem = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const { toggleTask, updateTask, deleteTask } = useTask();

  const handleToggle = () => {
    toggleTask(task.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(task.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      updateTask(task.id, { text: editText.trim() });
      setIsEditing(false);
      showNotification('Tarefa atualizada!', 'success');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(task.text);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTask(task.id);
      showNotification('Tarefa excluída!', 'warning');
    }
  };

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

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggle}
        className="task-checkbox"
      />
      
      {isEditing ? (
        <div className="task-edit">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="task-edit-input"
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <div className="task-edit-actions">
            <button onClick={handleSave} className="btn-save">
              <Check size={16} />
            </button>
            <button onClick={handleCancel} className="btn-cancel">
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="task-text">{task.text}</p>
          <div className="task-actions">
            <button onClick={handleEdit} className="btn-edit" title="Editar">
              <Edit2 size={16} />
            </button>
            <button onClick={handleDelete} className="btn-delete" title="Excluir">
              <Trash2 size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;