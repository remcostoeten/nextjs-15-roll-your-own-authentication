'use client';

import { Flex } from '@/shared/components/flex';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/shared/components/ui/navigation-menu';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/shared/components/ui/sheet';
import { Book, Menu, Sunset, Trees, Zap } from 'lucide-react';
import Link from 'next/link';
import { Container } from 'ui';
import { Logo } from './logo';

interface MenuItem {
	title: string;
	url: string;
	items?: {
		title: string;
		description: string;
		icon: React.ReactNode;
		url: string;
	}[];
}

interface Navbar1Props {
	menu?: MenuItem[];
	mobileExtraLinks?: { name: string; url: string }[];
	auth?: {
		login: { text: string; url: string };
		signup: { text: string; url: string };
	};
}

const renderMenuItem = (item: MenuItem) => {
	if (!item.items) {
		return (
			<NavigationMenuItem key={item.title}>
				<NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 relative">
					{item.title}
				</NavigationMenuLink>
			</NavigationMenuItem>
		);
	}

	return (
		<NavigationMenuItem key={item.title}>
			<NavigationMenuTrigger className="relative group">{item.title}</NavigationMenuTrigger>
			<NavigationMenuContent>
				<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
					{item.items.map((subItem) => (
						<li key={subItem.title}>
							<NavigationMenuLink asChild>
								<Link
									href={subItem.url}
									className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground relative group/item"
								>
									<div className="flex items-center gap-2 text-sm font-medium leading-none">
										{subItem.icon}
										{subItem.title}
									</div>
									<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
										{subItem.description}
									</p>
								</Link>
							</NavigationMenuLink>
						</li>
					))}
				</ul>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};

const renderMobileMenuItem = (item: MenuItem) => {
	if (!item.items) {
		return (
			<a
				key={item.title}
				href={item.url}
				className="flex h-10 items-center justify-between rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 relative group"
			>
				{item.title}
			</a>
		);
	}

	return (
		<AccordionItem key={item.title} value={item.title}>
			<AccordionTrigger className="relative group">{item.title}</AccordionTrigger>
			<AccordionContent>
				<div className="flex flex-col gap-2 pl-4">
					{item.items.map((subItem) => (
						<a
							key={subItem.title}
							href={subItem.url}
							className="flex items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 relative group"
						>
							{subItem.icon}
							{subItem.title}
						</a>
					))}
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};

const Navbar = ({
	menu = [
		{ title: 'Home', url: '#' },
		{
			title: 'Products',
			url: '#',
			items: [
				{
					title: 'Blog',
					description: 'The latest industry news, updates, and info',
					icon: <Book className="size-5 shrink-0" />,
					url: '#',
				},
				{
					title: 'Company',
					description: 'Our mission is to innovate and empower the world',
					icon: <Trees className="size-5 shrink-0" />,
					url: '#',
				},
				{
					title: 'Careers',
					description: 'Browse job listing and discover our workspace',
					icon: <Sunset className="size-5 shrink-0" />,
					url: '#',
				},
				{
					title: 'Support',
					description: 'Get in touch with our support team or visit our community forums',
					icon: <Zap className="size-5 shrink-0" />,
					url: '#',
				},
			],
		},
		{
			title: 'Blog',
			url: '#',
		},
	],
	mobileExtraLinks = [
		{ name: 'Press', url: '#' },
		{ name: 'Contact', url: '#' },
		{ name: 'Imprint', url: '#' },
		{ name: 'Sitemap', url: '#' },
	],
	auth = {
		login: { text: 'Log in', url: '#' },
		signup: { text: 'Sign up', url: '#' },
	},
}: Navbar1Props) => {
	return (
		<section className="py-4">
			<Container>
				<nav className="hidden justify-between lg:flex items-center">
					<div>
						<Flex center gap="md">
							<Logo />
							<Flex center>
								<NavigationMenu>
									<NavigationMenuList>
										{menu.map((item) => renderMenuItem(item))}
									</NavigationMenuList>
								</NavigationMenu>
							</Flex>
						</Flex>
					</div>
					<div>
						<Flex gap="md" start>
							<Button
								asChild
								variant="outline"
								size="sm"
								className="rounded-none relative group max-h-[35px] min-h-[35px]"
							>
								<Link href={auth.login.url}>{auth.login.text}</Link>
							</Button>
							<Button
								className="rounded-none relative group max-h-[33px] min-h-[33px] font-semibold"
								asChild
								size="sm"
							>
								<Link href={auth.signup.url}>{auth.signup.text}</Link>
							</Button>
						</Flex>
					</div>
				</nav>
				<div className="lg:hidden flex justify-between items-center gap-4">
					<Flex center gap="md">
						<Logo />
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="outline" size="icon" className="relative group">
									<Menu className="size-4" />
								</Button>
							</SheetTrigger>
							<SheetContent className="overflow-y-auto">
								<SheetHeader>
									<SheetTitle>
										<Logo />
									</SheetTitle>
								</SheetHeader>
								<Flex column gap="md" className="my-6">
									<Accordion
										type="single"
										collapsible
										className="flex w-full flex-col gap-4"
									>
										{menu.map((item) => renderMobileMenuItem(item))}
									</Accordion>
									<div className="border-t py-4">
										<div className="grid grid-cols-2 justify-start">
											{mobileExtraLinks.map((link, idx) => (
												<a
													key={idx}
													className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground relative group"
													href={link.url}
												>
													{link.name}
												</a>
											))}
										</div>
									</div>
									<Flex column gap="sm">
										<Button
											asChild
											variant="outline"
											className="relative group max-h-[50px] min-h-[50px]"
										>
											<a href={auth.login.url}>{auth.login.text}</a>
										</Button>
										<Button asChild className="relative group">
											<a href={auth.signup.url}>{auth.signup.text}</a>
										</Button>
									</Flex>
								</Flex>
							</SheetContent>
						</Sheet>
					</Flex>
				</div>
			</Container>
		</section>
	);
};

export { Navbar };
