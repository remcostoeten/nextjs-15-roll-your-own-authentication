import type { TAuthError } from "../../api/models/types";

type FormAlertProps = {
  error: TAuthError | null;
  success: string | null;
};

export function FormAlert({ error, success }: FormAlertProps) {
  if (!error && !success) return null;

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg animate-in fade-in slide-in-from-top-1">
        <p className="font-medium">{error.message}</p>
        {error.errors && Object.entries(error.errors).map(([field, errors]) => (
          errors?.map((error, i) => (
            <p key={`${field}-${i}`} className="text-sm mt-1">{error}</p>
          ))
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg animate-in fade-in slide-in-from-top-1">
      {success}
    </div>
  );
} 