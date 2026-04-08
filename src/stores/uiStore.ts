import { create } from 'zustand';

type Theme = 'dark' | 'light';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
}

// Initialize from localStorage or system preference
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark'; // default dark
}

interface UIState {
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
  theme: Theme;
  selectedTaskId: string | null;

  toggleSidebar: () => void;
  toggleAIPanel: () => void;
  setTheme: (theme: Theme) => void;
  setSelectedTask: (id: string | null) => void;
}

const initialTheme = getInitialTheme();

// Apply dark class immediately on load
if (typeof document !== 'undefined') {
  applyTheme(initialTheme);
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  aiPanelOpen: false,
  theme: initialTheme,
  selectedTaskId: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleAIPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    set({ theme });
  },
  setSelectedTask: (id) => set({ selectedTaskId: id }),
}));
