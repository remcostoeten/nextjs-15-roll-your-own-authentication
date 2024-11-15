'use client';

import { logout } from "@/features/authentication/actions";
import Link from "next/link";
import { Button } from "../ui/button";

type HeaderProps = {
  user?: {
    email: string;
    role: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold">
          Your App
        </Link>

        <nav className="flex gap-4">
          {user ? (
            <Button variant="ghost" onClick={() => logout()}>
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
