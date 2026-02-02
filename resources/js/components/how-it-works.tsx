import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Feather, Rocket, UserPlus } from 'lucide-react';

const steps = [
    {
        step: 1,
        title: 'Create Your Account',
        description: 'Sign up in seconds and start your worldbuilding journey. No credit card required to explore.',
        icon: UserPlus,
    },
    {
        step: 2,
        title: 'Build Your World',
        description: 'Choose from templates or start from scratch. Create locations, characters, items, and lore with our powerful editors.',
        icon: Feather,
    },
    {
        step: 3,
        title: 'Bring It to Life',
        description: 'Explore your world in our AI-powered sandbox, share with your players, and sync with your favorite tools.',
        icon: Rocket,
    },
];

export default function HowItWorks() {
    return (
        <section className="w-full bg-parchment-50 py-20 dark:bg-jet/30">
            <div className="mx-auto max-w-screen-2xl px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-balance text-tome dark:text-parchment">How It Works</h2>
                    <p className="mx-auto max-w-2xl text-lg text-pretty text-tome/70 dark:text-parchment/70">
                        From signup to storytelling in three simple steps
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <Card
                                key={step.title}
                                className="relative border-tome/10 bg-parchment transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-parchment/10 dark:bg-jet"
                            >
                                <CardHeader className="pb-6">
                                    <div className="mb-4 flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-magic text-white">
                                            <span className="text-lg font-bold">{step.step}</span>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-magic/10">
                                            <Icon className="h-6 w-6 text-magic" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl text-balance text-tome dark:text-parchment">{step.title}</CardTitle>
                                    <CardDescription className="text-pretty text-tome/70 dark:text-parchment/70">{step.description}</CardDescription>
                                </CardHeader>

                                {/* Connector line for desktop */}
                                {index < steps.length - 1 && (
                                    <div className="absolute top-1/2 right-0 hidden h-px w-12 translate-x-1/2 -translate-y-1/2 bg-magic/30 md:block" />
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
