# Issue Tracker

Issues for this repo live in **Linear**, workspace `grimoire-worldbuilding`, team **Joel Christensen** (key `JBC`). Agents access it through the **Linear MCP server** (`user-Linear`) — use its tools (`list_issues`, `get_issue`, `save_issue`, `save_comment`, `list_projects`, `save_project`, `create_issue_label`, etc.). There is no CLI; do not use `gh`.

## Conventions

- **Projects map to roadmap versions.** New feature work belongs to the project for its version (e.g. "Grimoire v1.0"). The legacy "Initial Design" project is historical — don't add to it.
- **Statuses** are Linear defaults: Backlog, Todo, In Progress, In Review, Done, Canceled, Duplicate.
- **Triage roles** are expressed as Linear labels — see `triage-labels.md`.
- **Categorization labels** `Bug` / `Feature` / `Improvement` also exist; apply one when it's obvious.
- Issue identifiers look like `JBC-42`; reference them by identifier in commits and cross-links.
- External PRs are not a request surface for this repo (solo project).

## Source of truth

The PRD, `CONTEXT.md`, ADRs in `docs/adr/`, and the codebase are the source of truth. Issues created before February 2026's planning reset may be stale; prefer the docs, and cancel superseded issues with a comment saying what superseded them rather than deleting.
