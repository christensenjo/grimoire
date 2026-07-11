import { Placeholder } from '@tiptap/extensions';
import { Markdown } from '@tiptap/markdown';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Code, Heading1, Heading2, Heading3, Italic, List, ListOrdered, Quote, Redo2, SquareCode, Strikethrough, Undo2 } from 'lucide-react';
import { useImperativeHandle } from 'react';

import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import './file-content-editor.css';

export type FileContentEditorHandle = {
    getMarkdown: () => string;
};

interface FileContentEditorProps {
    fileId: number;
    initialContent: string;
    onChange: (markdown: string) => void;
    ref?: React.Ref<FileContentEditorHandle | null>;
    className?: string;
}

type ToolbarButtonProps = {
    label: string;
    pressed?: boolean;
    disabled?: boolean;
    onPressedChange: () => void;
    children: React.ReactNode;
};

function ToolbarButton({ label, pressed = false, disabled = false, onPressedChange, children }: ToolbarButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Toggle
                        size="sm"
                        pressed={pressed}
                        disabled={disabled}
                        onPressedChange={() => onPressedChange()}
                        aria-label={label}
                    />
                }
            >
                {children}
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}

function EditorToolbar({ editor }: { editor: NonNullable<ReturnType<typeof useEditor>> }) {
    const state = useEditorState({
        editor,
        selector: ({ editor: current }) => ({
            bold: current.isActive('bold'),
            italic: current.isActive('italic'),
            strike: current.isActive('strike'),
            code: current.isActive('code'),
            heading1: current.isActive('heading', { level: 1 }),
            heading2: current.isActive('heading', { level: 2 }),
            heading3: current.isActive('heading', { level: 3 }),
            bulletList: current.isActive('bulletList'),
            orderedList: current.isActive('orderedList'),
            blockquote: current.isActive('blockquote'),
            codeBlock: current.isActive('codeBlock'),
            canUndo: current.can().undo(),
            canRedo: current.can().redo(),
        }),
    });

    return (
        <TooltipProvider delay={300}>
            <div
                className="flex flex-wrap items-center gap-1 rounded-md border border-input bg-muted/40 p-1"
                role="toolbar"
                aria-label="Formatting"
            >
                <ToolbarButton
                    label="Bold"
                    pressed={state.bold}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold />
                </ToolbarButton>
                <ToolbarButton
                    label="Italic"
                    pressed={state.italic}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic />
                </ToolbarButton>
                <ToolbarButton
                    label="Strikethrough"
                    pressed={state.strike}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough />
                </ToolbarButton>
                <ToolbarButton
                    label="Inline code"
                    pressed={state.code}
                    onPressedChange={() => editor.chain().focus().toggleCode().run()}
                >
                    <Code />
                </ToolbarButton>

                <Separator
                    orientation="vertical"
                    className="mx-1 h-6"
                />

                <ToolbarButton
                    label="Heading 1"
                    pressed={state.heading1}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 />
                </ToolbarButton>
                <ToolbarButton
                    label="Heading 2"
                    pressed={state.heading2}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 />
                </ToolbarButton>
                <ToolbarButton
                    label="Heading 3"
                    pressed={state.heading3}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 />
                </ToolbarButton>

                <Separator
                    orientation="vertical"
                    className="mx-1 h-6"
                />

                <ToolbarButton
                    label="Bullet list"
                    pressed={state.bulletList}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List />
                </ToolbarButton>
                <ToolbarButton
                    label="Ordered list"
                    pressed={state.orderedList}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered />
                </ToolbarButton>
                <ToolbarButton
                    label="Blockquote"
                    pressed={state.blockquote}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote />
                </ToolbarButton>
                <ToolbarButton
                    label="Code block"
                    pressed={state.codeBlock}
                    onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <SquareCode />
                </ToolbarButton>

                <Separator
                    orientation="vertical"
                    className="mx-1 h-6"
                />

                <ToolbarButton
                    label="Undo"
                    disabled={!state.canUndo}
                    onPressedChange={() => editor.chain().focus().undo().run()}
                >
                    <Undo2 />
                </ToolbarButton>
                <ToolbarButton
                    label="Redo"
                    disabled={!state.canRedo}
                    onPressedChange={() => editor.chain().focus().redo().run()}
                >
                    <Redo2 />
                </ToolbarButton>
            </div>
        </TooltipProvider>
    );
}

export function FileContentEditor({ fileId, initialContent, onChange, ref, className }: FileContentEditorProps) {
    const editor = useEditor(
        {
            immediatelyRender: false,
            extensions: [
                StarterKit,
                Placeholder.configure({
                    placeholder: 'Start writing… Markdown shortcuts and the toolbar both work.',
                }),
                Markdown,
            ],
            content: initialContent,
            contentType: 'markdown',
            editorProps: {
                attributes: {
                    class: 'tiptap focus:outline-none min-h-72 px-3 py-2',
                    'aria-label': 'File content',
                },
            },
            onUpdate: ({ editor: current }) => {
                onChange(current.getMarkdown());
            },
        },
        [fileId],
    );

    useImperativeHandle(
        ref,
        () => ({
            getMarkdown: () => editor?.getMarkdown() ?? initialContent,
        }),
        [editor, initialContent],
    );

    if (!editor) {
        return (
            <div className={cn('grid min-h-0 flex-1 gap-2', className)}>
                <div className="h-10 animate-pulse rounded-md bg-muted" />
                <div className="min-h-80 flex-1 animate-pulse rounded-md border border-input bg-muted/40" />
            </div>
        );
    }

    return (
        <div className={cn('grid min-h-0 flex-1 gap-2', className)}>
            <EditorToolbar editor={editor} />
            <div className="min-h-80 flex-1 overflow-y-auto rounded-md border border-input bg-transparent shadow-xs dark:bg-input/30">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
