import { Badge } from '@/components/ui/badge';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type NavGroup, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavMainProps {
    groups: NavGroup[];
}

function NavMainItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
    const buttonClasses = cn('justify-start', {
        'cursor-not-allowed opacity-60': item.disabled,
    });

    if (item.disabled) {
        return (
            <SidebarMenuButton variant="ghost" className={buttonClasses} disabled>
                <span className="flex items-center gap-2">
                    {item.icon && <item.icon className="size-4 shrink-0" aria-hidden="true" />}
                    <span className="font-sans">{item.title}</span>
                </span>
            </SidebarMenuButton>
        );
    }

    if (item.isExternal) {
        return (
            <SidebarMenuButton variant="ghost" asChild className={buttonClasses} isActive={isActive}>
                <a href={item.href} target="_blank" rel="noreferrer">
                    {item.icon && <item.icon className="size-4 shrink-0" aria-hidden="true" />}
                    <span className="font-sans">{item.title}</span>
                </a>
            </SidebarMenuButton>
        );
    }

    return (
        <SidebarMenuButton
            variant="ghost"
            asChild
            className={buttonClasses}
            isActive={isActive}
            tooltip={{ children: item.title }}
        >
            <Link href={item.href} prefetch>
                {item.icon && <item.icon className="size-4 shrink-0" aria-hidden="true" />}
                <span className="font-sans">{item.title}</span>
            </Link>
        </SidebarMenuButton>
    );
}

export function NavMain({ groups }: NavMainProps) {
    const page = usePage();
    const soonGroups = new Set(['Editor Suite', 'AI Companion']);
    return (
        <div className="flex flex-col gap-5">
            {groups.map((group) => (
                <SidebarGroup key={group.title} className="px-2 py-0">
                    <SidebarGroupLabel className="flex items-center justify-between gap-2">
                        <span>{group.title}</span>
                        {soonGroups.has(group.title) && (
                            <Badge variant="secondary" className="text-[10px] group-data-[collapsible=icon]/sidebar-wrapper:hidden">
                                Soon
                            </Badge>
                        )}
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) => {
                            const isActive = item.href !== '#' && page.url.startsWith(item.href);
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <NavMainItem item={item} isActive={isActive} />
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </div>
    );
}
