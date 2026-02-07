import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { type Appearance, useAppearance } from '@/hooks/use-appearance';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Monitor, Moon, Settings, Sun } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const { appearance, updateAppearance } = useAppearance();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link className="block w-full font-sans" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        <span className="font-sans">Settings</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-1 text-xs font-sans text-muted-foreground">Theme</DropdownMenuLabel>
                <ToggleGroup
                    type="single"
                    value={appearance}
                    onValueChange={(value) => {
                        if (!value) {
                            return;
                        }

                        updateAppearance(value as Appearance);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full"
                >
                    <ToggleGroupItem value="light" className="flex-1 gap-1 font-sans text-xs cursor-pointer" aria-label="Light theme">
                        <Sun className="h-3.5 w-3.5" />
                        Light
                    </ToggleGroupItem>
                    <ToggleGroupItem value="dark" className="flex-1 gap-1 font-sans text-xs cursor-pointer" aria-label="Dark theme">
                        <Moon className="h-3.5 w-3.5" />
                        Dark
                    </ToggleGroupItem>
                    <ToggleGroupItem value="system" className="flex-1 gap-1 font-sans text-xs cursor-pointer" aria-label="System theme">
                        <Monitor className="h-3.5 w-3.5" />
                        System
                    </ToggleGroupItem>
                </ToggleGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
                <Link className="block w-full font-sans" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    <span className="font-sans">Log out</span>
                </Link>
            </DropdownMenuItem>
        </>
    );
}
