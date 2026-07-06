# Plain Postgres via Laravel Cloud at launch; no local-first sync engine

Grimoire launches on Laravel Cloud's managed Serverless Postgres (Neon-backed) as its only database, with no local-first sync engine (Zero, ElectricSQL) in the initial architecture. Research ([docs/research-local-first-database.md](../research-local-first-database.md)) showed that both Zero and Electric require `wal_level=logical`, which Laravel Cloud's managed Postgres does not expose, so adopting either would force provisioning Neon directly plus hosting an always-on sync service outside Laravel Cloud — significant operational cost for a UX benefit we can't yet evaluate because the product's features are still taking shape.

## Status

accepted

## Considered Options

- **Zero (Rocicorp)** — preferred candidate if we ever adopt a sync engine. Rejected for launch: requires direct Neon provisioning, a separately hosted `zero-cache` Node service, and its write path/tooling is TypeScript-first, awkward for a Laravel backend.
- **ElectricSQL** — lighter integration (read-path only; writes stay in Laravel), first-party Neon support. Rejected for launch for the same logical-replication and extra-service reasons.
- **Plain Postgres via Laravel Cloud** — chosen. Zero extra infrastructure, native Laravel Cloud integration, scale-to-zero billing preserved.

## Consequences

- The "local-first UX" door stays open: if the editor later proves to need instant/offline writes, we would re-provision Postgres directly through Neon and revisit Zero vs. Electric. That migration is the accepted cost of deferring.
- "User-owned files" (Obsidian-style vaults on the user's disk) is unrelated to these sync engines and is deferred to a potential future desktop app; it is not part of the web app architecture.
- Pricing tiers meter *cloud-hosted* storage and AI credits; the free tier is a capped amount of hosted storage, not "self-hosted files."
