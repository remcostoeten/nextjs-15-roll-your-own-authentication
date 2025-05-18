import { toast } from '@/shared/components/ui/toast';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Coffee, Database, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { For } from './core/for';

type ThemeBase = 'catpuccini' | 'supabase' | 'caffeine';
type ThemeState = ThemeBase;

type ThemeItem = {
	key: ThemeBase;
	label: string;
	icon: typeof Sun | typeof Moon | typeof Database | typeof Coffee;
};

interface ThemeSwitcherProps {
	className?: string;
}

const themes: ThemeItem[] = [
	{
		key: 'catpuccini',
		label: 'Catpuccini',
		icon: Moon,
	},
	{
		key: 'supabase',
		label: 'Supabase',
		icon: Database,
	},
	{
		key: 'caffeine',
		label: 'Caffeine',
		icon: Coffee,
	},
];

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
	const [theme, setThemeState] = useState<ThemeState>('catpuccini');
	const [isChanging, setIsChanging] = useState(false);

	const setTheme = async (newTheme: ThemeBase) => {
		setIsChanging(true);
		try {
			setThemeState(newTheme);
			toast(`Switched to ${newTheme} theme`).success();
		} catch (error) {
			console.error('Failed to update theme:', error);
			toast('Failed to update theme').error();
		} finally {
			setIsChanging(false);
		}
	};

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') as ThemeState;
		if (savedTheme) {
			setThemeState(savedTheme);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('theme', theme);
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

	const renderThemeItem = (themeItem: ThemeItem) => {
		const isActive = theme.startsWith(themeItem.key);
		const Icon = themeItem.icon;
		return (
			<Tooltip key={themeItem.key}>
				<TooltipTrigger asChild>
					<button
						type="button"
						className="relative h-6 w-6 rounded-md"
						onClick={() => setTheme(themeItem.key)}
						disabled={isChanging}
						aria-label={themeItem.label}
					>
						{isActive && (
							<motion.div
								layoutId="activeTheme"
								className="absolute inset-0 rounded-md bg-primary/80 backdrop-blur-sm"
								transition={{ type: 'spring', duration: 0.5 }}
							/>
						)}
						<Icon
							className={`relative z-10 m-auto h-4 w-4 transition-transform duration-200 ${
								isActive
									? 'text-primary-foreground scale-110'
									: 'text-muted-foreground/70 scale-100'
							}`}
						/>
					</button>
				</TooltipTrigger>
				<TooltipContent className="bg-muted/90 border-none text-muted-foreground">
					<p>{themeItem.label}</p>
				</TooltipContent>
			</Tooltip>
		);
	};

	return (
		<TooltipProvider>
			<div className={`flex items-center gap-4 ${className || ''}`}>
				<div className="relative flex h-8 rounded-lg bg-background/10 dark:bg-muted/40 backdrop-blur-md justify-center p-1 ring-1 ring-border/50">
					<For each={themes}>{renderThemeItem}</For>
				</div>
			</div>
		</TooltipProvider>
	);
}
