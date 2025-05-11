import { Link, useMatchRoute } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Book, Home } from "lucide-react";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";

interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "CRUD Documentation",
        href: "/docs/crud",
        icon: Book,
    },
];

export function SidebarNav() {
    const matchRoute = useMatchRoute();

    return (
        <div className="w-full">
            <nav className="grid gap-1">
                {navItems.map((item) => {
                    const isActive = matchRoute({
                        to: item.href,
                        fuzzy: true,
                    });

                    return (
                        <Link key={item.href} to={item.href} className="w-full">
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    isActive ? "bg-secondary" : "hover:bg-secondary/50"
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Button>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
} 