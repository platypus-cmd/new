
import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { getUserData, updateTasks } from '@/utils/localStorage';

interface TaskItemProps {
  task: {
    id: string;
    text: string;
    completed: boolean;
  };
  onStatusChange?: (id: string, completed: boolean) => void;
}

const TaskItem = ({ task, onStatusChange }: TaskItemProps) => {
  const [isChecked, setIsChecked] = useState(task.completed);
  
  const handleCheckChange = () => {
    const newStatus = !isChecked;
    setIsChecked(newStatus);
    
    // Update local state and call parent handler if provided
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
    
    // Direct update to localStorage if no parent handler
    else {
      const userData = getUserData();
      const updatedTasks = userData.tasks.map(t => 
        t.id === task.id ? { ...t, completed: newStatus } : t
      );
      updateTasks(updatedTasks);
    }
  };
  
  // Sync with external changes
  useEffect(() => {
    setIsChecked(task.completed);
  }, [task.completed]);
  
  return (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-100 last:border-0">
      <Checkbox 
        id={`task-${task.id}`} 
        checked={isChecked} 
        onCheckedChange={handleCheckChange}
        className="h-5 w-5 border-gray-300"
      />
      <label 
        htmlFor={`task-${task.id}`} 
        className={`flex-grow text-base ${isChecked ? 'line-through text-gray-400' : 'text-gray-800'}`}
      >
        {task.text}
      </label>
    </div>
  );
};

export default TaskItem;
