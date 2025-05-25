import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TProps = {
	skipPasswordValidation: boolean;
	minRequiredPasswordLength: number;
	togglePasswordValidation: () => void;
};

export const useDevConfig = create<TProps>()(
	persist(
		(set) => ({
			skipPasswordValidation: false,
			minRequiredPasswordLength: 8,
			togglePasswordValidation: () =>
				set((state) => ({
					skipPasswordValidation: !state.skipPasswordValidation,
					minRequiredPasswordLength: state.skipPasswordValidation ? 8 : 0,
				})),
		}),
		{
			name: 'dev-config',
			skipHydration: typeof window === 'undefined',
		}
	)
);
