import { Link } from '@inertiajs/react';
import { type ComponentPropsWithoutRef } from 'react';

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    return (
        <SidebarGroup
            {...props}
            className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}
        >
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            {item.isExternal ? (
                                <SidebarMenuButton
                                    render={
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    }
                                    className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                                >
                                    {item.icon && (
                                        <item.icon
                                            className="size-4 shrink-0"
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="font-sans">{item.title}</span>
                                </SidebarMenuButton>
                            ) : (
                                <SidebarMenuButton
                                    render={
                                        <Link
                                            href={item.href}
                                            prefetch
                                        />
                                    }
                                    className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                                >
                                    {item.icon && (
                                        <item.icon
                                            className="size-4 shrink-0"
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="font-sans">{item.title}</span>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
