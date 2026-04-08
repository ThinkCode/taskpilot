import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, toggleAIPanel } = useUIStore();
  const location = useLocation();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300',
          sidebarOpen ? 'w-56' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border px-4">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">TP</span>
              </div>
              <span className="font-semibold text-sm">TaskPilot</span>
            </div>
          ) : (
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-sm">TP</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Tooltip key={to} delayDuration={0}>
              <TooltipTrigger asChild>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                      !sidebarOpen && 'justify-center px-2'
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {sidebarOpen && <span>{label}</span>}
                </NavLink>
              </TooltipTrigger>
              {!sidebarOpen && <TooltipContent side="right">{label}</TooltipContent>}
            </Tooltip>
          ))}

          {/* AI Button */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={toggleAIPanel}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-muted-foreground hover:bg-secondary hover:text-foreground',
                  !sidebarOpen && 'justify-center px-2'
                )}
              >
                <Sparkles className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>AI Assistant</span>}
              </button>
            </TooltipTrigger>
            {!sidebarOpen && <TooltipContent side="right">AI Assistant</TooltipContent>}
          </Tooltip>
        </nav>

        {/* Collapse button */}
        <div className="absolute bottom-4 left-0 right-0 px-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn('w-full', !sidebarOpen && 'justify-center')}
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
