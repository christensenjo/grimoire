import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavGroup, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpenCheck, BrainCircuit, FilePenLine, LayoutGrid, MessageSquareText, MountainSnow, PenTool } from 'lucide-react';
import AppLogo from './app-logo';

const primaryNavGroups: NavGroup[] = [
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
        ],
    },
];

const comingSoonNavGroups: NavGroup[] = [
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

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <div className="flex flex-col gap-3">
                    <SidebarMenu>
                        <SidebarMenuItem className="mb-2">
                            <SidebarMenuButton size="lg" variant="ghost" className="cursor-pointer hover:bg-transparent hover:text-jet" asChild>
                                <Link href="/dashboard" prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <div className="flex flex-col gap-2">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    size="sm"
                                    variant="ghost"
                                    className="w-full justify-start gap-2 cursor-pointer"
                                    tooltip="New Setting"
                                    type="button"
                                >
                                    <PenTool className="size-4 shrink-0" aria-hidden="true" />
                                    <span className="text-sm font-sans">New Setting</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    size="sm"
                                    variant="default"
                                    className="w-full justify-start gap-2 cursor-pointer bg-armor"
                                    tooltip="New Document"
                                    type="button"
                                >
                                    <FilePenLine className="size-4 shrink-0" aria-hidden="true" />
                                    <span className="text-sm font-sans">New Document</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={primaryNavGroups} />
            </SidebarContent>

            <SidebarFooter>
                <div className="flex flex-col gap-4">
                    <NavMain groups={comingSoonNavGroups} />
                    {footerNavItems.length > 0 && <NavFooter items={footerNavItems} />}
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
