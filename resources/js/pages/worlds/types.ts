export interface World {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    updatedAt: string | null;
    updatedForHumans: string | null;
    scratchpadSlug?: string | null;
}

export interface TreeFolder {
    id: number;
    slug: string;
    name: string;
    parentId: number | null;
}

export interface TreeFile {
    id: number;
    slug: string;
    name: string;
    folderId: number | null;
    isScratchpad: boolean;
}

export interface WorldTree {
    folders: TreeFolder[];
    files: TreeFile[];
}

export interface WorldFile {
    id: number;
    slug: string;
    name: string;
    folderId: number | null;
    content: string;
    format: string;
    updatedAt: string | null;
    isScratchpad: boolean;
}

export interface RecentScratchpad {
    worldSlug: string;
    worldName: string;
    fileSlug: string;
    fileName: string;
    content: string;
}

export function initialsForWorld(name: string) {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}
