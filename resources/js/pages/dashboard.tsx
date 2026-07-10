import { Head, Link, usePage } from '@inertiajs/react';
import { Castle, MapPin, PawPrint, ScrollText, Sparkles, Sword, UserRound } from 'lucide-react';

import { Lombardic } from '@/components/lombardic';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

import { initialsForWorld, type World } from './worlds/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    worlds: World[];
}

export default function Dashboard({ worlds }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const firstName = auth.user.name.trim().split(' ')[0];
    const greeting = firstName ? `Welcome back, ${firstName}` : 'Welcome back';
    const summaryStats = [
        { label: 'Worlds', value: worlds.length.toString() },
        { label: 'Locations', value: '27' },
        { label: 'Characters', value: '19' },
        { label: 'Beasts', value: '8' },
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
        world: string;
        detail: string;
        updated: string;
    }> = [
        {
            id: 'asset-1',
            type: 'Location',
            name: 'The Gilded Pier',
            world: 'Marrow Falls',
            detail: 'Merchant docks & hidden tunnels',
            updated: 'Today',
        },
        {
            id: 'asset-2',
            type: 'Character',
            name: 'Captain Lyra Vale',
            world: 'Sunbreak Archipelago',
            detail: 'Skyship captain with a storm pact',
            updated: 'Yesterday',
        },
        {
            id: 'asset-3',
            type: 'Beast',
            name: 'The Glass Stag',
            world: 'Glassreach',
            detail: 'Guardian spirit of the dune-temples',
            updated: '3 days ago',
        },
        {
            id: 'asset-4',
            type: 'Location',
            name: 'Vault of Quiet Bells',
            world: 'Glassreach',
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
                            <h1 className="font-serif text-3xl font-semibold text-balance text-foreground">
                                <Lombardic text={greeting} />
                            </h1>
                            <p className="text-sm text-pretty text-muted-foreground">
                                Keep your worldbuilding organized across worlds, locations, and characters.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                className="gap-2"
                                render={<Link href={route('worlds.create')} />}
                            >
                                <ScrollText
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                New World
                            </Button>
                            <Button className="gap-2">
                                <Sparkles
                                    className="size-4"
                                    aria-hidden="true"
                                />
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
                            <h2 className="text-xl font-semibold text-balance text-foreground">My Grimoire Summary</h2>
                            <p className="text-sm text-pretty text-muted-foreground">Review your worlds and most recent assets at a glance.</p>
                        </div>
                        <Badge
                            variant="secondary"
                            className="w-fit gap-1"
                        >
                            <Castle
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            {worlds.length} Active {worlds.length === 1 ? 'World' : 'Worlds'}
                        </Badge>
                    </div>

                    <Tabs
                        defaultValue="worlds"
                        className="w-full"
                    >
                        <TabsList>
                            <TabsTrigger value="worlds">Worlds</TabsTrigger>
                            <TabsTrigger value="assets">Assets</TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value="worlds"
                            className="pt-4"
                        >
                            {worlds.length > 0 ? (
                                <div className="grid gap-4 lg:grid-cols-2">
                                    {worlds.map((world) => (
                                        <Card
                                            key={world.id}
                                            className="h-full"
                                        >
                                            <CardHeader className="flex flex-row items-start gap-4">
                                                <Avatar className="size-10">
                                                    <AvatarFallback className="text-xs font-semibold">{initialsForWorld(world.name)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <CardTitle className="text-base font-semibold text-foreground">
                                                            <Link
                                                                href={route('worlds.show', world.slug)}
                                                                className="hover:underline"
                                                            >
                                                                {world.name}
                                                            </Link>
                                                        </CardTitle>
                                                        {world.updatedForHumans && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                Updated {world.updatedForHumans}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <CardDescription className="text-sm text-pretty">
                                                        {world.description || 'No description yet.'}
                                                    </CardDescription>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-dashed">
                                    <CardHeader className="items-start gap-4 md:flex-row md:items-center md:justify-between">
                                        <div className="space-y-1">
                                            <CardTitle>No Worlds yet</CardTitle>
                                            <CardDescription>Create your first World to start organizing files, folders, and images.</CardDescription>
                                        </div>
                                        <Button render={<Link href={route('worlds.create')} />}>Create World</Button>
                                    </CardHeader>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent
                            value="assets"
                            className="pt-4"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                {assets.map((asset) => {
                                    const Icon = assetIcons[asset.type];
                                    return (
                                        <Card key={asset.id}>
                                            <CardHeader className="space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1 text-xs"
                                                    >
                                                        <Icon
                                                            className="size-3.5"
                                                            aria-hidden="true"
                                                        />
                                                        {asset.type}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground tabular-nums">Updated {asset.updated}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <CardTitle className="text-base font-semibold text-foreground">{asset.name}</CardTitle>
                                                    <CardDescription className="text-sm text-pretty">{asset.detail}</CardDescription>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Sword
                                                    className="size-3.5"
                                                    aria-hidden="true"
                                                />
                                                <span>{asset.world}</span>
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
