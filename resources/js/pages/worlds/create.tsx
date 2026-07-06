import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { WorldForm } from './world-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Worlds',
        href: route('worlds.index'),
    },
    {
        title: 'Create',
        href: route('worlds.create'),
    },
];

export default function CreateWorld() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create World" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-foreground">Create World</h1>
                        <p className="text-sm text-muted-foreground">Start a new top-level home for your worldbuilding work.</p>
                    </div>
                    <Button
                        variant="outline"
                        render={<Link href={route('worlds.index')} />}
                    >
                        Back to Worlds
                    </Button>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>World details</CardTitle>
                        <CardDescription>Name is required. The description can stay loose until the world takes shape.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WorldForm
                            action={route('worlds.store')}
                            submitLabel="Create World"
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
