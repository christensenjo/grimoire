import { Form } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { type World } from './types';

interface WorldFormProps {
    action: string;
    method?: 'post' | 'patch';
    submitLabel: string;
    world?: World;
}

export function WorldForm({ action, method = 'post', submitLabel, world }: WorldFormProps) {
    return (
        <Form
            method={method}
            action={action}
            options={{
                preserveScroll: true,
            }}
            className="space-y-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="name">World name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={world?.name}
                            required
                            maxLength={120}
                            autoComplete="off"
                            placeholder="Marrow Falls"
                            aria-invalid={errors.name ? true : undefined}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={world?.description ?? ''}
                            maxLength={2000}
                            rows={5}
                            className="min-h-24"
                            placeholder="A fogbound river city of guilds, hidden canals, and whispered oaths."
                            aria-invalid={errors.description ? true : undefined}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                    >
                        {submitLabel}
                    </Button>
                </>
            )}
        </Form>
    );
}
