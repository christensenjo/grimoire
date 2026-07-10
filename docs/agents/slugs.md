# Slug Conventions

User-facing models exposed through Inertia or resource routes should use readable slugs instead of raw ids in URLs.

## Current Workspace Rules

- Worlds, Folders, and Files use `slug` as their route key.
- Generate slugs from `name`.
- Scope uniqueness to the owner for Worlds and to the World for Folders and Files.
- Reject names that cannot produce a non-empty slug.
- Regenerate slugs on rename and keep a 301 redirect from the old slug.
- Delete redirect history when the model is deleted.
- Keep numeric ids in payloads when the UI needs stable keys or relationships; use slugs only for URLs.

See `docs/adr/0004-workspace-slugs-and-redirects.md` for the decision record and the public sharing boundary.
