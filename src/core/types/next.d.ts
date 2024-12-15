import type { ReactNode } from 'react'

declare global {
	type PageProps<P = object> = P & {
		children: ReactNode
	}
}

export {}
