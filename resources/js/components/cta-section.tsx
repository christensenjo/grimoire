import { Lombardic } from '@/components/lombardic';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTASection() {
    return (
        <section className="w-full py-20">
            <div className="mx-auto max-w-screen-2xl px-4">
                <div className="relative overflow-hidden rounded-2xl bg-magic/10 p-8 md:p-12 lg:p-16">
                    <div className="relative z-10 flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
                        <div className="mb-8 lg:mb-0 lg:max-w-xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-magic/20 px-4 py-2 text-sm font-medium text-magic">
                                <Sparkles className="h-4 w-4" aria-hidden="true" />
                                Start your journey today
                            </div>
                            <h2 className="mb-4 text-3xl leading-tight font-bold text-balance text-tome md:text-4xl lg:text-5xl dark:text-parchment font-serif">
                                <Lombardic text="Ready to build worlds that captivate?" />
                            </h2>
                            <p className="mb-6 text-lg text-pretty text-tome/70 dark:text-parchment/70 font-serif">
                                Join thousands of worldbuilders, dungeon masters, and storytellers who've made Grimoire their creative home.
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row lg:justify-start">
                                <Button asChild size="lg" className="gap-2 bg-magic px-8 text-base font-medium text-white hover:bg-magic/80">
                                    <Link href={route('register')}>
                                        Get Started Free
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="border-tome/20 px-8 text-base hover:bg-tome/5 dark:border-parchment/20 dark:text-parchment"
                                >
                                    <Link href={route('features')}>Explore Features</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Placeholder for CTA image/illustration */}
                        <div className="hidden lg:block lg:shrink-0">
                            <div className="flex size-64 items-center justify-center rounded-xl bg-parchment-100/50 shadow-2xl dark:bg-jet/50">
                                <div className="text-center">
                                    <Sparkles className="mx-auto mb-2 size-16 text-magic/60" />
                                    <p className="text-sm text-tome/50 dark:text-parchment/50">CTA Illustration</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
