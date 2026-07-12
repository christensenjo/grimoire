// @vitest-environment jsdom

import { Editor } from '@tiptap/core';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import { afterEach, describe, expect, it } from 'vitest';

import { createWikiLinkExtension, type WikiLinkFile, wikiLinkHrefFromTarget } from './wiki-link-extension';

const editors: Editor[] = [];

function createEditor(files: () => WikiLinkFile[], content = '') {
    const editor = new Editor({
        extensions: [StarterKit, createWikiLinkExtension(files), Markdown],
        content,
        contentType: 'markdown',
    });
    editors.push(editor);

    return editor;
}

afterEach(() => {
    editors.splice(0).forEach((editor) => editor.destroy());
    document.body.replaceChildren();
});

describe('wiki-link extension', () => {
    it('opens current-World suggestions for [[ and stores the target File id', async () => {
        const files = [
            { id: 2, name: 'Aria Vale', href: '/worlds/sunbreak/files/aria-vale' },
            { id: 3, name: 'Glassreach', href: '/worlds/sunbreak/files/glassreach' },
        ];
        const editor = createEditor(() => files);

        editor.commands.insertContent('[[ari');
        await new Promise((resolve) => setTimeout(resolve, 0));

        const listbox = document.querySelector('[role="listbox"]');
        const option = listbox?.querySelector<HTMLButtonElement>('[role="option"]');

        expect(listbox?.getAttribute('aria-label')).toBe('Wiki-link Files');
        expect(option?.textContent).toBe('Aria Vale');

        option?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        expect(editor.getMarkdown()).toContain('[[file:2]]');
    });

    it('renders the current target name and navigable URL after a rename', () => {
        let files = [{ id: 2, name: 'Old Name', href: '/worlds/sunbreak/files/old-name' }];
        const editor = createEditor(() => files, 'Visit [[file:2]].');

        expect(editor.getHTML()).toContain('Old Name');
        expect(editor.getHTML()).toContain('data-wiki-link-href="/worlds/sunbreak/files/old-name"');

        files = [{ id: 2, name: 'New Name', href: '/worlds/sunbreak/files/new-name' }];
        editor.commands.setContent(editor.getMarkdown(), {
            contentType: 'markdown',
            emitUpdate: false,
        });

        expect(editor.getHTML()).toContain('New Name');
        expect(editor.getHTML()).toContain('data-wiki-link-href="/worlds/sunbreak/files/new-name"');
        expect(editor.getMarkdown()).toContain('[[file:2]]');
        expect(wikiLinkHrefFromTarget(editor.view.dom.querySelector('[data-wiki-link-href]'))).toBe('/worlds/sunbreak/files/new-name');
    });

    it('renders a deleted target as visibly broken without navigation', () => {
        let files = [{ id: 99, name: 'Lost City', href: '/worlds/sunbreak/files/lost-city' }];
        const editor = createEditor(() => files, 'Lost [[file:99]].');

        files = [];
        editor.commands.setContent(editor.getMarkdown(), {
            contentType: 'markdown',
            emitUpdate: false,
        });

        const html = editor.getHTML();

        expect(html).toContain('Missing File');
        expect(html).toContain('data-wiki-link-broken');
        expect(html).not.toContain('data-wiki-link-href');
        expect(editor.getMarkdown()).toContain('[[file:99]]');
        expect(wikiLinkHrefFromTarget(editor.view.dom.querySelector('[data-wiki-link-broken]'))).toBeNull();
    });
});
