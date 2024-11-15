'use client'

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { experimental_useFormStatus } from 'react-dom';

type AuthButtonProps = {
  text: string;
  type: 'login' | 'register' | 'logout';
  isLoading?: boolean;
}

export default function AuthButton({ text, isLoading }: AuthButtonProps) {
  const { pending } = experimental_useFormStatus();
  const showLoader = isLoading || pending;

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={showLoader}
    >
      {showLoader && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {text}
    </Button>
  );
}
