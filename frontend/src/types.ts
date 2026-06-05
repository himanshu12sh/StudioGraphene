export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: Date | string;
  status: 'active' | 'completed';
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCounts {
  active: number;
  completed: number;
}

export type FilterStatus = 'all' | 'active' | 'completed';