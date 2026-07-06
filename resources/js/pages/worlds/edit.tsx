import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { type World } from './types';
import { WorldForm } from './world-form';

interface EditWorldProps {
    world: World;
}

export default function EditWorld({ world }: EditWorldProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Worlds',
            href: route('worlds.index'),
        },
        {
            title: world.name,
            href: route('worlds.show', world.id),
        },
        {
            title: 'Edit',
            href: route('worlds.edit', world.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${world.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-foreground">Edit World</h1>
                        <p className="text-sm text-muted-foreground">Rename this World or revise its description.</p>
                    </div>
                    <Button
                        variant="outline"
                        render={<Link href={route('worlds.show', world.id)} />}
                    >
                        Back to World
                    </Button>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>{world.name}</CardTitle>
                        <CardDescription>Changes update the World immediately after saving.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WorldForm
                            action={route('worlds.update', world.id)}
                            method="patch"
                            submitLabel="Save World"
                            world={world}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
