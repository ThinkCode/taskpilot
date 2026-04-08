import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type Task, type TaskStatus } from '@/lib/api';
import { useTaskStore } from '@/stores/taskStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Plus } from 'lucide-react';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { TaskSheet } from '@/components/tasks/TaskSheet';
import { toast } from 'sonner';

export function ProjectDetail() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setTasks } = useTaskStore();
  const { selectedTaskId, setSelectedTask } = useUIStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.getProject(projectId!),
    enabled: !!projectId,
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => api.getTasks(projectId!),
    enabled: !!projectId,
  });

  // Sync tasks to store
  if (tasks) {
    setTasks(tasks);
  }

  const createTask = useMutation({
    mutationFn: (title: string) =>
      api.createTask(projectId!, { title, status: 'todo', priority: 'medium' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      setNewTaskTitle('');
      toast.success('Task created');
    },
    onError: (err) => toast.error(err.message),
  });

  const updateTask = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      api.updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  if (projectLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    updateTask.mutate({ id: taskId, status: newStatus });
  };

  const selectedTask = tasks?.find((t) => t.id === selectedTaskId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h1 className="text-2xl font-bold">{project.name}</h1>
        </div>
      </div>

      {/* Quick add */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newTaskTitle.trim()) createTask.mutate(newTaskTitle.trim());
        }}
        className="flex gap-2"
      >
        <Input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a task..."
          className="max-w-md"
        />
        <Button type="submit" disabled={!newTaskTitle.trim() || createTask.isPending}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </form>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={tasks ?? []}
        onTaskMove={handleTaskMove}
        onTaskClick={(task) => setSelectedTask(task.id)}
        isLoading={tasksLoading}
      />

      {/* Task Detail Sheet */}
      {selectedTask && (
        <TaskSheet
          task={selectedTask}
          open={!!selectedTaskId}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
