# File content lives in Postgres; only binaries go to object storage

A Grimoire File (markdown, plain text, or JSON-canvas) is a database row with its content in a text/jsonb column — not an object in S3/R2. Worldbuilding files are small text documents, and keeping them in Postgres gives us transactions (atomic folder moves/renames/deletes), full-text search, cheap quota counting for pricing tiers, and low-latency editor reads/writes. Binary assets (images, audio) are stored in object storage via Laravel's filesystem conventions, with a metadata row in Postgres.

## Status

accepted

## Consequences

- "File" is a domain term (see CONTEXT.md), not a filesystem artifact. The folder tree is modeled relationally.
- If a future desktop app introduces user-owned files on disk, that is an export/sync target, not a change to where the web app's source of truth lives.
