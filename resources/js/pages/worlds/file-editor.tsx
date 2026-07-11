import { Form } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { type TreeFolder, type World, type WorldFile } from './types';

interface FileEditorProps {
    world: World;
    file: WorldFile;
    folders: TreeFolder[];
}

export function FileEditor({ world, file, folders }: FileEditorProps) {
    const [name, setName] = useState(file.name);
    const [content, setContent] = useState(file.content);
    const [folderId, setFolderId] = useState<string>(file.folderId?.toString() ?? '');

    useEffect(() => {
        setName(file.name);
        setContent(file.content);
        setFolderId(file.folderId?.toString() ?? '');
    }, [file.id, file.name, file.content, file.folderId]);

    return (
        <Form
            method="patch"
            action={route('worlds.files.update', [world.slug, file.slug])}
            className="flex h-full min-h-0 flex-1 flex-col gap-4 p-4 md:p-6"
            options={{ preserveScroll: true }}
            transform={() => ({
                name,
                content,
                folder_id: folderId === '' ? null : Number(folderId),
            })}
        >
            {({ processing, errors, recentlySuccessful }) => (
                <>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-2xl">
                            <div className="grid gap-2">
                                <Label htmlFor="file-name">File name</Label>
                                <Input
                                    id="file-name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                    maxLength={120}
                                    autoComplete="off"
                                    aria-invalid={errors.name ? true : undefined}
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="file-folder">Folder</Label>
                                <select
                                    id="file-folder"
                                    value={folderId}
                                    onChange={(event) => setFolderId(event.target.value)}
                                    className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                                    aria-invalid={errors.folder_id ? true : undefined}
                                >
                                    <option value="">World root</option>
                                    {folders.map((folder) => (
                                        <option
                                            key={folder.id}
                                            value={folder.id}
                                        >
                                            {folder.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.folder_id} />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {recentlySuccessful ? <p className="text-sm text-muted-foreground">Saved</p> : null}
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Saving…' : 'Save'}
                            </Button>
                        </div>
                    </div>

                    <div className="grid min-h-0 flex-1 gap-2">
                        <Label htmlFor="file-content">Content</Label>
                        <Textarea
                            id="file-content"
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            className="min-h-80 flex-1 resize-y font-mono text-sm"
                            placeholder="Start writing in markdown…"
                            aria-invalid={errors.content ? true : undefined}
                        />
                        <InputError message={errors.content} />
                    </div>
                </>
            )}
        </Form>
    );
}
