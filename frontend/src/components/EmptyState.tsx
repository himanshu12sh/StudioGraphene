import React from 'react';
import { FaClipboardList } from 'react-icons/fa';

interface EmptyStateProps {
  filter: string;
  search: string;
}

export default function EmptyState({ filter, search }: EmptyStateProps) {
  const getMessage = () => {
    if (search) {
      return `No tasks found matching "${search}"`;
    }
    switch (filter) {
      case 'active':
        return 'No active tasks';
      case 'completed':
        return 'No completed tasks';
      default:
        return 'No tasks yet';
    }
  };

  const getSubMessage = () => {
    if (search) {
      return 'Try adjusting your search terms';
    }
    if (filter !== 'all') {
      return `You don't have any ${filter} tasks`;
    }
    return 'Click the "Add Task" button to create your first task';
  };

  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <FaClipboardList className="text-gray-400" size={32} />
      </div>
      <h3 className="text-lg font-medium text-gray-600 mb-2">{getMessage()}</h3>
      <p className="text-sm text-gray-500">{getSubMessage()}</p>
    </div>
  );
}