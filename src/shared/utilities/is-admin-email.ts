export const isAdminEmail = (email: string) => {
	return email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()
}
