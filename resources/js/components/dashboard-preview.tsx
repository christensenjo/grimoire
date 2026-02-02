import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Scroll, Shield, Skull, Star, Sword } from 'lucide-react';

interface Campaign {
    id: number;
    name: string;
    type: 'Active' | 'Paused' | 'Completed';
    players: number;
    lastSession: string;
}

interface Character {
    id: number;
    name: string;
    class: string;
    level: number;
    campaign: string;
}

const sampleCampaigns: Campaign[] = [
    { id: 1, name: 'Shadows of Eldoria', type: 'Active', players: 4, lastSession: '2 days ago' },
    { id: 2, name: 'The Crimson Oath', type: 'Active', players: 3, lastSession: '5 days ago' },
    { id: 3, name: 'Beneath the Iron Mountain', type: 'Paused', players: 5, lastSession: '2 weeks ago' },
];

const sampleCharacters: Character[] = [
    { id: 1, name: 'Thorne Blackwood', class: 'Rogue', level: 7, campaign: 'Shadows of Eldoria' },
    { id: 2, name: 'Lyra Starweaver', class: 'Wizard', level: 5, campaign: 'The Crimson Oath' },
    { id: 3, name: 'Brak Stoneheart', class: 'Fighter', level: 8, campaign: 'Shadows of Eldoria' },
];

const getTypeColor = (type: Campaign['type']) => {
    switch (type) {
        case 'Active':
            return 'bg-blood text-white';
        case 'Paused':
            return 'bg-armor text-white';
        case 'Completed':
            return 'bg-magic text-white';
        default:
            return 'bg-secondary';
    }
};

const getClassIcon = (className: string) => {
    switch (className) {
        case 'Rogue':
            return <Sword className="h-4 w-4" />;
        case 'Wizard':
            return <Flame className="h-4 w-4" />;
        case 'Fighter':
            return <Shield className="h-4 w-4" />;
        default:
            return <Star className="h-4 w-4" />;
    }
};

export default function DashboardPreview() {
    return (
        <div className="w-full rounded-xl border border-border bg-parchment p-6 text-tome shadow-lg dark:bg-jet dark:text-parchment">
            {/* Dashboard Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-tome dark:text-parchment">Your Grimoire</h2>
                    <p className="text-sm text-tome/70 dark:text-parchment/70">Manage your campaigns, characters, and worlds</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Scroll className="h-4 w-4" />
                        New Campaign
                    </Button>
                    <Button size="sm" className="gap-2 bg-magic hover:bg-magic/80">
                        <Skull className="h-4 w-4" />
                        New Character
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="mb-6 grid grid-cols-3 gap-4">
                <Card className="border-tome/20 bg-parchment-50 dark:border-parchment/20 dark:bg-jet/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-tome/70 dark:text-parchment/70">Active Campaigns</CardDescription>
                        <CardTitle className="text-3xl text-blood">3</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-tome/20 bg-parchment-50 dark:border-parchment/20 dark:bg-jet/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-tome/70 dark:text-parchment/70">Total Characters</CardDescription>
                        <CardTitle className="text-3xl text-magic">12</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-tome/20 bg-parchment-50 dark:border-parchment/20 dark:bg-jet/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-tome/70 dark:text-parchment/70">Worlds Created</CardDescription>
                        <CardTitle className="text-3xl text-armor">2</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Campaigns Table */}
            <Card className="mb-4 border-tome/20 bg-parchment-50 dark:border-parchment/20 dark:bg-jet/50">
                <CardHeader>
                    <CardTitle className="text-lg text-tome dark:text-parchment">Recent Campaigns</CardTitle>
                    <CardDescription className="text-tome/70 dark:text-parchment/70">Your active and paused adventures</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {sampleCampaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                className="flex items-center justify-between rounded-lg border border-tome/10 p-3 transition-colors hover:bg-tome/5 dark:border-parchment/10 dark:hover:bg-parchment/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leather/20 dark:bg-leather/40">
                                        <Scroll className="h-5 w-5 text-leather dark:text-leather/80" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-tome dark:text-parchment">{campaign.name}</p>
                                        <p className="text-xs text-tome/60 dark:text-parchment/60">
                                            {campaign.players} players • Last played {campaign.lastSession}
                                        </p>
                                    </div>
                                </div>
                                <Badge className={getTypeColor(campaign.type)}>{campaign.type}</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Characters Preview */}
            <Card className="border-tome/20 bg-parchment-50 dark:border-parchment/20 dark:bg-jet/50">
                <CardHeader>
                    <CardTitle className="text-lg text-tome dark:text-parchment">Featured Characters</CardTitle>
                    <CardDescription className="text-tome/70 dark:text-parchment/70">Recently updated heroes and villains</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                        {sampleCharacters.map((character) => (
                            <div
                                key={character.id}
                                className="rounded-lg border border-tome/10 p-3 transition-colors hover:bg-tome/5 dark:border-parchment/10 dark:hover:bg-parchment/5"
                            >
                                <div className="mb-2 flex items-center gap-2">
                                    {getClassIcon(character.class)}
                                    <span className="text-sm font-medium text-tome dark:text-parchment">{character.name}</span>
                                </div>
                                <p className="text-xs text-tome/60 dark:text-parchment/60">
                                    Level {character.level} {character.class}
                                </p>
                                <p className="mt-1 text-xs text-magic">{character.campaign}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Scroll Indicator */}
            <div className="mt-6 text-center">
                <p className="text-xs text-tome/60 dark:text-parchment/60">Scroll down to explore more features</p>
            </div>
        </div>
    );
}
