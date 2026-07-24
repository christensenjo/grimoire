import { Form, Link, router } from '@inertiajs/react';
import { ChevronRight, FileText, Folder as FolderIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { type TreeFile, type TreeFolder, type World, type WorldFile, type WorldTree } from './types';

interface WorldTreeSidebarProps {
    world: World;
    tree: WorldTree;
    activeFile: WorldFile | null;
}

interface FolderNodeProps {
    folder: TreeFolder;
    depth: number;
    foldersByParent: Map<number | null, TreeFolder[]>;
    filesByFolder: Map<number | null, TreeFile[]>;
    worldSlug: string;
    activeFileId: number | null;
    onEditFolder: (folder: TreeFolder) => void;
    onDeleteFolder: (folder: TreeFolder) => void;
    onDeleteFile: (file: TreeFile) => void;
}

function folderOptions(folders: TreeFolder[], excludeId?: number): TreeFolder[] {
    if (excludeId === undefined) {
        return folders;
    }

    const excluded = new Set<number>([excludeId]);
    let changed = true;

    while (changed) {
        changed = false;
        for (const folder of folders) {
            if (folder.parentId !== null && excluded.has(folder.parentId) && !excluded.has(folder.id)) {
                excluded.add(folder.id);
                changed = true;
            }
        }
    }

    return folders.filter((folder) => !excluded.has(folder.id));
}

function FolderNode({
    folder,
    depth,
    foldersByParent,
    filesByFolder,
    worldSlug,
    activeFileId,
    onEditFolder,
    onDeleteFolder,
    onDeleteFile,
}: FolderNodeProps) {
    const [isOpen, setIsOpen] = useState(true);
    const childFolders = foldersByParent.get(folder.id) ?? [];
    const childFiles = filesByFolder.get(folder.id) ?? [];

    return (
        <div>
            <div
                className="group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
            >
                <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-1 text-left"
                    onClick={() => setIsOpen((open) => !open)}
                    aria-expanded={isOpen}
                >
                    <ChevronRight className={cn('size-3.5 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-90')} />
                    <FolderIcon
                        className="size-3.5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <span className="truncate">{folder.name}</span>
                </button>
                <button
                    type="button"
                    className="rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-background hover:text-foreground"
                    aria-label={`Edit folder ${folder.name}`}
                    onClick={() => onEditFolder(folder)}
                >
                    <Pencil className="size-3.5" />
                </button>
                {!folder.isImagesFolder ? (
                    <button
                        type="button"
                        className="rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-background hover:text-destructive"
                        aria-label={`Delete folder ${folder.name}`}
                        onClick={() => onDeleteFolder(folder)}
                    >
                        <Trash2 className="size-3.5" />
                    </button>
                ) : null}
            </div>
            {isOpen ? (
                <div>
                    {childFolders.map((child) => (
                        <FolderNode
                            key={child.id}
                            folder={child}
                            depth={depth + 1}
                            foldersByParent={foldersByParent}
                            filesByFolder={filesByFolder}
                            worldSlug={worldSlug}
                            activeFileId={activeFileId}
                            onEditFolder={onEditFolder}
                            onDeleteFolder={onDeleteFolder}
                            onDeleteFile={onDeleteFile}
                        />
                    ))}
                    {childFiles.map((file) => (
                        <FileRow
                            key={file.id}
                            file={file}
                            depth={depth + 1}
                            worldSlug={worldSlug}
                            isActive={activeFileId === file.id}
                            onDelete={onDeleteFile}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}

function FileRow({
    file,
    depth,
    worldSlug,
    isActive,
    onDelete,
}: {
    file: TreeFile;
    depth: number;
    worldSlug: string;
    isActive: boolean;
    onDelete: (file: TreeFile) => void;
}) {
    return (
        <div
            className={cn('group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-muted', isActive && 'bg-muted font-medium')}
            style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
        >
            <Link
                href={route('worlds.files.show', [worldSlug, file.slug])}
                className="flex min-w-0 flex-1 items-center gap-1.5"
                prefetch
            >
                <FileText
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                />
                <span className="truncate">{file.name}</span>
            </Link>
            {!file.isScratchpad ? (
                <button
                    type="button"
                    className="rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-background hover:text-destructive"
                    aria-label={`Delete file ${file.name}`}
                    onClick={() => onDelete(file)}
                >
                    <Trash2 className="size-3.5" />
                </button>
            ) : null}
        </div>
    );
}

export function WorldTreeSidebar({ world, tree, activeFile }: WorldTreeSidebarProps) {
    const [createKind, setCreateKind] = useState<'folder' | 'file' | null>(null);
    const [folderToEdit, setFolderToEdit] = useState<TreeFolder | null>(null);
    const [folderToDelete, setFolderToDelete] = useState<TreeFolder | null>(null);
    const [fileToDelete, setFileToDelete] = useState<TreeFile | null>(null);

    const foldersByParent = new Map<number | null, TreeFolder[]>();
    for (const folder of tree.folders) {
        const siblings = foldersByParent.get(folder.parentId) ?? [];
        siblings.push(folder);
        foldersByParent.set(folder.parentId, siblings);
    }

    const filesByFolder = new Map<number | null, TreeFile[]>();
    for (const file of tree.files) {
        const siblings = filesByFolder.get(file.folderId) ?? [];
        siblings.push(file);
        filesByFolder.set(file.folderId, siblings);
    }

    const rootFolders = foldersByParent.get(null) ?? [];
    const rootFiles = filesByFolder.get(null) ?? [];
    const createParentOptions = tree.folders;
    const editParentOptions = folderToEdit ? folderOptions(tree.folders, folderToEdit.id) : [];

    return (
        <aside className="flex h-full min-h-0 w-full flex-col border-r md:w-72">
            <div className="flex items-center justify-between gap-2 border-b p-3">
                <p className="text-sm font-medium">Files</p>
                <div className="flex gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 px-2"
                        onClick={() => setCreateKind('folder')}
                    >
                        <Plus
                            className="size-3.5"
                            aria-hidden="true"
                        />
                        Folder
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 px-2"
                        onClick={() => setCreateKind('file')}
                    >
                        <Plus
                            className="size-3.5"
                            aria-hidden="true"
                        />
                        File
                    </Button>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
                {rootFolders.length === 0 && rootFiles.length === 0 ? (
                    <p className="px-2 py-4 text-sm text-muted-foreground">No folders or files yet. Create one to start writing.</p>
                ) : (
                    <>
                        {rootFolders.map((folder) => (
                            <FolderNode
                                key={folder.id}
                                folder={folder}
                                depth={0}
                                foldersByParent={foldersByParent}
                                filesByFolder={filesByFolder}
                                worldSlug={world.slug}
                                activeFileId={activeFile?.id ?? null}
                                onEditFolder={setFolderToEdit}
                                onDeleteFolder={setFolderToDelete}
                                onDeleteFile={setFileToDelete}
                            />
                        ))}
                        {rootFiles.map((file) => (
                            <FileRow
                                key={file.id}
                                file={file}
                                depth={0}
                                worldSlug={world.slug}
                                isActive={activeFile?.id === file.id}
                                onDelete={setFileToDelete}
                            />
                        ))}
                    </>
                )}
            </div>

            <Dialog
                open={createKind !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setCreateKind(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{createKind === 'folder' ? 'New Folder' : 'New File'}</DialogTitle>
                        <DialogDescription>
                            {createKind === 'folder'
                                ? 'Folders group Files inside this World. Choose a parent to nest, or leave at the World root.'
                                : 'Files are free-form markdown notes stored in this World.'}
                        </DialogDescription>
                    </DialogHeader>
                    {createKind ? (
                        <Form
                            method="post"
                            action={createKind === 'folder' ? route('worlds.folders.store', world.slug) : route('worlds.files.store', world.slug)}
                            className="space-y-4"
                            options={{ preserveScroll: true }}
                            onSuccess={() => setCreateKind(null)}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-name">Name</Label>
                                        <Input
                                            id="create-name"
                                            name="name"
                                            required
                                            maxLength={120}
                                            autoComplete="off"
                                            autoFocus
                                            placeholder={createKind === 'folder' ? 'Characters' : 'Aria Vale'}
                                            aria-invalid={errors.name ? true : undefined}
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-parent">{createKind === 'folder' ? 'Parent folder' : 'Folder'}</Label>
                                        <select
                                            id="create-parent"
                                            name={createKind === 'folder' ? 'parent_id' : 'folder_id'}
                                            defaultValue=""
                                            className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                                        >
                                            <option value="">World root</option>
                                            {createParentOptions.map((folder) => (
                                                <option
                                                    key={folder.id}
                                                    value={folder.id}
                                                >
                                                    {folder.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.parent_id ?? errors.folder_id} />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCreateKind(null)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {createKind === 'folder' ? 'Create Folder' : 'Create File'}
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    ) : null}
                </DialogContent>
            </Dialog>

            <Dialog
                open={folderToEdit !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setFolderToEdit(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Folder</DialogTitle>
                        <DialogDescription>Rename this Folder or move it under another Folder in the same World.</DialogDescription>
                    </DialogHeader>
                    {folderToEdit ? (
                        <Form
                            method="patch"
                            action={route('worlds.folders.update', [world.slug, folderToEdit.slug])}
                            className="space-y-4"
                            options={{ preserveScroll: true }}
                            onSuccess={() => setFolderToEdit(null)}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-folder-name">Name</Label>
                                        <Input
                                            id="edit-folder-name"
                                            name="name"
                                            required
                                            maxLength={120}
                                            defaultValue={folderToEdit.name}
                                            autoComplete="off"
                                            aria-invalid={errors.name ? true : undefined}
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-folder-parent">Parent folder</Label>
                                        <select
                                            id="edit-folder-parent"
                                            name="parent_id"
                                            defaultValue={folderToEdit.parentId ?? ''}
                                            disabled={folderToEdit.isImagesFolder}
                                            className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                                        >
                                            <option value="">World root</option>
                                            {editParentOptions.map((folder) => (
                                                <option
                                                    key={folder.id}
                                                    value={folder.id}
                                                >
                                                    {folder.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.parent_id} />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setFolderToEdit(null)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Save Folder
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    ) : null}
                </DialogContent>
            </Dialog>

            <Dialog
                open={folderToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setFolderToDelete(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {folderToDelete?.name}?</DialogTitle>
                        <DialogDescription>
                            This removes the Folder and everything nested inside it. Root Files outside this Folder are kept.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFolderToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (!folderToDelete) {
                                    return;
                                }

                                router.delete(route('worlds.folders.destroy', [world.slug, folderToDelete.slug]), {
                                    preserveScroll: true,
                                    onSuccess: () => setFolderToDelete(null),
                                });
                            }}
                        >
                            Delete Folder
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={fileToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setFileToDelete(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {fileToDelete?.name}?</DialogTitle>
                        <DialogDescription>This permanently removes the File and its content.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFileToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (!fileToDelete) {
                                    return;
                                }

                                router.delete(route('worlds.files.destroy', [world.slug, fileToDelete.slug]), {
                                    preserveScroll: true,
                                    onSuccess: () => setFileToDelete(null),
                                });
                            }}
                        >
                            Delete File
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </aside>
    );
}
