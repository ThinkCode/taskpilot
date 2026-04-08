import { Moon, Sun, Search, Sparkles } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const { theme, setTheme, toggleAIPanel, sidebarOpen } = useUIStore();

  return (
    <header
      className="fixed top-0 right-0 z-30 h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-4 gap-4"
      style={{ left: sidebarOpen ? '224px' : '64px' }}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks and projects..."
          className="pl-9 h-9 bg-secondary border-none"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* AI Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleAIPanel} className="h-9 w-9">
          <Sparkles className="h-4 w-4" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
