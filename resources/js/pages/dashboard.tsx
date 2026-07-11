import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ChevronDown, NotebookPen, ScrollText } from 'lucide-react';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Lombardic } from '@/components/lombardic';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

import { initialsForWorld, type RecentScratchpad, type World } from './worlds/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const SCRATCHPAD_AUTOSAVE_MS = 800;

interface DashboardProps {
    worlds: World[];
    recentScratchpad: RecentScratchpad | null;
}

function DashboardScratchpad({ scratchpad, worlds }: { scratchpad: RecentScratchpad; worlds: Array<World & { scratchpadSlug: string }> }) {
    const { data, setData, setDefaults, patch, processing, errors, isDirty, recentlySuccessful } = useForm({
        name: scratchpad.fileName,
        folder_id: null as number | null,
        content: scratchpad.content,
    });
    const [saveLabel, setSaveLabel] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scratchpadKey = `${scratchpad.worldSlug}:${scratchpad.fileSlug}`;

    useEffect(() => {
        setData({
            name: scratchpad.fileName,
            folder_id: null,
            content: scratchpad.content,
        });
        setDefaults({
            name: scratchpad.fileName,
            folder_id: null,
            content: scratchpad.content,
        });
        setSaveLabel(null);
        // Reset only when switching Scratchpads; content prop updates after save are ignored while typing.
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional key-based reset
    }, [scratchpadKey]);

    const save = useEffectEvent(() => {
        patch(route('worlds.files.update', [scratchpad.worldSlug, scratchpad.fileSlug]), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setDefaults({
                    name: data.name,
                    folder_id: null,
                    content: data.content,
                });
                setSaveLabel('Saved');
            },
            onError: () => setSaveLabel('Could not save'),
        });
    });

    useEffect(() => {
        if (!isDirty) {
            return;
        }

        setSaveLabel('Unsaved changes');

        if (debounceRef.current !== null) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            save();
        }, SCRATCHPAD_AUTOSAVE_MS);

        return () => {
            if (debounceRef.current !== null) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [data.content, isDirty]);

    useEffect(() => {
        if (recentlySuccessful) {
            setSaveLabel('Saved');
        }
    }, [recentlySuccessful]);

    return (
        <Card>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <NotebookPen
                            className="size-4 text-muted-foreground"
                            aria-hidden="true"
                        />
                        Scratchpad
                    </CardTitle>
                    <CardDescription>
                        Quick notes for <span className="font-medium text-foreground">{scratchpad.worldName}</span>
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {saveLabel ? <span className="text-xs text-muted-foreground tabular-nums">{processing ? 'Saving…' : saveLabel}</span> : null}
                    {worlds.length > 1 ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1"
                                    />
                                }
                            >
                                Switch World
                                <ChevronDown
                                    className="size-3.5"
                                    aria-hidden="true"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-64"
                            >
                                <DropdownMenuLabel>Scratchpads</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {worlds.map((world) => (
                                    <DropdownMenuItem
                                        key={world.id}
                                        onClick={() => {
                                            router.get(
                                                route('dashboard'),
                                                { scratchpad: world.slug },
                                                {
                                                    preserveScroll: true,
                                                    only: ['recentScratchpad'],
                                                },
                                            );
                                        }}
                                    >
                                        {world.name}
                                        {world.slug === scratchpad.worldSlug ? (
                                            <span className="ml-auto text-xs text-muted-foreground">Current</span>
                                        ) : null}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <Textarea
                    id="dashboard-scratchpad"
                    aria-label={`${scratchpad.worldName} Scratchpad`}
                    value={data.content}
                    onChange={(event) => setData('content', event.target.value)}
                    placeholder="Capture a thought…"
                    className="field-sizing-fixed max-h-[40vh] min-h-28 resize-y overflow-y-auto"
                />
                <InputError message={errors.content ?? errors.name} />
            </CardContent>
        </Card>
    );
}

export default function Dashboard({ worlds, recentScratchpad }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const firstName = auth.user.name.trim().split(' ')[0];
    const greeting = firstName ? `Welcome back, ${firstName}` : 'Welcome back';
    const scratchpadWorlds = worlds.filter((world): world is World & { scratchpadSlug: string } => Boolean(world.scratchpadSlug));

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
                            <p className="text-sm text-pretty text-muted-foreground">Your Worlds and Scratchpad, ready when a thought shows up.</p>
                        </div>
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
                    </div>

                    {recentScratchpad ? (
                        <DashboardScratchpad
                            scratchpad={recentScratchpad}
                            worlds={scratchpadWorlds}
                        />
                    ) : null}
                </section>

                <Separator />

                <section className="flex flex-col gap-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-balance text-foreground">Worlds</h2>
                        <p className="text-sm text-pretty text-muted-foreground">Open a World to continue writing.</p>
                    </div>

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
                                                {world.updatedForHumans ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        Updated {world.updatedForHumans}
                                                    </Badge>
                                                ) : null}
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
                </section>
            </div>
        </AppLayout>
    );
}
