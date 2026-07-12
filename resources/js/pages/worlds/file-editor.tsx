import { Form, router, useForm } from '@inertiajs/react';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { PromiseQueue } from '@/lib/promise-queue';
import { readXsrfToken } from '@/lib/xsrf';

import { type FileContentEditorHandle } from './file-content-editor';
import { type Template, type TreeFile, type TreeFolder, type World, type WorldFile } from './types';

const FileContentEditor = lazy(async () => {
    const module = await import('./file-content-editor');

    return { default: module.FileContentEditor };
});

type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

const AUTOSAVE_DELAY_MS = 1500;
/** Chromium keepalive body limit is ~64KiB; stay under it with headroom. */
const KEEPALIVE_BODY_LIMIT_BYTES = 60_000;

interface FileEditorProps {
    world: World;
    file: WorldFile;
    files: TreeFile[];
    folders: TreeFolder[];
    templates: Template[];
}

type FileContentPayload = {
    worldSlug: string;
    fileSlug: string;
    name: string;
    folderId: number | null;
    content: string;
};

function saveStatusLabel(status: SaveStatus): string | null {
    switch (status) {
        case 'dirty':
            return 'Unsaved changes';
        case 'saving':
            return 'Saving…';
        case 'saved':
            return 'Saved';
        case 'error':
            return 'Could not save — will retry when you edit again';
        default:
            return null;
    }
}

function EditorFallback() {
    return (
        <div className="grid min-h-0 flex-1 gap-2">
            <div className="h-10 animate-pulse rounded-md bg-muted" />
            <div className="min-h-80 flex-1 animate-pulse rounded-md border border-input bg-muted/40" />
        </div>
    );
}

/**
 * Persist File content during page teardown (tab close / refresh / unmount).
 * Uses fetch keepalive so the request can outlive the document.
 */
function flushFileContentKeepalive(payload: FileContentPayload): boolean {
    const token = readXsrfToken();

    if (!token) {
        return false;
    }

    const body = JSON.stringify({
        name: payload.name,
        folder_id: payload.folderId,
        content: payload.content,
    });

    if (new Blob([body]).size > KEEPALIVE_BODY_LIMIT_BYTES) {
        return false;
    }

    try {
        void fetch(route('worlds.files.update', [payload.worldSlug, payload.fileSlug]), {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': token,
            },
            body,
            credentials: 'same-origin',
            keepalive: true,
        });

        return true;
    } catch {
        return false;
    }
}

export function FileEditor({ world, file, files, folders, templates }: FileEditorProps) {
    const [name, setName] = useState(file.name);
    const [folderId, setFolderId] = useState<string>(file.folderId?.toString() ?? '');
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [contentError, setContentError] = useState<string | undefined>();
    const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isSavingDetails, setIsSavingDetails] = useState(false);
    const templateForm = useForm({
        template_id: file.template?.id.toString() ?? '',
        append_body: false,
    });

    const editorRef = useRef<FileContentEditorHandle | null>(null);
    const pendingMarkdownRef = useRef(file.content);
    const lastSavedMarkdownRef = useRef(file.content);
    const dirtyRef = useRef(false);
    const saveStatusRef = useRef<SaveStatus>('idle');
    const isSavingDetailsRef = useRef(false);
    const saveQueueRef = useRef(new PromiseQueue());
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fileMetaRef = useRef({
        worldSlug: world.slug,
        fileSlug: file.slug,
        name: file.name,
        folderId: file.folderId,
    });

    useEffect(() => {
        setName(file.name);
        setFolderId(file.folderId?.toString() ?? '');
        pendingMarkdownRef.current = file.content;
        lastSavedMarkdownRef.current = file.content;
        dirtyRef.current = false;
        saveStatusRef.current = 'idle';
        setSaveStatus('idle');
        setContentError(undefined);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
        // Only reset editor save state when switching Files — not when autosave refreshes props.
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally keyed on file.id
    }, [file.id]);

    useEffect(() => {
        fileMetaRef.current = {
            worldSlug: world.slug,
            fileSlug: file.slug,
            name: file.name,
            folderId: file.folderId,
        };
    }, [world.slug, file.slug, file.name, file.folderId]);

    useEffect(() => {
        saveStatusRef.current = saveStatus;
    }, [saveStatus]);

    const clearDebounce = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
    }, []);

    const persistContent = useCallback((_markdown: string): Promise<void> => {
        const runSave = async (): Promise<void> => {
            const markdown = pendingMarkdownRef.current;

            if (markdown === lastSavedMarkdownRef.current && saveStatusRef.current !== 'error') {
                dirtyRef.current = false;
                setSaveStatus('saved');

                return;
            }

            const meta = fileMetaRef.current;

            setSaveStatus('saving');
            saveStatusRef.current = 'saving';
            setContentError(undefined);

            await new Promise<void>((resolve) => {
                router.patch(
                    route('worlds.files.update', [meta.worldSlug, meta.fileSlug]),
                    {
                        name: meta.name,
                        folder_id: meta.folderId,
                        content: markdown,
                    },
                    {
                        preserveScroll: true,
                        preserveState: true,
                        onSuccess: () => {
                            lastSavedMarkdownRef.current = markdown;
                            const hasNewerChanges = pendingMarkdownRef.current !== markdown;

                            dirtyRef.current = hasNewerChanges;
                            setSaveStatus(hasNewerChanges ? 'dirty' : 'saved');
                            saveStatusRef.current = hasNewerChanges ? 'dirty' : 'saved';
                            resolve();
                        },
                        onError: (errors) => {
                            dirtyRef.current = true;
                            setSaveStatus('error');
                            saveStatusRef.current = 'error';
                            setContentError(typeof errors.content === 'string' ? errors.content : 'Could not save content.');
                            resolve();
                        },
                    },
                );
            });
        };

        return saveQueueRef.current.enqueue(runSave);
    }, []);

    const flushPendingSave = useCallback((): Promise<void> => {
        clearDebounce();

        const markdown = editorRef.current?.getMarkdown() ?? pendingMarkdownRef.current;

        pendingMarkdownRef.current = markdown;

        if (!dirtyRef.current && markdown === lastSavedMarkdownRef.current) {
            return Promise.resolve();
        }

        return persistContent(markdown);
    }, [clearDebounce, persistContent]);

    const handleContentChange = useCallback(
        (markdown: string) => {
            pendingMarkdownRef.current = markdown;

            if (markdown === lastSavedMarkdownRef.current) {
                dirtyRef.current = false;
                clearDebounce();
                setSaveStatus((current) => (current === 'saving' ? current : 'saved'));

                return;
            }

            dirtyRef.current = true;
            setSaveStatus('dirty');
            saveStatusRef.current = 'dirty';
            clearDebounce();

            debounceTimerRef.current = setTimeout(() => {
                debounceTimerRef.current = null;
                void persistContent(pendingMarkdownRef.current);
            }, AUTOSAVE_DELAY_MS);
        },
        [clearDebounce, persistContent],
    );

    const handleApplyTemplate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isApplyingTemplate || isUploadingImage || isSavingDetailsRef.current) {
            return;
        }

        setIsApplyingTemplate(true);

        void flushPendingSave()
            .then(() => {
                if (dirtyRef.current) {
                    setIsApplyingTemplate(false);

                    return;
                }

                templateForm.patch(route('worlds.files.template.update', [world.slug, file.slug]), {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: (page) => {
                        const updatedFile = page.props.file as WorldFile | null;

                        if (updatedFile) {
                            pendingMarkdownRef.current = updatedFile.content;
                            lastSavedMarkdownRef.current = updatedFile.content;
                            dirtyRef.current = false;
                            saveStatusRef.current = 'saved';
                            setSaveStatus('saved');
                            editorRef.current?.setMarkdown(updatedFile.content);
                        }

                        templateForm.reset('append_body');
                    },
                    onFinish: () => setIsApplyingTemplate(false),
                });
            })
            .catch(() => setIsApplyingTemplate(false));
    };

    useEffect(() => {
        const onBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!dirtyRef.current && !debounceTimerRef.current) {
                return;
            }

            clearDebounce();

            const markdown = editorRef.current?.getMarkdown() ?? pendingMarkdownRef.current;
            pendingMarkdownRef.current = markdown;

            if (markdown === lastSavedMarkdownRef.current && !dirtyRef.current) {
                return;
            }

            const meta = fileMetaRef.current;
            const flushed = flushFileContentKeepalive({
                worldSlug: meta.worldSlug,
                fileSlug: meta.fileSlug,
                name: meta.name,
                folderId: meta.folderId,
                content: markdown,
            });

            if (flushed) {
                dirtyRef.current = false;
                lastSavedMarkdownRef.current = markdown;

                return;
            }

            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', onBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
        };
    }, [clearDebounce]);

    useEffect(() => {
        const removeListener = router.on('before', (event) => {
            if (event.detail.visit.method !== 'get') {
                return;
            }

            if (!dirtyRef.current && !debounceTimerRef.current) {
                return;
            }

            event.preventDefault();

            const nextUrl = String(event.detail.visit.url);
            const { replace, preserveScroll, preserveState } = event.detail.visit;

            void flushPendingSave().then(() => {
                if (dirtyRef.current) {
                    return;
                }

                router.visit(nextUrl, {
                    method: 'get',
                    replace,
                    preserveScroll,
                    preserveState,
                });
            });
        });

        return removeListener;
    }, [flushPendingSave]);

    useEffect(() => {
        return () => {
            clearDebounce();

            if (!dirtyRef.current) {
                return;
            }

            const meta = fileMetaRef.current;
            const markdown = pendingMarkdownRef.current;

            flushFileContentKeepalive({
                worldSlug: meta.worldSlug,
                fileSlug: meta.fileSlug,
                name: meta.name,
                folderId: meta.folderId,
                content: markdown,
            });
        };
    }, [clearDebounce]);

    const statusLabel = saveStatusLabel(saveStatus);

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col gap-4 p-4 md:p-6">
            <Form
                method="patch"
                action={route('worlds.files.update', [world.slug, file.slug])}
                className="flex flex-col gap-3"
                options={{ preserveScroll: true }}
                onSubmit={(event) => {
                    if (isApplyingTemplate || isUploadingImage || isSavingDetails) {
                        event.preventDefault();
                    }
                }}
                onStart={() => {
                    isSavingDetailsRef.current = true;
                    setIsSavingDetails(true);
                }}
                transform={() => ({
                    name,
                    folder_id: folderId === '' ? null : Number(folderId),
                })}
                onFinish={() => {
                    isSavingDetailsRef.current = false;
                    setIsSavingDetails(false);
                }}
            >
                {({ processing, errors }) => (
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
                                    disabled={isApplyingTemplate || isUploadingImage || isSavingDetails}
                                    aria-invalid={errors.name ? true : undefined}
                                />
                                <InputError message={errors.name} />
                            </div>
                            {!file.isScratchpad ? (
                                <div className="grid gap-2">
                                    <Label htmlFor="file-folder">Folder</Label>
                                    <NativeSelect
                                        id="file-folder"
                                        value={folderId}
                                        onChange={(event) => setFolderId(event.target.value)}
                                        disabled={isApplyingTemplate || isUploadingImage || isSavingDetails}
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
                                    </NativeSelect>
                                    <InputError message={errors.folder_id} />
                                </div>
                            ) : null}
                        </div>
                        <div className="flex items-center gap-3">
                            {statusLabel ? (
                                <p
                                    className={saveStatus === 'error' ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'}
                                    aria-live="polite"
                                >
                                    {statusLabel}
                                </p>
                            ) : null}
                            <Button
                                type="submit"
                                disabled={processing || isApplyingTemplate || isUploadingImage || isSavingDetails}
                            >
                                {processing ? 'Saving…' : 'Save details'}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>

            <div className="grid min-h-0 flex-1 gap-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Label>Content</Label>
                        {file.template ? <Badge variant="outline">{file.template.name}</Badge> : null}
                    </div>
                    <form
                        className="grid gap-1"
                        onSubmit={handleApplyTemplate}
                    >
                        <div className="flex items-center gap-2">
                            <Label
                                htmlFor="file-template"
                                className="sr-only"
                            >
                                Template
                            </Label>
                            <NativeSelect
                                id="file-template"
                                name="template_id"
                                value={templateForm.data.template_id}
                                onChange={(event) => templateForm.setData('template_id', event.target.value)}
                                required
                                disabled={isApplyingTemplate || isUploadingImage || isSavingDetails}
                                className="w-auto"
                            >
                                <option
                                    value=""
                                    disabled
                                >
                                    Choose Template
                                </option>
                                {templates.map((template) => (
                                    <option
                                        key={template.id}
                                        value={template.id}
                                    >
                                        {template.name}
                                    </option>
                                ))}
                            </NativeSelect>
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={isApplyingTemplate || isUploadingImage || isSavingDetails}
                            >
                                {isApplyingTemplate
                                    ? 'Applying…'
                                    : isUploadingImage
                                      ? 'Uploading image…'
                                      : isSavingDetails
                                        ? 'Saving details…'
                                        : file.template
                                          ? 'Change type'
                                          : 'Apply type'}
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="append-template-body"
                                name="append_body"
                                checked={templateForm.data.append_body}
                                onCheckedChange={(checked) => templateForm.setData('append_body', checked)}
                                disabled={isApplyingTemplate || isUploadingImage || isSavingDetails}
                            />
                            <Label
                                htmlFor="append-template-body"
                                className="text-xs font-normal text-muted-foreground"
                            >
                                Add the Template prompts after existing content
                            </Label>
                        </div>
                        <InputError message={templateForm.errors.template_id} />
                    </form>
                </div>
                <Suspense fallback={<EditorFallback />}>
                    <FileContentEditor
                        ref={editorRef}
                        fileId={file.id}
                        initialContent={file.content}
                        imageUploadUrl={route('worlds.images.store', world.slug)}
                        wikiLinkFiles={files.map((wikiLinkFile) => ({
                            id: wikiLinkFile.id,
                            name: wikiLinkFile.name,
                            href: route('worlds.files.show', [world.slug, wikiLinkFile.slug]),
                        }))}
                        editable={!isApplyingTemplate}
                        onChange={handleContentChange}
                        onUploadStateChange={setIsUploadingImage}
                    />
                </Suspense>
                <InputError message={contentError} />
            </div>
        </div>
    );
}
