'use client';

import { useToast } from "@/components/primitives/toast";
import { useAuth } from "@/features/authentication/context/auth-context";
import { logout } from "@/features/authentication/mutations/logout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function Header() {
  const router = useRouter();
  const toast = useToast();
  const { user, refetchUser } = useAuth();

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        await refetchUser();
        toast.success('Logged out successfully');
        router.push('/login');
      } else {
        toast.error(result.error || 'Failed to logout');
      }
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold">
          Your App
        </Link>

        <nav className="flex gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button variant="ghost" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
} 
