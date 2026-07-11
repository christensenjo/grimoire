# TipTap (open-source core) as the editor engine

The v1.0 editor is built on TipTap's MIT-licensed open-source core, self-hosted via npm, serializing documents to markdown for storage (per ADR-0002). We pay nothing and take no dependency on Tiptap Platform (their paid cloud for collaboration hosting, document storage, and Content AI) — all AI features are delivered through our own backend via `laravel/ai`.

## Status

accepted

## Considered Options

- **CodeMirror 6 with live-preview decorations** (the Obsidian approach; markdown text as the literal document) — rejected: weeks of decoration-plugin work for a solo developer, and a markdown-native editing surface poorly serves low-tech users who avoid markdown entirely. Rich-text WYSIWYG serves both audiences; markdown fidelity matters only at import/export boundaries, which v1.0 doesn't have.
- **TipTap Platform (paid)** — rejected: $49+/month for features we don't need (collab hosting, vendor AI); conflicts with keeping AI under `laravel/ai` control.
- **Raw markdown with syntax highlighting only** — rejected as the end state (fails the "use it over Obsidian" bar and the low-tech-user goal), though TipTap can expose a raw mode later if wanted.

## Consequences

- The editing document model is ProseMirror's node tree; stored markdown is a serialization maintained at the save/load boundary. Unusual hand-written markdown may not round-trip losslessly — acceptable because content is authored inside Grimoire until Obsidian/Notion import arrives (v3.1), where fidelity is handled at the import boundary.
- Wiki-style links between Files, slash commands, and image handling come from TipTap's free extension ecosystem (e.g. Mention) rather than custom editor engineering.
- There is no plain-text File type. Markdown-literate users type markdown shortcuts; low-tech users click toolbar controls — the same editor, the same stored markdown. File `format` only distinguishes documents from JSON-canvas files once the canvas editor ships.
