import bcryptjs from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { createEntity } from '../server/db/generics/entity'
import { users } from '../server/db/schema'

const userEntity = createEntity(users)

export async function getUserProfile(userId: number) {
	const [user] = await userEntity.read(eq(users.id, userId))
	return user
}

export async function updateUserProfile(
	userId: number,
	data: { name?: string; bio?: string; avatar?: string }
) {
	const [updatedUser] = await userEntity.update(eq(users.id, userId), data)
	return updatedUser
}

export async function updateUserPassword(
	userId: number,
	currentPassword: string,
	newPassword: string
) {
	const [user] = await userEntity.read(eq(users.id, userId))
	if (!user) throw new Error('User not found')

	const isPasswordValid = await bcryptjs.compare(
		currentPassword,
		user.password
	)
	if (!isPasswordValid) throw new Error('Current password is incorrect')

	const hashedPassword = await bcryptjs.hash(newPassword, 10)
	const [updatedUser] = await userEntity.update(eq(users.id, userId), {
		password: hashedPassword
	})
	return updatedUser
}

export async function deleteUserAccount(userId: number) {
	const [deletedUser] = await userEntity.delete(eq(users.id, userId))
	return deletedUser
}
