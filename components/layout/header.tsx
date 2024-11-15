'use client';

import { logout } from "@/features/authentication/mutations/logout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

type HeaderProps = {
  user?: {
    email: string;
    role: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
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
            <Button variant="ghost" onClick={handleLogout}>
              Sign out
            </Button>
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
