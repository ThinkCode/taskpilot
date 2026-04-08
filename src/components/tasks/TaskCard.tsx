import { useDraggable } from '@dnd-kit/core';
import { type Task } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Calendar, GripVertical, ListChecks } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  isDragOverlay?: boolean;
}

const PRIORITY_COLORS = {
  low: 'bg-green-500/10 text-green-500 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  urgent: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export function TaskCard({ task, onClick, isDragOverlay }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const isOverdue =
    task.due_date && task.status !== 'done' && isPast(new Date(task.due_date));
  const isDueToday = task.due_date && isToday(new Date(task.due_date));
  const subtaskCount = task.subtasks?.length ?? 0;
  const subtasksDone = task.subtasks?.filter((s) => s.done).length ?? 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group rounded-lg border border-border bg-card p-3 cursor-pointer hover:border-primary/50 transition-colors',
        isDragging && 'opacity-50',
        isDragOverlay && 'shadow-lg rotate-3',
        isOverdue && 'border-red-500/30'
      )}
      onClick={onClick}
    >
      {/* Drag handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-5 flex items-center justify-center opacity-0 group-hover:opacity-50 cursor-grab"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3" />
      </div>

      <div className="pl-3">
        {/* Title */}
        <p className="text-sm font-medium mb-2 line-clamp-2">{task.title}</p>

        {/* Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', PRIORITY_COLORS[task.priority])}>
            {task.priority}
          </Badge>

          {task.due_date && (
            <Badge
              variant="outline"
              className={cn(
                'text-[10px] px-1.5 py-0 gap-1',
                isOverdue && 'bg-red-500/10 text-red-500 border-red-500/20',
                isDueToday && !isOverdue && 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
              )}
            >
              <Calendar className="h-2.5 w-2.5" />
              {format(new Date(task.due_date), 'MMM d')}
            </Badge>
          )}

          {subtaskCount > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
              <ListChecks className="h-2.5 w-2.5" />
              {subtasksDone}/{subtaskCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
