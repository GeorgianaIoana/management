import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'teacher' | null;

interface AuthState {
  user: User | null;
  role: UserRole;
  teacherId: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole) => void;
  setTeacherId: (teacherId: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      teacherId: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
      setTeacherId: (teacherId) => set({ teacherId }),
      setIsLoading: (isLoading) => set({ isLoading }),
      clear: () => set({ user: null, role: null, teacherId: null, isLoading: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        role: state.role,
        teacherId: state.teacherId,
      }),
    }
  )
);
