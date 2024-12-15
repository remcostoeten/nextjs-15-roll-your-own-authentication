import { PrismaClient } from '@prisma/client'
import { User } from '../mutations/auth/user/types'

const prisma = new PrismaClient()

export class UserService {
	async findById(id: number): Promise<User | null> {
		return prisma.user.findUnique({ where: { id } })
	}

	async updateUser(id: number, data: Partial<User>): Promise<User> {
		return prisma.user.update({
			where: { id },
			data
		})
	}

	async deleteUser(id: number): Promise<void> {
		await prisma.user.delete({ where: { id } })
	}
}
