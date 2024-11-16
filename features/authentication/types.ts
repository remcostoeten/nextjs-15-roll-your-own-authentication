export type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type AuthResponse = ActionResponse<{
  user: AuthenticatedUser;
}>;
