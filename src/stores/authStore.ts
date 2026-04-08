import { create } from 'zustand';

const AUTH_KEY = 'taskpilot_auth';

interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

function hashPassword(input: string): string {
  // Simple hash for gatekeeper — not production crypto
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(16);
}

const VALID_USERNAME = 'kkiran';
const VALID_PASSWORD_HASH = hashPassword('mytaskpilot309');

function loadSession(): boolean {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored === 'authenticated';
  } catch {
    return false;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: loadSession(),
  login: (username: string, password: string) => {
    if (username === VALID_USERNAME && hashPassword(password) === VALID_PASSWORD_HASH) {
      localStorage.setItem(AUTH_KEY, 'authenticated');
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    set({ isAuthenticated: false });
  },
}));
