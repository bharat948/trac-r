import { create } from 'zustand';

export interface User {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  initialize: () => void;
}

// Load user from localStorage
const loadUser = (): User | null => {
  try {
    const stored = localStorage.getItem('auth-user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Save user to localStorage
const saveUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('auth-user', JSON.stringify(user));
  } else {
    localStorage.removeItem('auth-user');
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  initialize: () => {
    const savedUser = loadUser();
    if (savedUser) {
      set({
        user: savedUser,
        isAuthenticated: true,
      });
    }
  },
  
  setUser: (user) => {
    saveUser(user);
    set({
      user,
      isAuthenticated: !!user,
    });
  },
  
  logout: () => {
    saveUser(null);
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));

