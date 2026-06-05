'use client';

import React from 'react';
import { FaEdit, FaTrash, FaCheck, FaUndo } from 'react-icons/fa';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status === 'active';

  const formatDueDate = (date: string | Date | undefined) => {
    if (!date) return null;
    const dateObj = new Date(date);
    
    if (isToday(dateObj)) return 'Today';
    if (isTomorrow(dateObj)) return 'Tomorrow';
    return format(dateObj, 'MMM dd, yyyy');
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${
        isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Toggle button */}
          <button
            onClick={() => onToggle(task._id)}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              task.status === 'completed'
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {task.status === 'completed' && <FaCheck size={10} />}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium text-gray-800 ${
                task.status === 'completed' ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`mt-1 text-sm ${
                  task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-3 mt-2">
              {task.dueDate && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isOverdue
                      ? 'bg-red-100 text-red-700 font-medium'
                      : task.status === 'completed'
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {isOverdue ? 'Overdue: ' : 'Due: '}
                  {formatDueDate(task.dueDate)}
                </span>
              )}
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {task.status === 'completed' ? 'Completed' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onToggle(task._id)}
            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
            title={task.status === 'completed' ? 'Mark as active' : 'Mark as completed'}
          >
            {task.status === 'completed' ? <FaUndo size={14} /> : <FaCheck size={14} />}
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit task"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete task"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}