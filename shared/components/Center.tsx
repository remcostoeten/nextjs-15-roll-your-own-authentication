/**
 * A utility component that centers its children vertically
 * using flexbox and absolute positioning for vertical centering.
 * Note: Uses w-screen to ensure full width.
 */

type TProps = {
	children: React.ReactNode
	absolute?: boolean
}

const flex = 'flex items-center justify-center w-full'

export function Center({ children, absolute = false }: TProps) {
	return (
		<div
			className={`${flex} ${
				absolute ? 'fixed inset-0 z-50' : 'relative'
			}`}
		>
			{children}
		</div>
	)
}

/*
 * @example
 * // Basic usage
 * <Center>
 *   <div>Perfectly Centered Content</div>
 * </Center>
 *
 * // With fixed positioning
 * <Center absolute>
 *   <div>Fixed Centered Content</div>
 * </Center>
 */
