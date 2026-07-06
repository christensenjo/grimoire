# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

This is a **single-context** repo:

```
/
├── CONTEXT.md          ← domain glossary
├── docs/adr/           ← architectural decision records
└── ...
```

## Before exploring, read these

- **`CONTEXT.md`** at the repo root — the domain glossary (World, File, Folder, Template, Scratchpad, Wiki-link, ...).
- **`docs/adr/`** — read ADRs that touch the area you're about to work in.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids (notably: a user's worldbuilding container is a **World**, never a "Setting").

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0003 (TipTap as editor engine) — but worth reopening because…_
