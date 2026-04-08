import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderKanban, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';

export function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Active Projects',
      value: stats?.total_projects ?? 0,
      icon: FolderKanban,
      color: 'text-blue-500',
    },
    {
      title: 'Total Tasks',
      value: stats?.total_tasks ?? 0,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      title: 'Due Today',
      value: stats?.tasks_due_today ?? 0,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      title: 'Overdue',
      value: stats?.overdue_tasks ?? 0,
      icon: AlertTriangle,
      color: 'text-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your projects and tasks</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Projects</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {projects?.slice(0, 6).map((project) => (
            <Card key={project.id} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {project.task_count ?? 0} tasks
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!projects || projects.length === 0) && (
            <p className="text-muted-foreground text-sm col-span-full">
              No projects yet. Create one to get started.
            </p>
          )}
        </div>
      </div>

      {/* Completed this week */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.completed_this_week ?? 0}</div>
          <p className="text-xs text-muted-foreground mt-1">tasks finished</p>
        </CardContent>
      </Card>
    </div>
  );
}
