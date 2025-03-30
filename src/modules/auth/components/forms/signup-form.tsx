"use client";

import { useRouter } from "next/navigation";
import { Button, Input, Label } from "ui";
import { signup } from "@/src/modules/auth/api/mutations";
import { useState } from "react";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import type { TSignupFormState, TAuthError } from "../../api/models/types";
import { SignupFormSchema } from "../../api/models/forms/signup";

export function SignupForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<TSignupFormState>({
    error: null,
    isLoading: false,
  });
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const passwordRequirements = [
    { test: (v: string) => v.length >= 8, text: "At least 8 characters" },
    { test: (v: string) => /[a-zA-Z]/.test(v), text: "Contains a letter" },
    { test: (v: string) => /[0-9]/.test(v), text: "Contains a number" },
    { test: (v: string) => /[^a-zA-Z0-9]/.test(v), text: "Contains a special character" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (formState.error?.errors && name in formState.error.errors) {
      const newErrors = { ...formState.error.errors };
      delete newErrors[name];
      
      setFormState((prev) => ({
        ...prev,
        error: prev.error && Object.keys(newErrors).length > 0 
          ? { ...prev.error, errors: newErrors }
          : null,
      }));
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ error: null, isLoading: true });
    setSuccess(false);

    try {
      const validatedData = SignupFormSchema.safeParse(formData);

      if (!validatedData.success) {
        const fieldErrors: Record<string, string[]> = {};
        Object.entries(validatedData.error.formErrors.fieldErrors).forEach(([key, value]) => {
          if (value) fieldErrors[key] = value;
        });

        setFormState({
          error: {
            code: "VALIDATION_ERROR",
            message: "Please check your input",
            errors: fieldErrors,
          },
          isLoading: false,
        });
        return;
      }

      const formDataObj = new FormData();
      Object.entries(validatedData.data).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });

      const result = await signup(formDataObj);

      if (!result.success) {
        setFormState({
          error: result.error ?? {
            code: "SERVER_ERROR",
            message: "An error occurred",
          },
          isLoading: false,
        });
        return;
      }

      setSuccess(true);
      // Wait for 1 second to show success state before redirecting
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      setFormState({
        error: {
          code: "SERVER_ERROR",
          message: "An error occurred while creating your account",
        },
        isLoading: false,
      });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSignup} className="space-y-4">
        {formState.error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-md">
            <p className="font-medium">{formState.error.message}</p>
            {formState.error.errors && Object.entries(formState.error.errors).map(([field, errors]) => (
              errors?.map((error, i) => (
                <p key={`${field}-${i}`} className="text-sm mt-1">{error}</p>
              ))
            ))}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-100 text-green-800 rounded-md">
            <p className="font-medium">Account created successfully!</p>
            <p className="text-sm mt-1">Redirecting to login...</p>
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!formState.error?.errors?.name}
            aria-errormessage={formState.error?.errors?.name?.[0]}
            className="w-full"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!formState.error?.errors?.email}
            aria-errormessage={formState.error?.errors?.email?.[0]}
            className="w-full"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              aria-invalid={!!formState.error?.errors?.password}
              aria-errormessage={formState.error?.errors?.password?.[0]}
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {(passwordFocus || formData.password) && (
            <div className="mt-2 space-y-2">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {req.test(formData.password) ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span className={req.test(formData.password) ? "text-green-700" : "text-red-700"}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={formState.isLoading}
        >
          {formState.isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </div>
  );
}
