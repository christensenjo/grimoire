import { readXsrfToken } from '@/lib/xsrf';

export type UploadedImage = {
    id: number;
    url: string;
    alt: string;
};

type UploadErrorPayload = {
    errors?: { image?: string[] };
    message?: string;
};

type UploadEditorImageOptions = {
    fetcher?: typeof fetch;
    xsrfToken?: string | null;
};

export async function uploadEditorImage(
    imageUploadUrl: string,
    file: globalThis.File,
    { fetcher = fetch, xsrfToken = readXsrfToken() }: UploadEditorImageOptions = {},
): Promise<UploadedImage> {
    if (!xsrfToken) {
        throw new Error('Could not verify the upload. Refresh the page and try again.');
    }

    const body = new FormData();
    body.append('image', file);

    const response = await fetcher(imageUploadUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrfToken,
        },
        body,
        credentials: 'same-origin',
    });
    const payload = (await response.json()) as { image?: UploadedImage } & UploadErrorPayload;

    if (!response.ok || !payload.image) {
        throw new Error(payload.errors?.image?.[0] ?? payload.message ?? 'The image could not be uploaded.');
    }

    return payload.image;
}
