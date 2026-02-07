import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavGroup, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, BookOpenCheck, BrainCircuit, FilePenLine, Globe2, LayoutGrid, MessageSquareText, MountainSnow, Orbit, PenTool } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavGroups: NavGroup[] = [
    {
        title: 'Workspace',
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Library',
                href: '/library',
                icon: BookOpenCheck,
            },
            {
                title: 'Integrations',
                href: '/integrations',
                icon: Orbit,
            },
        ],
    },
    {
        title: 'Editor Suite',
        items: [
            {
                title: 'Canvas Editor',
                href: '#',
                icon: PenTool,
                disabled: true,
            },
            {
                title: 'Markdown Editor',
                href: '#',
                icon: FilePenLine,
                disabled: true,
            },
            {
                title: 'Text Editor',
                href: '#',
                icon: Globe2,
                disabled: true,
            },
            {
                title: 'Templates',
                href: '#',
                icon: BookOpen,
                disabled: true,
            },
        ],
    },
    {
        title: 'AI Companion',
        items: [
            {
                title: 'Setting Explorer',
                href: '#',
                icon: MountainSnow,
                disabled: true,
            },
            {
                title: 'Character Chat',
                href: '#',
                icon: MessageSquareText,
                disabled: true,
            },
            {
                title: 'Soundscapes',
                href: '#',
                icon: BrainCircuit,
                disabled: true,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Features',
        href: '/features',
        icon: BookOpen,
    },
    {
        title: 'Pricing',
        href: '/pricing',
        icon: BookOpenCheck,
    },
    {
        title: 'Docs',
        href: 'https://docs.grimoire.world',
        icon: LayoutGrid,
        isExternal: true,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <div className="flex flex-col gap-3 px-1">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/dashboard" prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <div className="flex flex-col gap-2">
                        <Button size="sm" className="w-full justify-start gap-2">
                            <FilePenLine className="size-4" aria-hidden="true" />
                            New Document
                        </Button>
                        <Button size="sm" variant="secondary" className="w-full justify-start gap-2">
                            <PenTool className="size-4" aria-hidden="true" />
                            New Setting
                        </Button>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={mainNavGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
