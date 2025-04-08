import { z } from "zod";

const updateMemberRoleSchema = z.object({
  role: z.enum(["member", "admin", "owner"]),
})

export { updateMemberRoleSchema }
