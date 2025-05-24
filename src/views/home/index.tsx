import { redirect } from 'next/navigation';

export function HomeView() {
	redirect('/login');
	return null;
}
