import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Moon, Sun } from 'lucide-react';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    prefetch?: boolean;
}

function NavLink({ href, children, className, prefetch = true }: NavLinkProps) {
    return (
        <NavigationMenuLink asChild>
            <Link
                href={href}
                prefetch={prefetch}
                className={cn(
                    'group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-lg font-medium text-black transition-all duration-150 hover:bg-black/5 hover:text-black focus:bg-black/5 focus:text-black disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-accent/50 data-[state=open]:bg-accent/50 dark:text-white dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10',
                    className,
                )}
            >
                {children}
            </Link>
        </NavigationMenuLink>
    );
}

export default function PublicNav() {
    const { auth } = usePage<SharedData>().props;
    const { updateAppearance } = useAppearance();

    const toggleAppearance = () => {
        const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
        updateAppearance(isDark ? 'light' : 'dark');
    };

    return (
        <header className="relative z-10 w-full px-4 py-4">
            <nav className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 text-sm">
                {auth.user ? (
                    <Link
                        href={route('dashboard')}
                        className="inline-block rounded-sm border border-black/20 px-5 py-1.5 text-black transition-all duration-150 hover:border-black/40 hover:bg-black hover:text-white dark:border-white/20 dark:text-white dark:hover:border-white/40 dark:hover:bg-white dark:hover:text-black"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link href={route('home')} className="inline-flex items-center gap-3 pt-1 font-title text-3xl text-black dark:text-white">
                            <img
                                src="/images/logos/castlebooks_square/castlebook_parchment.svg"
                                alt="Grimoire Logo"
                                className="hidden h-8 w-8 pb-1 dark:block"
                            />
                            <img
                                src="/images/logos/castlebooks_square/castlebook_jet.svg"
                                alt="Grimoire Logo"
                                className="block h-8 w-8 pb-1 dark:hidden"
                            />
                            Grimoire
                        </Link>

                        <NavigationMenu className="flex-1 justify-center">
                            <NavigationMenuList className="gap-1">
                                <NavigationMenuItem>
                                    <NavLink href={route('features')}>Features</NavLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavLink href={route('library')}>Library</NavLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavLink href={route('integrations')}>Integrations</NavLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavLink href={route('pricing')}>Pricing</NavLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleAppearance}
                                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-transparent text-black transition-all duration-150 hover:border-black/90 dark:text-white dark:hover:border-white/90"
                                aria-label="Toggle theme"
                            >
                                <Sun className="h-5 w-5 dark:hidden" />
                                <Moon className="hidden h-5 w-5 dark:block" />
                            </button>

                            <NavigationMenu>
                                <NavigationMenuList className="gap-2">
                                    <NavigationMenuItem>
                                    <NavLink href={route('login')} className="font-sans">
                                        Login
                                    </NavLink>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavLink
                                            href={route('register')}
                                            className="bg-magic font-sans text-white hover:bg-magic/80 hover:text-white"
                                        >
                                            Get Started
                                        </NavLink>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </>
                )}
            </nav>
        </header>
    );
}
