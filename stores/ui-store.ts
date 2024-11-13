import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UIState = {
	closedSections: Record<string, boolean>
	closeSection: (sectionId: string) => void
	openSection: (sectionId: string) => void
	toggleSection: (sectionId: string) => void
	isSectionClosed: (sectionId: string) => boolean
}

export const useUIStore = create<UIState>()(
	persist(
		(set, get) => ({
			closedSections: {},
			closeSection: (sectionId: string) =>
				set((state) => ({
					closedSections: {
						...state.closedSections,
						[sectionId]: true
					}
				})),
			openSection: (sectionId: string) =>
				set((state) => ({
					closedSections: {
						...state.closedSections,
						[sectionId]: false
					}
				})),
			toggleSection: (sectionId: string) =>
				set((state) => ({
					closedSections: {
						...state.closedSections,
						[sectionId]: !state.closedSections[sectionId]
					}
				})),
			isSectionClosed: (sectionId: string) =>
				get().closedSections[sectionId] || false
		}),
		{
			name: 'ui-storage',
			skipHydration: true // Important for Next.js
		}
	)
)
