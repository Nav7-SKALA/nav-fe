import { create } from 'zustand';

interface LayoutState {
  isSidebarOpen: boolean;
  headerType: 'default' | 'simple';
  toggleSidebar: () => void;
  setHeaderType: (type: 'default' | 'simple') => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarOpen: true,
  headerType: 'simple',
  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
      headerType: state.isSidebarOpen ? 'simple' : 'default',
    })),
  setHeaderType: (type) => set({ headerType: type }),
}));
