# ADR-0004: Workspace Slugs and Redirects

## Status

Accepted

## Context

Private workspace routes for user-facing models should not expose raw database ids such as `/worlds/3`. Worlds, Folders, and Files are named concepts in the user interface, and their URLs should be readable while preserving owner isolation.

Future community sharing will use a separate public URL surface, such as `/w/{publicId}/...`, so private workspace slugs do not need to be globally unique.

## Decision

World, Folder, and File use `slug` as their route key.

- World slugs are generated from `name` and unique per `user_id`.
- Folder and File slugs are generated from `name` and unique per `world_id`.
- Slug collisions silently suffix the slug with `-2`, `-3`, and so on. The display name remains unchanged.
- Names that cannot produce a non-empty slug are rejected during validation.
- Renames regenerate the slug and create an id-targeted redirect from the previous slug.
- World rename redirects are path-preserving: `/worlds/{old-slug}/...` redirects permanently to `/worlds/{new-slug}/...`.
- Deleted models remove their slug redirect history. Deleted resources do not keep tombstone redirects.

## Consequences

Private workspace URLs are readable and owner scoped without constraining later public sharing routes. Redirects keep renamed resources reachable without building a public sharing system now.

Public/community URLs must not assume World slugs are globally unique. They should use a separate route namespace and stable public identifier when sharing ships.
