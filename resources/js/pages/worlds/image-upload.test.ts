// @vitest-environment jsdom

import { Editor } from '@tiptap/core';
import type { JSONContent } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it, vi } from 'vitest';

import { uploadEditorImage } from './image-upload';

function findImageNode(node: JSONContent): JSONContent | undefined {
    if (node.type === 'image') {
        return node;
    }

    for (const child of node.content ?? []) {
        const image = findImageNode(child);

        if (image) {
            return image;
        }
    }

    return undefined;
}

describe('editor image uploads', () => {
    it('uploads an image with CSRF protection and returns its authorized URL', async () => {
        const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
            new Response(
                JSON.stringify({
                    image: {
                        id: 42,
                        url: 'https://grimoire.test/images/private-uuid',
                        alt: 'city map',
                    },
                }),
                {
                    status: 201,
                    headers: { 'Content-Type': 'application/json' },
                },
            ),
        );
        const file = new File(['image'], 'city-map.png', { type: 'image/png' });

        const image = await uploadEditorImage('/worlds/my-world/images', file, {
            fetcher,
            xsrfToken: 'csrf-token',
        });

        expect(image.url).toBe('https://grimoire.test/images/private-uuid');
        expect(fetcher).toHaveBeenCalledWith(
            '/worlds/my-world/images',
            expect.objectContaining({
                method: 'POST',
                credentials: 'same-origin',
                headers: expect.objectContaining({
                    'X-XSRF-TOKEN': 'csrf-token',
                }),
            }),
        );
    });

    it('surfaces the server image validation error', async () => {
        const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
            new Response(JSON.stringify({ errors: { image: ['Images may not be larger than 10 MB.'] } }), {
                status: 422,
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        await expect(
            uploadEditorImage('/worlds/my-world/images', new File(['large'], 'large.png'), {
                fetcher,
                xsrfToken: 'csrf-token',
            }),
        ).rejects.toThrow('Images may not be larger than 10 MB.');
    });

    it('serializes an inline image to markdown and loads it again', () => {
        const extensions = [StarterKit, Image.configure({ allowBase64: false, inline: true }), Markdown];
        const editor = new Editor({
            extensions,
            content: '',
            contentType: 'markdown',
        });

        editor.commands.setImage({
            src: 'https://grimoire.test/images/private-uuid',
            alt: 'city map',
        });

        const markdown = editor.getMarkdown();
        const reloaded = new Editor({
            extensions,
            content: markdown,
            contentType: 'markdown',
        });
        const imageNode = findImageNode(reloaded.getJSON());

        expect(markdown).toContain('![city map](https://grimoire.test/images/private-uuid)');
        expect(imageNode?.attrs).toMatchObject({
            src: 'https://grimoire.test/images/private-uuid',
            alt: 'city map',
        });

        editor.destroy();
        reloaded.destroy();
    });
});
