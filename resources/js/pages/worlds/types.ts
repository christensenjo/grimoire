export interface World {
    id: number;
    name: string;
    description: string | null;
    updatedAt: string | null;
    updatedForHumans: string | null;
}

export function initialsForWorld(name: string) {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}
