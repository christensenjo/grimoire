import DashboardPreview from '@/components/dashboard-preview';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <PublicLayout>
                <div className="mx-auto flex max-w-screen-2xl flex-col px-4 py-6">
                    {/* Hero - reduced padding to show dashboard preview below */}
                    <section className="flex w-full flex-row items-center justify-between gap-16 pt-8 pb-12 md:pt-12 md:pb-16">
                        <div className="flex flex-col items-start justify-center gap-4">
                            <h1 className="animate-[hero-in_0.5s_ease-out_both] text-left text-5xl leading-tight text-black md:text-6xl dark:text-white">
                                <span className="font-title-shaded text-[96px] leading-none">S</span>
                                top wrestling with notes...<br></br>...start building{' '}
                                <span className="font-title-shaded text-[96px] leading-none">W</span>
                                orlds.
                            </h1>
                            <p className="animate-[hero-in_0.65s_ease-out_both_0.2s] text-lg text-black/70 dark:text-white/70">
                                Brave adventurers, cursed relics, forbidden lands: <br></br>what secrets lie within your Grimoire?
                            </p>
                            <div className="flex flex-row items-center justify-start gap-2">
                                <Button asChild className="bg-armor px-6 py-3 text-sm font-medium text-white hover:bg-armor/80">
                                    <Link href={route('register')}>See Examples</Link>
                                </Button>
                                <Button asChild className="bg-magic px-6 py-3 text-sm font-medium text-white hover:bg-magic/80">
                                    <Link href={route('register')}>Get Started</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <img
                                src="/images/hero-placeholder.svg"
                                alt="Hero animation placeholder"
                                className="h-80 w-80 animate-[hero-in_0.8s_ease-out_both_0.4s] rounded-lg bg-white/5 object-cover"
                            />
                        </div>
                    </section>

                    {/* Dashboard Preview - partially visible to entice scrolling */}
                    <section className="relative mt-8 -mb-20 md:-mb-32">
                        <div className="rounded-t-xl border border-b-0 border-border/50 bg-parchment/90 p-1 shadow-2xl backdrop-blur-sm dark:bg-jet/90">
                            <DashboardPreview />
                        </div>
                    </section>
                </div>
            </PublicLayout>
        </>
    );
}
