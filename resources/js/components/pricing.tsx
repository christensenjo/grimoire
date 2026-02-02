import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles } from 'lucide-react';

interface Plan {
    name: string;
    price: string;
    period?: string;
    description: string;
    features: string[];
    cta: string;
}

const freePlan: Plan = {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
        'Limited number of files (1 setting, 5 locations, 10 characters, etc.)',
        'Access to basic templates',
        'Limited Library access (copy 3 assets/month)',
        'Local file storage only',
        'Basic AI credits (10/month)',
    ],
    cta: 'Get Started',
};

const basePlan: Plan = {
    name: 'Base',
    price: '$8',
    period: '/month',
    description: 'For serious worldbuilders',
    features: [
        'Unlimited files and assets',
        'Unlimited sharing and Library access',
        'Access to all templates',
        'Cloud Sync subscription included',
        'All integrations (Spotify, Obsidian, Notion)',
        'Standard AI credits (100/month)',
    ],
    cta: 'Start Building',
};

const proPlan: Plan = {
    name: 'Pro',
    price: '$20',
    period: '/month',
    description: 'For power users and teams',
    features: [
        'Everything in Base, plus:',
        '500 AI credits/month (best value)',
        'On-Demand AI available',
        'Transparent pay-as-you-go API pricing',
        'Priority support',
        'Early access to new features',
    ],
    cta: 'Go Pro',
};

function PlanFeatures({ features }: { features: string[] }) {
    return (
        <ul className="mb-6 flex-1 space-y-3">
            {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blood/20">
                        <Check className="size-3 text-blood" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-tome dark:text-parchment">{feature}</span>
                </li>
            ))}
        </ul>
    );
}

function PlanHeader({ plan }: { plan: Plan }) {
    return (
        <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-tome dark:text-parchment">{plan.name}</CardTitle>
            <CardDescription className="text-pretty text-tome/70 dark:text-parchment/70">{plan.description}</CardDescription>
            <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-tome tabular-nums dark:text-parchment">{plan.price}</span>
                {plan.period && <span className="ml-1 text-tome/60 dark:text-parchment/60">{plan.period}</span>}
            </div>
        </CardHeader>
    );
}

function PricingCard({ plan, children }: { plan: Plan; children?: React.ReactNode }) {
    return (
        <Card className="relative flex flex-col border-tome/10 bg-parchment-50 transition-all duration-300 hover:shadow-xl dark:border-parchment/10 dark:bg-jet/50">
            {children}
            <PlanHeader plan={plan} />
            <CardContent className="flex flex-1 flex-col">
                <PlanFeatures features={plan.features} />
                <Button className="w-full bg-tome hover:bg-tome/80 dark:bg-parchment dark:text-jet dark:hover:bg-parchment/80">{plan.cta}</Button>
            </CardContent>
        </Card>
    );
}

function PopularPricingCard({ plan }: { plan: Plan }) {
    return (
        <Card className="relative flex scale-105 flex-col border-magic bg-parchment-50 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-parchment/10 dark:bg-jet/50">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-magic px-4 py-1 text-sm font-medium text-white">
                <span className="flex items-center gap-1">
                    <Sparkles className="size-3" aria-hidden="true" />
                    Most Popular
                </span>
            </div>
            <PlanHeader plan={plan} />
            <CardContent className="flex flex-1 flex-col">
                <PlanFeatures features={plan.features} />
                <Button className="w-full bg-magic hover:bg-magic/80">{plan.cta}</Button>
            </CardContent>
        </Card>
    );
}

export default function Pricing() {
    return (
        <section className="w-full py-20">
            <div className="mx-auto max-w-screen-2xl px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-balance text-tome dark:text-parchment">Pricing</h2>
                    <p className="mx-auto max-w-2xl text-lg text-pretty text-tome/70 dark:text-parchment/70">
                        Choose the plan that fits your worldbuilding needs. Upgrade or downgrade anytime.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <PricingCard plan={freePlan} />
                    <PopularPricingCard plan={basePlan} />
                    <PricingCard plan={proPlan} />
                </div>

                <p className="mt-8 text-center text-sm text-tome/60 dark:text-parchment/60">
                    All plans include a 14-day free trial. No credit card required to start.
                </p>
            </div>
        </section>
    );
}
