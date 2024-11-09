/**
 * @description This function is used to protect a component with admin status.
 * @author Remco Stoeten
 */
import { ReactNode } from 'react'
import { isAdmin } from './get-admin'

type ComponentWithProps<P = object> = {
	(props: P): ReactNode
	displayName?: string
}

export async function withAdminProtection<P = {}>(
	Component: ComponentWithProps<P>,
	props: P,
	fallback: ReactNode = null
): Promise<ReactNode> {
	const adminStatus = await isAdmin()

	if (!adminStatus) {
		return fallback
	}

	return <Component {...props} />
}
