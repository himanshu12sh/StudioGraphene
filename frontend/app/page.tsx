'use client';

import  { useState, useEffect, useCallback } from 'react';

import { FaPlus, FaSearch } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { FilterStatus, Task } from '@/src/types';
import { taskService, TasksResponse } from '@/src/services';
import EmptyState from '@/src/components/EmptyState';
import TaskCard from '@/src/components/TaskCard';
import TaskForm from '@/src/components/TaskForm';
import ConfirmDialog from '@/src/components/ConfirmDialog';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [counts, setCounts] = useState({ active: 0, completed: 0 });
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data: TasksResponse = await taskService.getTasks(filter, search);
      setTasks(data.tasks);
      setCounts(data.counts);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (taskData: Partial<Task>) => {
    try {
      await taskService.createTask(taskData);
      await fetchTasks();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;
    try {
      await taskService.updateTask(editingTask._id, taskData);
      await fetchTasks();
      setIsFormOpen(false);
      setEditingTask(undefined);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      await taskService.toggleTask(id);
      await fetchTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      await fetchTasks();
      setDeletingTaskId(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);

    try {
      await taskService.reorderTasks(items);
    } catch (error) {
      console.error('Error reordering tasks:', error);
      await fetchTasks(); 
    }
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Manager</h1>
          <p className="text-gray-600">By Himanshu Sharma</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-sm text-gray-500">Active</span>
                <span className="ml-2 font-semibold text-yellow-600">{counts.active}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Completed</span>
                <span className="ml-2 font-semibold text-green-600">{counts.completed}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Total</span>
                <span className="ml-2 font-semibold text-blue-600">{counts.active + counts.completed}</span>
              </div>
            </div>
            <button
              onClick={openAddForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaPlus size={14} />
              Add Task
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'completed'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState filter={filter} search={search} />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {tasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onToggle={handleToggleTask}
                            onEdit={openEditForm}
                            onDelete={setDeletingTaskId}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        task={editingTask}
      />

      <ConfirmDialog
        isOpen={!!deletingTaskId}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => deletingTaskId && handleDeleteTask(deletingTaskId)}
        onCancel={() => setDeletingTaskId(null)}
      />
    </div>
  );
}