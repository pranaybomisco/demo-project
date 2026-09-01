import React, { useState } from 'react';
import { TasksView } from '../views/tasks/tasksview.jsx';
import { Button } from '../views/components/button.jsx';
import { Plus } from 'lucide-react';
import { BUTTON_LABELS, UI_MESSAGES } from '../constants/index.js';

export const TasksPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{UI_MESSAGES.TASKS_TITLE}</h1>
          <p className="page-header-subtitle">{UI_MESSAGES.TASKS_SUBTITLE}</p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
        >
          {BUTTON_LABELS.NEW_TASK}
        </Button>
      </div>

      <TasksView
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
    </div>
  );
};

export default TasksPage;
