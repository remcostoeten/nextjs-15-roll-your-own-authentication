import type { InferModel } from "drizzle-orm";
import type { usersSchema, sessionsSchema, notificationsSchema } from "./";

export type TUser = InferModel<typeof usersSchema>;
export type TNewUser = InferModel<typeof usersSchema, "insert">;

export type TSession = InferModel<typeof sessionsSchema>;
export type TNewSession = InferModel<typeof sessionsSchema, "insert">;

export type TNotification = InferModel<typeof notificationsSchema>;
export type TNewNotification = InferModel<typeof notificationsSchema, "insert">; 