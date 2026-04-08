import { useDroppable } from '@dnd-kit/core';
import { type Task, type TaskStatus } from '@/lib/api';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: { id: TaskStatus; title: string; color: string };
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function KanbanColumn({ column, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-lg border border-border bg-card/50 p-3 min-h-[400px] transition-colors',
        isOver && 'border-primary/50 bg-primary/5'
      )}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={cn('h-2 w-2 rounded-full', column.color)} />
        <span className="text-sm font-medium">{column.title}</span>
        <span className="text-xs text-muted-foreground ml-auto">{tasks.length}</span>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {tasks
          .sort((a, b) => a.position - b.position)
          .map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        {tasks.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">No tasks</p>
        )}
      </div>
    </div>
  );
}
