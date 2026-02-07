import CTASection from '@/components/cta-section';
import DashboardPreview from '@/components/dashboard-preview';
import Features from '@/components/features';
import Footer from '@/components/footer';
import HowItWorks from '@/components/how-it-works';
import Integrations from '@/components/integrations';
import Pricing from '@/components/pricing';
import TrustBanner from '@/components/trust-banner';
import { Button } from '@/components/ui/button';
import WhyChooseUs from '@/components/why-choose-us';
import ShaderBackgroundLayout from '@/layouts/shader-background-layout';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <ShaderBackgroundLayout>
                <div className="mx-auto flex max-w-screen-2xl flex-col px-4 py-6">
                    {/* Hero - reduced padding to show dashboard preview below */}
                    <section className="flex w-full flex-row items-center justify-between gap-16 pt-8 pb-12 md:pt-12 md:pb-16">
                        <div className="flex flex-col items-start justify-center gap-4">
                            <h1 className="font-serif animate-[hero-in_0.5s_ease-out_both] text-left text-5xl leading-tight text-balance text-black md:text-6xl dark:text-white">
                                <span className="font-title-shaded text-[96px] leading-none">S</span>
                                <span className="font-serif">top wrestling with notes…<br></br>…start building{' '}</span>
                                <span className="font-title-shaded text-[96px] leading-none">W</span>
                                <span className="font-serif">orlds.</span>
                            </h1>
                            <p className="font-serif animate-[hero-in_0.65s_ease-out_both_0.2s] text-lg text-pretty text-black/70 dark:text-white/70">
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
                                className="size-80 animate-[hero-in_0.8s_ease-out_both_0.4s] rounded-lg bg-white/5 object-cover"
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

                {/* Trust Banner - Logo marquee with margin to clear overlapping dashboard */}
                <div className="mt-24 mb-12 md:mt-72 md:mb-32">
                    <TrustBanner />
                </div>

                {/* Features - Bento Grid */}
                <Features />

                {/* How It Works - 3 Steps */}
                <HowItWorks />

                {/* Why Choose Us */}
                <WhyChooseUs />

                {/* Integrations */}
                <Integrations />

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
                <Pricing />

                {/* CTA Section */}
                <CTASection />

                {/* Footer */}
                <Footer />
            </ShaderBackgroundLayout>
        </>
    );
}
