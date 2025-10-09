import React from 'react';
import { ClipboardList } from 'lucide-react';

const EmptyState = ({ filter }) => {
  const getEmptyMessage = () => {
    switch (filter) {
      case 'pending':
        return {
          title: 'Nenhuma tarefa pendente',
          description: 'Todas as tarefas foram concluídas! 🎉'
        };
      case 'completed':
        return {
          title: 'Nenhuma tarefa concluída',
          description: 'Nenhuma tarefa foi concluída ainda'
        };
      default:
        return {
          title: 'Nenhuma tarefa ainda',
          description: 'Que tal começar adicionando sua primeira tarefa?'
        };
    }
  };

  const { title, description } = getEmptyMessage();

  return (
    <div className="task-list-container">
      <div className="empty-state">
        <div className="empty-icon">
          <ClipboardList size={64} />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default EmptyState;