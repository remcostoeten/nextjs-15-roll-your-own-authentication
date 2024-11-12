import { users } from '@/features/users/schemas/db/user.schema'

// Re-export user schema as auth schema
export type { NewUser, User } from '@/features/users/schemas/db/user.schema'
export { users }

