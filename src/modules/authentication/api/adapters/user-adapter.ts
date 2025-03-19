import { User } from '@/server/db/schemas/users'
import { GetCurrentUserResponse } from '../queries/get-current-user'

export function adaptUser(user: GetCurrentUserResponse | null): User | null {
	if (!user) return null

	return user as unknown as User
}
