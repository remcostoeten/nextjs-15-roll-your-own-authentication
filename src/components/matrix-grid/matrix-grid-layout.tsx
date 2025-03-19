import type { ReactNode } from 'react'
import styles from './matrix-grid.module.css'

interface MatrixGridLayoutProps {
	children: ReactNode
}

export default function MatrixGridLayout({ children }: MatrixGridLayoutProps) {
	return (
		<div
			className={styles.layout}
			id="matrix-grid-section"
		>
			{children}
		</div>
	)
}
