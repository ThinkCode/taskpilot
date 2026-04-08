import { create } from 'zustand';
import type { Task, TaskStatus } from '@/lib/api';

interface TaskState {
  tasks: Task[];
  filter: {
    status: TaskStatus | 'all';
    priority: string;
    search: string;
  };
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus, newPosition: number) => void;
  setFilter: (filter: Partial<TaskState['filter']>) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  filter: { status: 'all', priority: 'all', search: '' },

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  moveTask: (taskId, newStatus, newPosition) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, position: newPosition } : t
      ),
    })),
  setFilter: (filter) =>
    set((s) => ({ filter: { ...s.filter, ...filter } })),
}));
