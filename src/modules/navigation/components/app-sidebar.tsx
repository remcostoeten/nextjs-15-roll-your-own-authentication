'use client';

import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map as MapIcon,
    PieChart,
    Settings2,
    SquareTerminal,
    type LucideIcon,
} from 'lucide-react';
import type * as React from 'react';

import { ThemeSwitcher } from '@/modules/theme/components';
import { Separator } from '@/shared/components/ui/separator';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/shared/components/ui/sidebar';
import { NavMain, NavProjects, NavUser, TeamSwitcher } from './';

type Team = {
    name: string;
    logo: LucideIcon;
    plan: string;
};

type NavItem = {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
        title: string;
        url: string;
    }[];
};

type Project = {
    name: string;
    url: string;
    icon: LucideIcon;
};

const data = {
    teams: [
        {
            name: 'Acme Inc',
            logo: GalleryVerticalEnd,
            plan: 'Enterprise',
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup',
        },
        {
            name: 'Evil Corp.',
            logo: Command,
            plan: 'Free',
        },
    ] as Team[],
    navMain: [
        {
            title: 'Playground',
            url: '#',
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: 'History',
                    url: '#',
                },
                {
                    title: 'Starred',
                    url: '#',
                },
            ],
        },
        {
            title: 'Models',
            url: '#',
            icon: Bot,
            items: [
                {
                    title: 'Genesis',
                    url: '#',
                },
                {
                    title: 'Explorer',
                    url: '#',
                },
                {
                    title: 'Quantum',
                    url: '#',
                },
            ],
        },
        {
            title: 'Documentation',
            url: '#',
            icon: BookOpen,
            items: [
                {
                    title: 'Introduction',
                    url: '#',
                },
                {
                    title: 'Get Started',
                    url: '#',
                },
                {
                    title: 'Tutorials',
                    url: '#',
                },
                {
                    title: 'Changelog',
                    url: '#',
                },
            ],
        },
        {
            title: 'Settings',
            url: '/dashboard/profile',
            icon: Settings2,
        },
    ] as NavItem[],
    projects: [
        {
            name: 'Design Engineering',
            url: '#',
            icon: Frame,
        },
        {
            name: 'Sales & Marketing',
            url: '#',
            icon: PieChart,
        },
        {
            name: 'Travel',
            url: '#',
            icon: MapIcon,
        },
    ] as Project[],
} as const;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <div className="flex flex-col gap-2">
                    <div className="px-2">
                        <ThemeSwitcher />
                    </div>
                    <Separator className="my-1" />
                    <NavUser />
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
