const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

// Projects
export const api = {
  // Projects
  getProjects: () => request<Project[]>('/projects'),
  getProject: (id: string) => request<Project>(`/projects/${id}`),
  createProject: (data: CreateProject) =>
    request<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: Partial<CreateProject>) =>
    request<Project>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) =>
    request<void>(`/projects/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: (projectId: string) => request<Task[]>(`/projects/${projectId}/tasks`),
  getTask: (id: string) => request<Task>(`/tasks/${id}`),
  createTask: (projectId: string, data: CreateTask) =>
    request<Task>(`/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: string, data: Partial<CreateTask>) =>
    request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateTaskPosition: (id: string, status: string, position: number) =>
    request<Task>(`/tasks/${id}/position`, { method: 'PUT', body: JSON.stringify({ status, position }) }),
  deleteTask: (id: string) =>
    request<void>(`/tasks/${id}`, { method: 'DELETE' }),

  // Subtasks
  createSubtask: (taskId: string, data: { title: string }) =>
    request<Subtask>(`/tasks/${taskId}/subtasks`, { method: 'POST', body: JSON.stringify(data) }),
  updateSubtask: (id: string, data: Partial<Subtask>) =>
    request<Subtask>(`/subtasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSubtask: (id: string) =>
    request<void>(`/subtasks/${id}`, { method: 'DELETE' }),

  // Stats
  getStats: () => request<DashboardStats>('/stats'),

  // AI
  sendChatMessage: (message: string, contextType?: string, contextId?: string) =>
    fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context_type: contextType, context_id: contextId }),
    }),
};

// Types
export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  status: 'active' | 'archived';
  task_count?: number;
  completed_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProject {
  name: string;
  description?: string;
  color?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  position: number;
  subtasks?: Subtask[];
  created_at: string;
  updated_at: string;
}

export interface CreateTask {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  done: boolean;
  position: number;
}

export interface DashboardStats {
  total_projects: number;
  total_tasks: number;
  tasks_due_today: number;
  overdue_tasks: number;
  completed_this_week: number;
  tasks_by_status: Record<string, number>;
  tasks_by_priority: Record<string, number>;
}
