import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <PublicLayout>
                <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-center px-4 py-12">
                    <section className="flex w-full flex-row items-center justify-center gap-16 pt-24 pb-20 md:pt-32 md:pb-28">
                        <div className="flex flex-col items-start justify-center gap-4">
                            <h1 className="leading-tighter animate-[hero-in_0.5s_ease-out_both] text-5xl text-black drop-shadow-lg md:text-6xl dark:text-white">
                                <span className="font-title-shaded text-[96px]">S</span>
                                top wrestling with notes...<br></br>...start building <span className="font-title-shaded text-[96px]">W</span>
                                rlds.
                            </h1>
                            <p className="animate-[hero-in_0.65s_ease-out_both_0.2s] text-lg text-black/70 dark:text-white/70">
                                Brave adventurers, cursed relics, forbidden lands: what secrets lie within your Grimoire?
                            </p>
                            <div className="flex flex-row items-center justify-center gap-2">
                                <Button asChild className="bg-armor px-6 py-3 text-sm font-medium text-white hover:bg-magic">
                                    <Link href={route('register')}>Get Started</Link>
                                </Button>
                            </div>
                        </div>
                    </section>
                </div>
            </PublicLayout>
        </>
    );
}
