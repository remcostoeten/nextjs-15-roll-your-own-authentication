'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getSession } from '../actions/get-session.action'
import type { SessionUser } from '../types'

export default function useSession() {
	const [session, setSession] = useState<SessionUser | null>(null)
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		let mounted = true

		async function checkSession() {
			try {
				const data = await getSession()
				if (mounted) {
					if (data) {
						setSession(data)
					} else if (
						pathname !== '/sign-in' &&
						pathname !== '/sign-up'
					) {
						router.replace('/sign-in')
					}
				}
			} catch {
				if (
					mounted &&
					pathname !== '/sign-in' &&
					pathname !== '/sign-up'
				) {
					router.replace('/sign-in')
				}
			} finally {
				if (mounted) {
					setLoading(false)
				}
			}
		}

		checkSession()

		return () => {
			mounted = false
		}
	}, [router, pathname])

	return { session, loading }
}
