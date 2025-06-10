import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutState {
  isSidebarOpen: boolean;
  headerType: 'default' | 'simple';
  toggleSidebar: () => void;
  setHeaderType: (type: 'default' | 'simple') => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      isSidebarOpen: false,
      headerType: 'simple',
      toggleSidebar: () => {
        const cur = get().isSidebarOpen;
        set({
          isSidebarOpen: !cur,
          headerType: cur ? 'default' : 'simple',
        });
      },
      setHeaderType: (type) => set({ headerType: type }),
    }),
    {
      name: 'layout-storage',
    }
  )
);
