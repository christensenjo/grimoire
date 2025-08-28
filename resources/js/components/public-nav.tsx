import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';

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
						className="inline-block rounded-sm border border-black/20 dark:border-white/20 px-5 py-1.5 text-black dark:text-white hover:border-black/40 dark:hover:border-white/40"
					>
						Dashboard
					</Link>
				) : (
					<>
						<Link href={route('home')} className="font-title text-3xl pt-1 text-black dark:text-white inline-flex items-center gap-3">
							<img 
								src="/images/logos/castlebooks_square/castlebook_parchment.svg" 
								alt="Grimoire Logo" 
								className="w-8 h-8 pb-1 hidden dark:block" 
							/>
							<img 
								src="/images/logos/castlebooks_square/castlebook_jet.svg" 
								alt="Grimoire Logo" 
								className="w-8 h-8 pb-1 dark:hidden block" 
							/>
							Grimoire
						</Link>
						<div className="flex gap-4 w-fit">
							<Link
								href={route('features')}
								prefetch
								className="text-lg pt-1 text-black dark:text-white transition-all duration-300 hover:underline underline-offset-4"
							>
								Features
							</Link>
							<Link
								href={route('library')}
								prefetch
								className="text-lg pt-1 text-black dark:text-white transition-all duration-300 hover:underline underline-offset-4"
							>
								Library
							</Link>
							<Link
								href={route('integrations')}
								prefetch
								className="text-lg pt-1 text-black dark:text-white transition-all duration-300 hover:underline underline-offset-4"
							>
								Integrations
							</Link>
							<Link
								href={route('pricing')}
								prefetch
								className="text-lg pt-1 text-black dark:text-white transition-all duration-300 hover:underline underline-offset-4"
							>
								Pricing
							</Link>
						</div>
						<div className="flex gap-4 w-fit">
							<button
								onClick={toggleAppearance}
								className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-black dark:text-white transition-all duration-150 hover:border-black/90 dark:hover:border-white/90"
								aria-label="Toggle theme"
							>
								<Sun className="h-5 w-5 dark:hidden" />
								<Moon className="hidden h-5 w-5 dark:block" />
							</button>
							<Link
								href={route('login')}
								prefetch
								className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-black dark:text-white hover:border-black/90 dark:hover:border-white/90 text-lg transition-all duration-150"
							>
								Login
							</Link>
							<Link
								href={route('register')}
								prefetch
								className="inline-block rounded-sm border border-black/90 dark:border-white/90 px-5 py-1.5 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-lg transition-all duration-150"
							>
								Start Your Journey
							</Link>
						</div>
					</>
				)}
			</nav>
		</header>
	);
}
