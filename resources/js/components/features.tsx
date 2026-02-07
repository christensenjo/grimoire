import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Compass, FileText, Music } from 'lucide-react';

const features = [
    {
        title: 'Templates',
        description:
            'Use existing templates to build for your favorite use-case with speed, or start any creation from scratch with an empty canvas. Save your own templates for custom workflows.',
        icon: BookOpen,
        className: 'md:col-span-2',
    },
    {
        title: 'Editor',
        description:
            'Organize your worldbuilding assets and ideas across multiple files using purpose-built canvas, markdown, or simple text editors.',
        icon: FileText,
        className: 'md:col-span-2',
    },
    {
        title: 'Explorer',
        description:
            'Experience your settings like never before by stepping into a JRPG/MUD-like sandbox environment filled with your worldbuilding assets. Have conversations with NPCs and full SRPG playthroughs with the power of AI.',
        icon: Compass,
        className: 'md:col-span-2 md:row-span-2',
    },
    {
        title: 'Soundscapes',
        description:
            'Connect a Spotify account to enrich your worldbuilding and tie sound to locations or characters. Use a chat feature to create custom soundscapes for your settings via ElevenLabs Music API.',
        icon: Music,
        className: 'md:col-span-2',
    },
];

export default function Features() {
    return (
        <section className="w-full py-20">
            <div className="mx-auto max-w-screen-2xl px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-balance text-tome dark:text-parchment font-serif"><span className="font-title text-5xl tracking-wide">F</span>eatures</h2>
                    <p className="mx-auto max-w-2xl text-lg text-pretty text-tome/70 dark:text-parchment/70 font-serif">
                        Everything you need to build immersive worlds, from templates to AI-powered exploration
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={feature.title}
                                className={`border-tome/10 bg-parchment-50 transition-all duration-300 hover:border-magic/30 hover:shadow-lg dark:border-parchment/10 dark:bg-jet/50 ${feature.className}`}
                            >
                                <CardHeader>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-magic/10">
                                        <Icon className="h-6 w-6 text-magic" aria-hidden="true" />
                                    </div>
                                    <CardTitle className="text-xl text-balance text-tome dark:text-parchment">{feature.title}</CardTitle>
                                    <CardDescription className="text-pretty text-tome/70 dark:text-parchment/70">
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
