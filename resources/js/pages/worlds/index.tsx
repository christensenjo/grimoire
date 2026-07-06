import { Head, Link } from '@inertiajs/react';
import { Plus, ScrollText } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { initialsForWorld, type World } from './types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Worlds',
        href: route('worlds.index'),
    },
];

interface WorldsIndexProps {
    worlds: World[];
}

export default function WorldsIndex({ worlds }: WorldsIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Worlds" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-foreground">Worlds</h1>
                        <p className="text-sm text-muted-foreground">Manage the fictional universes that hold your files, folders, and images.</p>
                    </div>
                    <Button
                        className="w-fit gap-2"
                        render={<Link href={route('worlds.create')} />}
                    >
                        <Plus
                            className="size-4"
                            aria-hidden="true"
                        />
                        New World
                    </Button>
                </div>

                {worlds.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {worlds.map((world) => (
                            <Card key={world.id}>
                                <CardHeader className="flex flex-row items-start gap-4">
                                    <Avatar className="size-10">
                                        <AvatarFallback className="text-xs font-semibold">{initialsForWorld(world.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <CardTitle className="text-base font-semibold">
                                                <Link
                                                    href={route('worlds.show', world.id)}
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
                            <div className="flex items-start gap-4">
                                <div className="rounded-lg border bg-muted p-3">
                                    <ScrollText
                                        className="size-5 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle>No Worlds yet</CardTitle>
                                    <CardDescription>Create your first World to start organizing your worldbuilding work.</CardDescription>
                                </div>
                            </div>
                            <Button render={<Link href={route('worlds.create')} />}>Create World</Button>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
