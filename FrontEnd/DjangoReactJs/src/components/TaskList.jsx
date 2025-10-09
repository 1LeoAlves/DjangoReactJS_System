import React from 'react';
import { useTask } from '../contexts/TaskContext';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

const TaskList = () => {
  const { getFilteredTasks, filter } = useTask();
  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    return <EmptyState filter={filter} />;
  }

  return (
    <div className="task-list-container">
      <div className="task-list">
        {filteredTasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;