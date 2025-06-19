import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  isLoggedIn: boolean;
  memberId: number;
  profileId: number;
  name: string;
  gender: string;
  login: (memberId: number, profileId: number, name: string, gender: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      memberId: 0,
      profileId: 0,
      name: '',
      gender: 'MALE',
      login: (memberId, profileId, name, gender) => set({ isLoggedIn: true, memberId, profileId, name, gender }),
      logout: () => set({ isLoggedIn: false, memberId: 0, profileId: 0, name: '' }),
    }),
    {
      name: 'user-storage',
    }
  )
);
