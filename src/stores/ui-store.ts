import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: 'ui-storage',
    }
  )
);

interface NotificationState {
  pendingPaymentsCount: number;
  overduePaymentsCount: number;
  setPendingPaymentsCount: (count: number) => void;
  setOverduePaymentsCount: (count: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  pendingPaymentsCount: 0,
  overduePaymentsCount: 0,
  setPendingPaymentsCount: (count) => set({ pendingPaymentsCount: count }),
  setOverduePaymentsCount: (count) => set({ overduePaymentsCount: count }),
}));
