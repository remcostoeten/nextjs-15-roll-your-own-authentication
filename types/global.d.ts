import { ReactNode } from 'react'

declare global {
	type PageProps = {
		children?: ReactNode | ReactNode[]
	}
	type ChildrenProps = {
		children?: ReactNode
	}
}

// It's important to include this line to make it a module
export { }
