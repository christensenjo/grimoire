import { Form, Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ChevronDown, FilePlus2, Files, Globe2, NotebookPen, ScrollText } from 'lucide-react';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Lombardic } from '@/components/lombardic';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

import { initialsForWorld, type RecentScratchpad, type Template, type TreeFolder, type World } from './worlds/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const SCRATCHPAD_AUTOSAVE_MS = 800;

interface DashboardProps {
    worlds: DashboardWorld[];
    recentScratchpad: RecentScratchpad | null;
    recentFiles: RecentFile[];
    summary: DashboardSummary;
    templates: Template[];
}

interface DashboardWorld extends World {
    fileCount: number;
    typeCounts: Record<string, number>;
    folders: TreeFolder[];
}

interface RecentFile {
    id: number;
    slug: string;
    name: string;
    worldSlug: string;
    worldName: string;
    updatedAt: string | null;
    updatedForHumans: string | null;
    template: Template | null;
}

interface DashboardSummary {
    worlds: number;
    files: number;
    typedFiles: number;
    types: Record<string, number>;
}

function DashboardScratchpad({ scratchpad, worlds }: { scratchpad: RecentScratchpad; worlds: Array<DashboardWorld & { scratchpadSlug: string }> }) {
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
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Scratchpads</DropdownMenuLabel>
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
                                </DropdownMenuGroup>
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

function CreateFileDialog({
    open,
    onOpenChange,
    worlds,
    templates,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    worlds: DashboardWorld[];
    templates: Template[];
}) {
    const [worldSlug, setWorldSlug] = useState(worlds[0]?.slug ?? '');
    const [folderId, setFolderId] = useState('');
    const selectedWorld = worlds.find((world) => world.slug === worldSlug) ?? worlds[0] ?? null;

    const handleOpenChange = (nextOpen: boolean) => {
        if (nextOpen) {
            setWorldSlug(worlds[0]?.slug ?? '');
            setFolderId('');
        }

        onOpenChange(nextOpen);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create File</DialogTitle>
                    <DialogDescription>
                        Choose a World and optional Template. The most recently active World is selected by default.
                    </DialogDescription>
                </DialogHeader>
                {selectedWorld ? (
                    <Form
                        method="post"
                        action={route('worlds.files.store', selectedWorld.slug)}
                        className="grid gap-4"
                        onSuccess={() => onOpenChange(false)}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="dashboard-file-name">Name</Label>
                                    <Input
                                        id="dashboard-file-name"
                                        name="name"
                                        required
                                        maxLength={120}
                                        autoComplete="off"
                                        autoFocus
                                        placeholder="Aria Vale"
                                        aria-invalid={errors.name ? true : undefined}
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="dashboard-file-world">World</Label>
                                        <NativeSelect
                                            id="dashboard-file-world"
                                            value={selectedWorld.slug}
                                            onChange={(event) => {
                                                setWorldSlug(event.target.value);
                                                setFolderId('');
                                            }}
                                        >
                                            {worlds.map((world) => (
                                                <option
                                                    key={world.id}
                                                    value={world.slug}
                                                >
                                                    {world.name}
                                                </option>
                                            ))}
                                        </NativeSelect>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="dashboard-file-folder">Folder</Label>
                                        <NativeSelect
                                            id="dashboard-file-folder"
                                            name="folder_id"
                                            value={folderId}
                                            onChange={(event) => setFolderId(event.target.value)}
                                        >
                                            <option value="">World root</option>
                                            {selectedWorld.folders.map((folder) => (
                                                <option
                                                    key={folder.id}
                                                    value={folder.id}
                                                >
                                                    {folder.name}
                                                </option>
                                            ))}
                                        </NativeSelect>
                                        <InputError message={errors.folder_id} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dashboard-file-template">Template</Label>
                                    <NativeSelect
                                        id="dashboard-file-template"
                                        name="template_id"
                                        defaultValue=""
                                    >
                                        <option value="">Blank File</option>
                                        {templates.map((template) => (
                                            <option
                                                key={template.id}
                                                value={template.id}
                                            >
                                                {template.name}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                    <InputError message={errors.template_id} />
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating…' : 'Create File'}
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

export default function Dashboard({ worlds, recentScratchpad, recentFiles, summary, templates }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const [isCreateFileOpen, setIsCreateFileOpen] = useState(false);
    const firstName = auth.user.name.trim().split(' ')[0];
    const greeting = firstName ? `Welcome back, ${firstName}` : 'Welcome back';
    const scratchpadWorlds = worlds.filter((world): world is DashboardWorld & { scratchpadSlug: string } => Boolean(world.scratchpadSlug));
    const summaryStats = [
        { key: 'worlds', label: 'Worlds', value: summary.worlds },
        { key: 'files', label: 'Files', value: summary.files },
        ...templates.map((template) => ({
            key: `template-${template.slug}`,
            label: template.slug === 'world' ? 'World Files' : `${template.name}s`,
            value: summary.types[template.slug] ?? 0,
        })),
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
                            <p className="text-sm text-pretty text-muted-foreground">Your Worlds and Scratchpad, ready when a thought shows up.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                className="gap-2"
                                disabled={worlds.length === 0}
                                onClick={() => setIsCreateFileOpen(true)}
                            >
                                <FilePlus2
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Create File
                            </Button>
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
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                        {summaryStats.map((stat) => (
                            <Card key={stat.key}>
                                <CardContent className="flex items-center justify-between gap-3 py-4">
                                    <div>
                                        <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    </div>
                                    {stat.label === 'Worlds' ? (
                                        <Globe2
                                            className="size-5 text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                    ) : stat.label === 'Files' ? (
                                        <Files
                                            className="size-5 text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                    ) : null}
                                </CardContent>
                            </Card>
                        ))}
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
                        <h2 className="text-xl font-semibold text-balance text-foreground">Recent Files</h2>
                        <p className="text-sm text-pretty text-muted-foreground">Continue where you last left off across your Worlds.</p>
                    </div>

                    {recentFiles.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {recentFiles.map((file) => (
                                <Card key={file.id}>
                                    <CardHeader className="gap-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <CardTitle className="text-base">
                                                <Link
                                                    href={route('worlds.files.show', [file.worldSlug, file.slug])}
                                                    className="hover:underline"
                                                >
                                                    {file.name}
                                                </Link>
                                            </CardTitle>
                                            {file.template ? <Badge variant="outline">{file.template.name}</Badge> : null}
                                        </div>
                                        <CardDescription>
                                            {file.worldName}
                                            {file.updatedForHumans ? ` · Updated ${file.updatedForHumans}` : ''}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardHeader>
                                <CardTitle>No recent Files yet</CardTitle>
                                <CardDescription>
                                    {worlds.length === 0
                                        ? 'Create your first World, then add a File to start writing.'
                                        : 'Create or edit a File and it will appear here.'}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    )}
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
                                    <CardContent className="flex flex-wrap gap-2">
                                        <Badge variant="secondary">
                                            {world.fileCount} {world.fileCount === 1 ? 'File' : 'Files'}
                                        </Badge>
                                        {templates.map((template) => (
                                            <Badge
                                                key={template.id}
                                                variant="outline"
                                            >
                                                {world.typeCounts[template.slug] ?? 0} {template.name}
                                            </Badge>
                                        ))}
                                    </CardContent>
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
            <CreateFileDialog
                open={isCreateFileOpen}
                onOpenChange={setIsCreateFileOpen}
                worlds={worlds}
                templates={templates}
            />
        </AppLayout>
    );
}
