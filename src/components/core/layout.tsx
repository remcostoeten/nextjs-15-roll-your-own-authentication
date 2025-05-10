import { UserMenu } from '../ui/core/user-menu';
import { useTheme } from '../providers/theme-provider';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const { toggleTheme } = useTheme();

    const handleLogout = () => {
        // Implement logout logic
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors">
            <header className="border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-zinc-900 dark:text-white">
                                Your App
                            </span>
                        </div>
                        
                        <div className="flex items-center">
                            <UserMenu
                                email="stoetenremco.rs@gmail.com"
                                name="stoet"
                                onLogout={handleLogout}
                                onThemeToggle={toggleTheme}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}; 