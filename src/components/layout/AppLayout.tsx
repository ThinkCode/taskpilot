import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AIChatPanel } from '@/components/ai/AIChatPanel';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';

export function AppLayout() {
  const { sidebarOpen, aiPanelOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <main
        className={cn(
          'pt-14 min-h-screen transition-all duration-300',
          sidebarOpen ? 'ml-56' : 'ml-16',
          aiPanelOpen ? 'mr-80' : ''
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      <AIChatPanel />
      <Toaster />
    </div>
  );
}
