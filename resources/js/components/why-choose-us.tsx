import { Card, CardContent } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

const comparisons = [
    {
        category: 'Generic Note Apps',
        us: 'Purpose-built for worldbuilding with structured data, relationships, and templates',
        them: 'Flat documents with no structure for complex fictional worlds',
    },
    {
        category: 'Legacy Worldbuilding Tools',
        us: 'Modern interface with AI-powered features and real-time collaboration',
        them: "Clunky, outdated interfaces that haven't evolved in decades",
    },
    {
        category: 'Spreadsheets',
        us: 'Rich text editing, media embedding, and visual organization',
        them: 'Limited to rows and columns, no visual context or narrative flow',
    },
    {
        category: 'Wiki Software',
        us: 'Private by default, designed for creators not public consumption',
        them: 'Complex setup, designed for public wikis, steep learning curve',
    },
];

const benefits = [
    'Built specifically for worldbuilders, DMs, and writers',
    'AI-powered tools that enhance creativity, not replace it',
    'Sync with your existing workflow (Obsidian, Notion, local files)',
    'Active development with regular updates and new features',
    'Community-driven templates and shared assets',
    'Fair pricing with generous free tier',
];

export default function WhyChooseUs() {
    return (
        <section className="w-full py-20">
            <div className="mx-auto max-w-screen-2xl px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-balance text-tome dark:text-parchment">Why Choose Grimoire?</h2>
                    <p className="mx-auto max-w-2xl text-lg text-pretty text-tome/70 dark:text-parchment/70">
                        Stop fighting your tools. Start building worlds.
                    </p>
                </div>

                {/* Comparison Grid */}
                <div className="mb-12 grid gap-4 md:grid-cols-2">
                    {comparisons.map((comparison) => (
                        <Card key={comparison.category} className="border-tome/10 bg-parchment-50 dark:border-parchment/10 dark:bg-jet/50">
                            <CardContent className="p-6">
                                <h3 className="mb-4 font-semibold text-magic">vs. {comparison.category}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blood/20">
                                            <Check className="h-3 w-3 text-blood" aria-hidden="true" />
                                        </div>
                                        <p className="text-sm text-tome dark:text-parchment">{comparison.us}</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tome/10 dark:bg-parchment/10">
                                            <X className="h-3 w-3 text-tome/50 dark:text-parchment/50" aria-hidden="true" />
                                        </div>
                                        <p className="text-sm text-tome/50 line-through dark:text-parchment/50">{comparison.them}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Benefits List */}
                <div className="rounded-xl border border-magic/20 bg-magic/5 p-8 dark:bg-magic/10">
                    <h3 className="mb-6 text-center text-xl font-semibold text-balance text-tome dark:text-parchment">The Grimoire Advantage</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {benefits.map((benefit) => (
                            <div key={benefit} className="flex items-center gap-3">
                                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blood">
                                    <Check className="size-4 text-white" aria-hidden="true" />
                                </div>
                                <span className="text-sm text-tome dark:text-parchment">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
