export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
}; 
