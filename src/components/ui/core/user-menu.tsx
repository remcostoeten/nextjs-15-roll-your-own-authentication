import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Settings, LogOut, User } from 'lucide-react';

interface UserMenuProps {
    email: string;
    name: string;
    avatarUrl?: string;
    onLogout?: () => void;
    onThemeToggle?: () => void;
}

export const UserMenu = ({ 
    email, 
    name, 
    avatarUrl, 
    onLogout, 
    onThemeToggle 
}: UserMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const handleThemeToggle = () => {
        setIsDark(!isDark);
        onThemeToggle?.();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                {avatarUrl ? (
                    <img 
                        src={avatarUrl} 
                        alt={name} 
                        className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                        {name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="text-left">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{email}</p>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                        <div className="py-1">
                            <button className="flex w-full items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <User className="w-4 h-4 mr-2" />
                                Profile
                            </button>
                            <button className="flex w-full items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </button>
                            <button 
                                onClick={handleThemeToggle}
                                className="flex w-full items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                {isDark ? (
                                    <Sun className="w-4 h-4 mr-2" />
                                ) : (
                                    <Moon className="w-4 h-4 mr-2" />
                                )}
                                Theme
                            </button>
                            <button 
                                onClick={onLogout}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}; 