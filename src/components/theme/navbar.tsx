'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from 'ui'
import Logo from './logo'

export default function Navbar({ user }: { user: any }) {
	const router = useRouter()

	const handleLogout = async () => {
		// Add logout logic here
		router.push('/login')
	}

	return (
		<nav className="bg-white shadow">
			<div className="container mx-auto px-4">
				<div className="flex justify-between h-16">
					<div className="flex">
						<Link
							href="/"
							className="flex-shrink-0 flex items-center"
						>
							<Logo />
						</Link>
					</div>
					<div className="flex items-center">
						{user ? (
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Avatar>
										<AvatarImage
											src={user.avatar}
											alt={user.name}
										/>
										<AvatarFallback>
											{user.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuLabel>
										{user.name}
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<Link href="/dashboard">Dashboard</Link>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Link href="/profile">Profile</Link>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={handleLogout}>
										Logout
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<>
								<Link href="/login" className="mr-4">
									<Button variant="ghost">Login</Button>
								</Link>
								<Link href="/register">
									<Button>Register</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	)
}
