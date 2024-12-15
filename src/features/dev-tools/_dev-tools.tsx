import { Toaster } from 'sonner'
import FontSwitcher from './font-switcher'
import SessionIndicator from '@/components/session-indicator'

export default function DevTools() {
	return (
		<>
			<FontSwitcher />
			<SessionIndicator />
			<Toaster position="top-center" />
		</>
	)
}
