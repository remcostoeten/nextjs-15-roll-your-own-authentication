'use client';

import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { logout } from '@/modules/authenticatie/server/mutations/logout';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, User, UserCheck, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function AuthStateWidget() {
	const auth = useAuth();
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const handleLogout = async () => {
		await logout();
		location.reload();
	};

	const handleProfileClick = () => {
		router.push('/dashboard/profile');
	};

	if (auth.status === 'loading') return null;

	return (
		<motion.div
			className="fixed bottom-4 right-4 z-50"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				type: 'spring',
				stiffness: 260,
				damping: 20,
			}}
		>
			<div
				onMouseEnter={() => setOpen(true)}
				onMouseLeave={() => setOpen(false)}
				className="relative"
			>
				<motion.div
					className="cursor-pointer"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					transition={{
						type: 'spring',
						stiffness: 400,
						damping: 15,
					}}
				>
					<div className="relative group">
						<motion.div
							className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 rounded-2xl blur opacity-75"
							animate={{
								opacity: open ? 0.9 : 0.75,
								scale: open ? 1.05 : 1,
							}}
							transition={{ duration: 0.2 }}
						/>
						<div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-background shadow-lg">
							{auth.status === 'authenticated' ? (
								<UserCheck className="h-6 w-6 text-green-500" />
							) : (
								<UserX className="h-6 w-6 text-red-500" />
							)}
						</div>
					</div>
				</motion.div>

				<AnimatePresence>
					{open && (
						<motion.div
							className="absolute bottom-full right-0 mb-2 min-w-[200px]"
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.95 }}
							transition={{
								type: 'spring',
								stiffness: 300,
								damping: 25,
							}}
						>
							<div className="overflow-hidden rounded-xl bg-background shadow-lg ring-1 ring-black/5">
								{auth.status === 'authenticated' ? (
									<div className="p-2">
										<button
											type="button"
											onClick={handleProfileClick}
											className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
										>
											<User className="h-4 w-4" />
											Profile
										</button>
										<button
											type="button"
											onClick={handleLogout}
											className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-muted"
										>
											<LogOut className="h-4 w-4" />
											Logout
										</button>
									</div>
								) : (
									<div className="p-2">
										<button
											type="button"
											onClick={() => router.push('/login')}
											className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
										>
											<User className="h-4 w-4" />
											Login
										</button>
									</div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
}
