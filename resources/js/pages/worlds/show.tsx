import { Form, Head, Link } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { FileEditor } from './file-editor';
import { type World, type WorldFile, type WorldTree } from './types';
import { WorldTreeSidebar } from './world-tree-sidebar';

interface ShowWorldProps {
    world: World;
    tree: WorldTree;
    file: WorldFile | null;
}

export default function ShowWorld({ world, tree, file }: ShowWorldProps) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Worlds',
            href: route('worlds.index'),
        },
        {
            title: world.name,
            href: route('worlds.show', world.id),
        },
    ];

    if (file) {
        breadcrumbs.push({
            title: file.name,
            href: route('worlds.files.show', [world.id, file.id]),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={file ? `${file.name} · ${world.name}` : world.name} />

            <div className="flex h-full min-h-0 flex-1 flex-col">
                <div className="flex flex-col gap-3 border-b px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
                    <div className="min-w-0 space-y-1">
                        <h1 className="truncate text-xl font-semibold text-foreground">{world.name}</h1>
                        <p className="truncate text-sm text-muted-foreground">{world.description || 'No description yet.'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            className="gap-2"
                            render={<Link href={route('worlds.edit', world.id)} />}
                        >
                            <Pencil
                                className="size-4"
                                aria-hidden="true"
                            />
                            Edit World
                        </Button>
                        <Button
                            variant="destructive"
                            className="gap-2"
                            onClick={() => setIsDeleteOpen(true)}
                        >
                            <Trash2
                                className="size-4"
                                aria-hidden="true"
                            />
                            Delete World
                        </Button>
                    </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col md:flex-row">
                    <WorldTreeSidebar
                        world={world}
                        tree={tree}
                        activeFile={file}
                    />
                    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
                        {file ? (
                            <FileEditor
                                world={world}
                                file={file}
                                folders={tree.folders}
                            />
                        ) : (
                            <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted-foreground">
                                Select a File from the sidebar, or create one to start writing.
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <Dialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {world.name}?</DialogTitle>
                        <DialogDescription>This removes the World and its data. This action cannot be undone after you confirm.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Form
                            method="delete"
                            action={route('worlds.destroy', world.id)}
                        >
                            {({ processing }) => (
                                <Button
                                    variant="destructive"
                                    disabled={processing}
                                >
                                    Delete World
                                </Button>
                            )}
                        </Form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
