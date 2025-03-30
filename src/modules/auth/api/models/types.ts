import type { TUser } from "@/server/db/schemas/types";

export type TAuthError = {
  code: 
    | "INVALID_CREDENTIALS"
    | "USER_NOT_FOUND"
    | "EMAIL_IN_USE"
    | "VALIDATION_ERROR"
    | "SERVER_ERROR"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "UPLOAD_ERROR"
    | "ALL_FIELDS_REQUIRED"
    | "PASSWORD_TOO_SHORT"
    | "OAUTH_USER";
  message: string;
  errors?: Record<string, string[]>;
};

export type TAuthResult = {
  success: boolean;
  user?: Omit<TUser, "password">;
  error?: TAuthError;
};

export type TProfileFormState = {
  error: TAuthError | null;
  success: string | null;
  isLoading: boolean;
};

export type TProfileFormProps = {
  user: Omit<TUser, "password">;
};

export type TLoginFormState = {
  error: TAuthError | null;
  isLoading: boolean;
};

export type TSignupFormState = {
  error: TAuthError | null;
  isLoading: boolean;
};

export type NotificationFilter = {
  isRead?: boolean;
  isSaved?: boolean;
};
