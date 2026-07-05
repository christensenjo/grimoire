import { Head, Link } from '@inertiajs/react';

// import CTASection from '@/components/cta-section';
// import Features from '@/components/features';
import Footer from '@/components/footer';
// import HowItWorks from '@/components/how-it-works';
// import Integrations from '@/components/integrations';
import { Lombardic } from '@/components/lombardic';
// import Pricing from '@/components/pricing';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
// import WhyChooseUs from '@/components/why-choose-us';
import ShaderBackgroundLayout from '@/layouts/shader-background-layout';

export default function Welcome() {
    const previewSkeletonClassName = 'bg-tome/10 dark:bg-parchment/15';

    return (
        <>
            <Head title="Welcome" />
            <ShaderBackgroundLayout>
                <div className="mx-auto flex max-w-screen-2xl flex-col px-4 py-6">
                    <section className="flex w-full flex-col gap-12 pt-8 pb-12 md:pt-12 md:pb-16">
                        <div className="flex max-w-4xl flex-col items-start justify-center gap-4">
                            <h1 className="animate-[hero-in_0.5s_ease-out_both] text-left font-serif text-5xl leading-tight text-balance text-black md:text-6xl dark:text-white">
                                <span className="font-title-shaded text-[96px] leading-none">S</span>
                                <span className="font-serif">
                                    top wrestling with notes…<br></br>…start building{' '}
                                </span>
                                <span className="font-title-shaded text-[96px] leading-none">W</span>
                                <span className="font-serif">orlds.</span>
                            </h1>
                            <p className="animate-[hero-in_0.65s_ease-out_both_0.2s] font-serif text-lg text-pretty text-black/70 dark:text-white/70">
                                Brave adventurers, cursed relics, forbidden lands: <br></br>what secrets lie within your Grimoire?
                            </p>
                            <div className="flex flex-row items-center justify-start gap-2">
                                <Button
                                    render={<Link href={route('login')} />}
                                    className="bg-armor px-6 py-3 text-sm font-medium text-white hover:bg-armor/80"
                                >
                                    Log In
                                </Button>
                                <Button
                                    render={<Link href={route('register')} />}
                                    className="bg-magic px-6 py-3 text-sm font-medium text-white hover:bg-magic/80"
                                >
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    </section>

                    <section className="relative">
                        <div className="rounded-xl border border-border/50 bg-parchment/90 p-4 shadow-2xl backdrop-blur-sm dark:bg-jet/90">
                            <div className="space-y-6 rounded-lg border bg-card p-6">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-2">
                                        <Skeleton className={`h-7 w-48 ${previewSkeletonClassName}`} />
                                        <Skeleton className={`h-4 w-72 max-w-full ${previewSkeletonClassName}`} />
                                    </div>
                                    <Skeleton className={`h-10 w-32 ${previewSkeletonClassName}`} />
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <Skeleton className={`h-28 ${previewSkeletonClassName}`} />
                                    <Skeleton className={`h-28 ${previewSkeletonClassName}`} />
                                    <Skeleton className={`h-28 ${previewSkeletonClassName}`} />
                                </div>

                                <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                                    <div className="space-y-3 rounded-lg border p-4">
                                        <Skeleton className={`h-5 w-40 ${previewSkeletonClassName}`} />
                                        <Skeleton className={`h-16 ${previewSkeletonClassName}`} />
                                        <Skeleton className={`h-16 ${previewSkeletonClassName}`} />
                                        <Skeleton className={`h-16 ${previewSkeletonClassName}`} />
                                    </div>
                                    <div className="space-y-3 rounded-lg border p-4">
                                        <Skeleton className={`h-5 w-36 ${previewSkeletonClassName}`} />
                                        <Skeleton className={`h-20 ${previewSkeletonClassName}`} />
                                        <Skeleton className={`h-20 ${previewSkeletonClassName}`} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute inset-4 z-10 flex items-center justify-center rounded-lg bg-transparent p-6 dark:bg-jet/70">
                            <div className="max-w-3xl px-6 py-8 text-center md:px-10">
                                <h2 className="mb-4 font-serif text-4xl font-semibold text-tome dark:text-parchment">
                                    <Lombardic
                                        text="Coming Soon"
                                        letterClassName="text-5xl"
                                    />
                                </h2>
                                <p className="font-serif text-lg text-pretty text-primary dark:text-parchment/70">
                                    Grimoire is currently under development.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Trust Banner - Logo marquee with margin to clear overlapping dashboard */}
                {/* <div className="mt-24 mb-12 md:mt-72 md:mb-32">
                    <TrustBanner />
                </div> */}

                {/* Features - Bento Grid */}
                {/* <Features /> */}

                {/* How It Works - 3 Steps */}
                {/* <HowItWorks /> */}

                {/* Why Choose Us */}
                {/* <WhyChooseUs /> */}

                {/* Integrations */}
                {/* <Integrations /> */}

                {/* Reviews Section - Placeholder for future implementation */}
                {/*
                    <section className="w-full py-20">
                        <div className="mx-auto max-w-screen-2xl px-4">
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 text-4xl font-bold text-tome dark:text-parchment">What Our Users Say</h2>
                                <p className="mx-auto max-w-2xl text-lg text-tome/70 dark:text-parchment/70">
                                    Coming soon - reviews from our community of worldbuilders
                                </p>
                            </div>
                            Review cards will go here once we have user testimonials
                        </div>
                    </section>
                */}

                {/* Pricing */}
                {/* <Pricing /> */}

                {/* CTA Section */}
                {/* <CTASection /> */}

                {/* Footer */}
                <Footer />
            </ShaderBackgroundLayout>
        </>
    );
}
