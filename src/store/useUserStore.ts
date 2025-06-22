import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  isLoggedIn: boolean;
  memberId: number;
  profileId: number;
  memberName: string;
  gender: string;
  login: (memberId: number, profileId: number, memberName: string, gender: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      memberId: 0,
      profileId: 0,
      memberName: '',
      gender: 'MALE',
      login: (memberId, profileId, memberName, gender) =>
        set({ isLoggedIn: true, memberId, profileId, memberName, gender }),
      logout: () => set({ isLoggedIn: false, memberId: 0, profileId: 0, memberName: '' }),
    }),
    {
      name: 'user-storage',
    }
  )
);
