import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Castle, MapPin, PawPrint, ScrollText, Sparkles, Sword, UserRound } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const summaryStats = [
        { label: 'Settings', value: '4' },
        { label: 'Locations', value: '27' },
        { label: 'Characters', value: '19' },
        { label: 'Beasts', value: '8' },
    ];

    const settings = [
        {
            id: 'marrow-falls',
            name: 'Marrow Falls',
            description: 'A fogbound river city of guilds, hidden canals, and whispered oaths.',
            updated: '2 days ago',
            locations: 12,
            characters: 5,
            beasts: 2,
        },
        {
            id: 'sunbreak-archipelago',
            name: 'Sunbreak Archipelago',
            description: 'Tide-locked islands where sky sailors barter with stormcallers.',
            updated: '5 days ago',
            locations: 7,
            characters: 8,
            beasts: 3,
        },
        {
            id: 'glassreach',
            name: 'Glassreach',
            description: 'A crystalline desert kingdom guarded by mirage-bound sentinels.',
            updated: '1 week ago',
            locations: 5,
            characters: 4,
            beasts: 1,
        },
    ];

    const assetIcons = {
        Location: MapPin,
        Character: UserRound,
        Beast: PawPrint,
    } as const;

    type AssetType = keyof typeof assetIcons;

    const assets: Array<{
        id: string;
        type: AssetType;
        name: string;
        setting: string;
        detail: string;
        updated: string;
    }> = [
        {
            id: 'asset-1',
            type: 'Location',
            name: 'The Gilded Pier',
            setting: 'Marrow Falls',
            detail: 'Merchant docks & hidden tunnels',
            updated: 'Today',
        },
        {
            id: 'asset-2',
            type: 'Character',
            name: 'Captain Lyra Vale',
            setting: 'Sunbreak Archipelago',
            detail: 'Skyship captain with a storm pact',
            updated: 'Yesterday',
        },
        {
            id: 'asset-3',
            type: 'Beast',
            name: 'The Glass Stag',
            setting: 'Glassreach',
            detail: 'Guardian spirit of the dune-temples',
            updated: '3 days ago',
        },
        {
            id: 'asset-4',
            type: 'Location',
            name: 'Vault of Quiet Bells',
            setting: 'Glassreach',
            detail: 'Silent shrine beneath the dunes',
            updated: '4 days ago',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden rounded-xl p-4 md:p-6">
                <section className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Welcome back</p>
                            <h1 className="text-balance text-3xl font-semibold text-foreground">Your Grimoire Summary</h1>
                            <p className="text-pretty text-sm text-muted-foreground">
                                Keep your worldbuilding organized across settings, locations, and characters.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="outline" className="gap-2">
                                <ScrollText className="size-4" aria-hidden="true" />
                                New Setting
                            </Button>
                            <Button className="gap-2">
                                <Sparkles className="size-4" aria-hidden="true" />
                                Create Asset
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {summaryStats.map((stat) => (
                            <Card key={stat.label}>
                                <CardHeader className="pb-2">
                                    <CardDescription className="text-pretty">{stat.label}</CardDescription>
                                    <CardTitle className="text-2xl font-semibold tabular-nums">{stat.value}</CardTitle>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </section>

                <Separator />

                <section className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <h2 className="text-balance text-xl font-semibold text-foreground">My Grimoire Summary</h2>
                            <p className="text-pretty text-sm text-muted-foreground">
                                Review your settings and most recent assets at a glance.
                            </p>
                        </div>
                        <Badge variant="secondary" className="w-fit gap-1">
                            <Castle className="size-3.5" aria-hidden="true" />
                            3 Active Settings
                        </Badge>
                    </div>

                    <Tabs defaultValue="settings" className="w-full">
                        <TabsList>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                            <TabsTrigger value="assets">Assets</TabsTrigger>
                        </TabsList>

                        <TabsContent value="settings" className="pt-4">
                            <div className="grid gap-4 lg:grid-cols-2">
                                {settings.map((setting) => (
                                    <Card key={setting.id} className="h-full">
                                        <CardHeader className="flex flex-row items-start gap-4">
                                            <Avatar className="size-10">
                                                <AvatarFallback className="text-xs font-semibold">
                                                    {setting.name
                                                        .split(' ')
                                                        .map((word) => word[0])
                                                        .join('')
                                                        .slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <CardTitle className="text-base font-semibold text-foreground">
                                                        {setting.name}
                                                    </CardTitle>
                                                    <Badge variant="outline" className="text-xs">
                                                        Updated {setting.updated}
                                                    </Badge>
                                                </div>
                                                <CardDescription className="text-pretty text-sm">
                                                    {setting.description}
                                                </CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="size-4" aria-hidden="true" />
                                                    <span className="tabular-nums">{setting.locations} Locations</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <UserRound className="size-4" aria-hidden="true" />
                                                    <span className="tabular-nums">{setting.characters} Characters</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <PawPrint className="size-4" aria-hidden="true" />
                                                    <span className="tabular-nums">{setting.beasts} Beasts</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="assets" className="pt-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                {assets.map((asset) => {
                                    const Icon = assetIcons[asset.type];
                                    return (
                                        <Card key={asset.id}>
                                            <CardHeader className="space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <Badge variant="outline" className="gap-1 text-xs">
                                                        <Icon className="size-3.5" aria-hidden="true" />
                                                        {asset.type}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground tabular-nums">
                                                        Updated {asset.updated}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <CardTitle className="text-base font-semibold text-foreground">
                                                        {asset.name}
                                                    </CardTitle>
                                                    <CardDescription className="text-pretty text-sm">
                                                        {asset.detail}
                                                    </CardDescription>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Sword className="size-3.5" aria-hidden="true" />
                                                <span>{asset.setting}</span>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </TabsContent>
                    </Tabs>
                </section>
            </div>
        </AppLayout>
    );
}
