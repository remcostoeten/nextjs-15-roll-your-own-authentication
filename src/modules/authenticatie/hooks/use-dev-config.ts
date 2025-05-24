import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DevConfig {
  skipPasswordValidation: boolean;
  togglePasswordValidation: () => void;
}

export const useDevConfig = create<DevConfig>()(
  persist(
    (set) => ({
      skipPasswordValidation: false,
      togglePasswordValidation: () => set((state) => ({
        skipPasswordValidation: !state.skipPasswordValidation
      })),
    }),
    {
      name: 'dev-config',
    }
  )
);
