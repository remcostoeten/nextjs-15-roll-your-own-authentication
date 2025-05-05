import { getUserSession } from '@/modules/auth/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/modules/auth/api/actions/auth.actions';

function LogoutButton() {
    return (
        <form action={logout}>
            <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Logout
            </button>
        </form>
    );
}


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-gray-800 text-white shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold">
            Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {session.username}! ({session.role})</span>
            <LogoutButton />
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="p-4 bg-gray-200 text-center text-sm text-gray-600">
        My App Footer
      </footer>
    </div>
  );
}
