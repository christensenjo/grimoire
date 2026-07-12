import { mergeAttributes, type MarkdownParseHelpers, type MarkdownToken } from '@tiptap/core';
import Mention from '@tiptap/extension-mention';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';

export type WikiLinkFile = {
    id: number;
    name: string;
    href: string;
};

export function wikiLinkHrefFromTarget(target: EventTarget | null): string | null {
    const wikiLink = target instanceof Element ? target.closest<HTMLElement>('[data-wiki-link-href]') : null;

    return wikiLink?.dataset.wikiLinkHref ?? null;
}

type WikiLinkSuggestionItem = {
    id: string;
    label: string;
};

const WikiLink = Mention.extend({
    name: 'wikiLink',
    markdownTokenName: 'wikiLink',
    markdownTokenizer: {
        name: 'wikiLink',
        level: 'inline',
        start: (source: string) => source.indexOf('[[file:'),
        tokenize: (source: string) => {
            const match = source.match(/^\[\[file:(\d+)\]\]/);

            if (!match) {
                return undefined;
            }

            return {
                type: 'wikiLink',
                raw: match[0],
                attributes: {
                    id: match[1],
                    mentionSuggestionChar: '[[',
                },
            };
        },
    },
    parseMarkdown: (token: MarkdownToken, helpers: MarkdownParseHelpers) =>
        helpers.createNode('wikiLink', {
            id: token.attributes?.id,
            mentionSuggestionChar: '[[',
        }),
    renderMarkdown: (node) => `[[file:${node.attrs?.id ?? ''}]]`,
});

function createSuggestionRenderer() {
    let currentProps: SuggestionProps<WikiLinkSuggestionItem, WikiLinkSuggestionItem> | null = null;
    let selectedIndex = 0;
    let root: HTMLDivElement | null = null;
    let unmount: (() => void) | null = null;

    const selectItem = (index: number) => {
        const item = currentProps?.items[index];

        if (item) {
            currentProps?.command(item);
        }
    };

    const renderItems = (props: SuggestionProps<WikiLinkSuggestionItem, WikiLinkSuggestionItem>) => {
        currentProps = props;
        selectedIndex = Math.min(selectedIndex, Math.max(0, props.items.length - 1));

        if (!root) {
            return;
        }

        root.replaceChildren();

        if (props.items.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'px-3 py-2 text-sm text-muted-foreground';
            empty.textContent = 'No matching Files';
            root.appendChild(empty);

            return;
        }

        props.items.forEach((item, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'flex w-full items-center rounded-sm px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground';
            button.dataset.selected = index === selectedIndex ? 'true' : 'false';
            button.setAttribute('role', 'option');
            button.setAttribute('aria-selected', index === selectedIndex ? 'true' : 'false');
            button.textContent = item.label;
            button.addEventListener('mousedown', (event) => {
                event.preventDefault();
                selectItem(index);
            });
            root?.appendChild(button);
        });
    };

    return {
        onStart: (props: SuggestionProps<WikiLinkSuggestionItem, WikiLinkSuggestionItem>) => {
            selectedIndex = 0;
            root = document.createElement('div');
            root.className = 'z-50 min-w-48 max-w-80 rounded-md border bg-popover p-1 text-popover-foreground shadow-md';
            root.setAttribute('role', 'listbox');
            root.setAttribute('aria-label', 'Wiki-link Files');
            renderItems(props);
            unmount = props.mount(root);
        },
        onUpdate: (props: SuggestionProps<WikiLinkSuggestionItem, WikiLinkSuggestionItem>) => {
            renderItems(props);
        },
        onKeyDown: ({ event }: SuggestionKeyDownProps) => {
            if (!currentProps || currentProps.items.length === 0) {
                return event.key === 'Enter';
            }

            if (event.key === 'ArrowUp') {
                selectedIndex = (selectedIndex + currentProps.items.length - 1) % currentProps.items.length;
                renderItems(currentProps);

                return true;
            }

            if (event.key === 'ArrowDown') {
                selectedIndex = (selectedIndex + 1) % currentProps.items.length;
                renderItems(currentProps);

                return true;
            }

            if (event.key === 'Enter') {
                selectItem(selectedIndex);

                return true;
            }

            return false;
        },
        onExit: () => {
            unmount?.();
            currentProps = null;
            root = null;
            unmount = null;
        },
    };
}

export function createWikiLinkExtension(getFiles: () => WikiLinkFile[]) {
    const findFile = (id: string | number | null): WikiLinkFile | undefined => {
        const targetId = Number(id);

        return getFiles().find((file) => file.id === targetId);
    };
    const ResolvedWikiLink = WikiLink.extend({
        parseMarkdown: (token: MarkdownToken, helpers: MarkdownParseHelpers) => {
            const id = token.attributes?.id;

            return helpers.createNode('wikiLink', {
                id,
                label: findFile(id)?.name ?? 'Missing File',
                mentionSuggestionChar: '[[',
            });
        },
    });

    return ResolvedWikiLink.configure({
        HTMLAttributes: {
            'data-wiki-link': '',
        },
        renderText: ({ node }) => findFile(node.attrs.id)?.name ?? 'Missing File',
        renderHTML: ({ node, options }) => {
            const file = findFile(node.attrs.id);

            if (!file) {
                return [
                    'span',
                    mergeAttributes(options.HTMLAttributes, {
                        'data-wiki-link': '',
                        'data-wiki-link-broken': '',
                        title: 'This File no longer exists',
                    }),
                    'Missing File',
                ];
            }

            return [
                'a',
                mergeAttributes(options.HTMLAttributes, {
                    'data-wiki-link': '',
                    'data-wiki-link-href': file.href,
                    href: file.href,
                }),
                file.name,
            ];
        },
        suggestion: {
            char: '[[',
            allowSpaces: true,
            allowedPrefixes: null,
            command: ({ editor, range, props }) => {
                editor
                    .chain()
                    .focus()
                    .insertContentAt(range, [
                        {
                            type: 'wikiLink',
                            attrs: {
                                id: props.id,
                                mentionSuggestionChar: '[[',
                            },
                        },
                        {
                            type: 'text',
                            text: ' ',
                        },
                    ])
                    .run();
            },
            items: ({ query }) => {
                const normalizedQuery = query.trim().toLocaleLowerCase();

                return getFiles()
                    .filter((file) => file.name.toLocaleLowerCase().includes(normalizedQuery))
                    .slice(0, 8)
                    .map((file) => ({
                        id: file.id.toString(),
                        label: file.name,
                    }));
            },
            render: createSuggestionRenderer,
        },
    });
}
