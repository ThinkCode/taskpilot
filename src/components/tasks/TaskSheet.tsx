import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type Task, type TaskStatus, type TaskPriority } from '@/lib/api';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TaskSheetProps {
  task: Task;
  open: boolean;
  onClose: () => void;
}

export function TaskSheet({ task, open, onClose }: TaskSheetProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [newSubtask, setNewSubtask] = useState('');

  const updateTask = useMutation({
    mutationFn: (data: Partial<Task>) => api.updateTask(task.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', task.project_id] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: () => api.deleteTask(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', task.project_id] });
      onClose();
      toast.success('Task deleted');
    },
  });

  const addSubtask = useMutation({
    mutationFn: () => api.createSubtask(task.id, { title: newSubtask }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', task.project_id] });
      setNewSubtask('');
    },
  });

  const toggleSubtask = useMutation({
    mutationFn: (subtaskId: string) =>
      api.updateSubtask(subtaskId, {
        done: !task.subtasks?.find((s) => s.id === subtaskId)?.done,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', task.project_id] });
    },
  });

  const deleteSubtask = useMutation({
    mutationFn: (subtaskId: string) => api.deleteSubtask(subtaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', task.project_id] });
    },
  });

  const handleTitleBlur = () => {
    if (title !== task.title) {
      updateTask.mutate({ title });
    }
  };

  const handleDescBlur = () => {
    if (description !== task.description) {
      updateTask.mutate({ description });
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="sr-only">Task Details</SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="text-lg font-medium border-none px-0 focus-visible:ring-0"
          />

          {/* Status & Priority */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <Select
                value={task.status}
                onValueChange={(v) => updateTask.mutate({ status: v as TaskStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
              <Select
                value={task.priority}
                onValueChange={(v) => updateTask.mutate({ priority: v as TaskPriority })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Due Date</label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {task.due_date ? format(new Date(task.due_date), 'PPP') : 'Pick a date'}
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={task.due_date ? new Date(task.due_date) : undefined}
                  onSelect={(date) =>
                    updateTask.mutate({ due_date: date?.toISOString() ?? null })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescBlur}
              placeholder="Add a description..."
              rows={4}
            />
          </div>

          {/* Subtasks */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">
              Subtasks ({task.subtasks?.filter((s) => s.done).length ?? 0}/
              {task.subtasks?.length ?? 0})
            </label>
            <div className="space-y-2">
              {task.subtasks?.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 group">
                  <Checkbox
                    checked={subtask.done}
                    onCheckedChange={() => toggleSubtask.mutate(subtask.id)}
                  />
                  <span
                    className={cn(
                      'text-sm flex-1',
                      subtask.done && 'line-through text-muted-foreground'
                    )}
                  >
                    {subtask.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={() => deleteSubtask.mutate(subtask.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newSubtask.trim()) addSubtask.mutate();
              }}
              className="flex gap-2 mt-2"
            >
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add subtask..."
                className="h-8 text-sm"
              />
              <Button type="submit" size="sm" disabled={!newSubtask.trim()}>
                <Plus className="h-3 w-3" />
              </Button>
            </form>
          </div>

          {/* Delete */}
          <Button
            variant="ghost"
            className="w-full text-red-500 hover:text-red-500 hover:bg-red-500/10"
            onClick={() => deleteTask.mutate()}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Task
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
