import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
  theme: 'dark' | 'light';
  selectedTaskId: string | null;

  toggleSidebar: () => void;
  toggleAIPanel: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setSelectedTask: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  aiPanelOpen: false,
  theme: 'dark',
  selectedTaskId: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleAIPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
  setTheme: (theme) => {
    document.documentElement.classList.toggle('light', theme === 'light');
    set({ theme });
  },
  setSelectedTask: (id) => set({ selectedTaskId: id }),
}));
