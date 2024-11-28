import { toast } from 'react-toastify'

const defaultOptions = {
	position: 'top-right' as const,
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: 'dark' as const
}

export const showToast = {
	success: (message: string) => {
		toast.success(message, defaultOptions)
	},
	error: (message: string) => {
		toast.error(message, defaultOptions)
	},
	info: (message: string) => {
		toast.info(message, defaultOptions)
	}
}
