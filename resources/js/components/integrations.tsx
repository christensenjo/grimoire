import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { FileText, FolderSync, Music, NotebookText } from 'lucide-react';

function IntegrationIcon({ icon: Icon }: { icon: LucideIcon }) {
    return (
        <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-magic/10">
            <Icon className="size-6 text-magic" aria-hidden="true" />
        </div>
    );
}

function ComingSoonBadge() {
    return <div className="absolute top-4 right-4 rounded-full bg-armor/20 px-2 py-1 text-xs font-medium text-armor">Coming Soon</div>;
}

interface IntegrationCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    badge?: React.ReactNode;
}

function IntegrationCard({ title, description, icon, badge }: IntegrationCardProps) {
    return (
        <Card className="relative border-tome/10 bg-parchment transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-parchment/10 dark:bg-jet">
            {badge}
            <CardHeader>
                <IntegrationIcon icon={icon} />
                <CardTitle className="text-lg text-balance text-tome dark:text-parchment">{title}</CardTitle>
                <CardDescription className="text-pretty text-tome/70 dark:text-parchment/70">{description}</CardDescription>
            </CardHeader>
        </Card>
    );
}

export default function Integrations() {
    return (
        <section className="w-full bg-parchment-50 py-20 dark:bg-jet/30">
            <div className="mx-auto max-w-screen-2xl px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-balance text-tome dark:text-parchment font-serif"><span className="font-title text-5xl tracking-wide">I</span>ntegrations</h2>
                    <p className="mx-auto max-w-2xl text-lg text-pretty text-tome/70 dark:text-parchment/70 font-serif">
                        Connect with the tools you already love
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <IntegrationCard
                        title="File System"
                        description="Manage your files and assets via our Cloud Sync subscription, or keep local ownership. You're in charge."
                        icon={FolderSync}
                    />
                    <IntegrationCard
                        title="Spotify"
                        description="Connect your existing playlists and tie music to locations, characters, and moments in your world."
                        icon={Music}
                        badge={<ComingSoonBadge />}
                    />
                    <IntegrationCard
                        title="Obsidian"
                        description="Sync your worldbuilding notes with your Obsidian vault. Best of both worlds."
                        icon={NotebookText}
                        badge={<ComingSoonBadge />}
                    />
                    <IntegrationCard
                        title="Notion"
                        description="Import and export between Grimoire and Notion. Maintain your existing workflows."
                        icon={FileText}
                        badge={<ComingSoonBadge />}
                    />
                </div>
            </div>
        </section>
    );
}
