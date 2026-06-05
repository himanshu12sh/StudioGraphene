import axios from 'axios';
import { Task, TaskCounts } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TasksResponse {
  tasks: Task[];
  counts: TaskCounts;
}

export const taskService = {
  // Get tasks with optional filtering and search
  getTasks: async (status: string = 'all', search: string = ''): Promise<TasksResponse> => {
    const params = new URLSearchParams();
    if (status !== 'all') params.append('status', status);
    if (search) params.append('search', search);
    
    const response = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
    return response.data;
  },

  // Create a new task
  createTask: async (taskData: Partial<Task>): Promise<Task> => {
    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  },

  // Update an existing task
  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, taskData);
    return response.data;
  },

  toggleTask: async (id: string): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/toggle`);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Reorder tasks (for drag and drop)
  reorderTasks: async (tasks: Task[]): Promise<Task[]> => {
    const response = await api.put('/tasks/reorder/bulk', { tasks });
    return response.data.tasks;
  },
};