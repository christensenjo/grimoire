import { Form, Head, Link } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { type World } from './types';

interface ShowWorldProps {
    world: World;
}

export default function ShowWorld({ world }: ShowWorldProps) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={world.name} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-semibold text-foreground">{world.name}</h1>
                            {world.updatedForHumans && (
                                <Badge
                                    variant="outline"
                                    className="text-xs"
                                >
                                    Updated {world.updatedForHumans}
                                </Badge>
                            )}
                        </div>
                        <p className="max-w-2xl text-sm text-pretty text-muted-foreground">
                            {world.description || 'No description yet. Add one to summarize the shape and tone of this World.'}
                        </p>
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
                            Edit
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
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                    Folders, files, and asset counts arrive in later slices.
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
