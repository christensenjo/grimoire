# Frontend Skills Roadmap

How global agent skills fit this repo today, and how frontend/design skills may join the workflow later.

**Last reviewed:** 2026-07-24 (after a fresh global reinstall of mattpocock/skills v1.1.0).

## Principles

1. **Matt Pocock skills are the SDLC spine** — planning, building, reviewing, and maintaining Grimoire feature work.
2. **Frontend/design skills are situational specialists** — invoked when the task matches, not a parallel workflow (for now).
3. **Project-scoped skills stay out unless needed** — no repo-local skill copies until a skill is Grimoire-specific or pinned for team use.
4. **Re-evaluate holistically before expanding motion/UI tooling** — especially before adding motion-performance or animation suites.

## Installed globally (current)

Skills live under `~/.agents/skills/` unless noted. List with:

```powershell
pnpm dlx skills ls -g
```

| Source | Skills kept | Role |
| --- | --- | --- |
| [mattpocock/skills](https://github.com/mattpocock/skills) | 22 engineering + productivity skills (incl. `to-spec`, `to-tickets`, `wayfinder`; no legacy `to-prd` / `to-issues`) | Primary SDLC |
| [ibelick/ui-skills](https://github.com/ibelick/ui-skills) | `fixing-accessibility`, `fixing-metadata` | Targeted UI/a11y/SEO fixes |
| [emilkowalski/skill](https://github.com/emilkowalski/skill) | `emil-design-eng` | Design-engineering philosophy (polish, motion *judgment*) |
| [vercel-labs/skills](https://github.com/vercel-labs/skills) | `find-skills` | Discover/install other skills |
| Local (Cursor) | `ui` at `~/.cursor/skills/ui` | Thin wrapper for [ui.sh](https://ui.sh/) via `uidotsh_fetch` MCP |

**Removed intentionally:** grimoire project skills (Vercel react/composition/web-guidelines), `baseline-ui`, `fixing-motion-performance`, `hatch-pet`.

**Repo config unchanged:** Linear issue tracker, triage labels, and domain docs — see `issue-tracker.md`, `triage-labels.md`, `domain.md`. Do **not** re-run `/setup-matt-pocock-skills` unless reconfiguring the tracker.

## Now — where frontend skills plug in

Matt's main flow (see `/ask-matt`):

```
grill-with-docs → (prototype?) → to-spec → to-tickets → implement → code-review
```

Frontend specialists attach at **specific steps**, not as a separate lifecycle:

| Phase | Matt skill | Frontend skill (when) |
| --- | --- | --- |
| Align + domain language | `grill-with-docs`, `domain-modeling` | — |
| Explore UI/state | `prototype` | `emil-design-eng` if polish/motion *feel* is the question |
| Build | `implement`, `tdd` | `fixing-accessibility` / `fixing-metadata` when auditing or shipping pages with SEO/social meta gaps |
| Review | `code-review` | Same ibelick skills if the diff touches a11y or metadata |
| Upkeep | `improve-codebase-architecture` | — |

**Triggers (one-off):**

- **Accessibility pass** → `/fixing-accessibility` (or ask the agent to use that skill).
- **Page titles, OG tags, canonicals** → `/fixing-metadata`.
- **“Does this interaction feel right?”** → `/emil-design-eng` during implement or prototype — not during spec/ticket writing.

## Later — candidates to evaluate

Do a **marketplace review in one sitting** before installing more motion/UI skills (Emil suite, ui.sh, ibelick extras, Vercel agent-skills, etc.). Goal: pick a small set that composes, not a pile of overlapping one-offs.

### Emil motion suite (not installed)

From [emilkowalski/skill](https://github.com/emilkowalski/skill):

| Skill | Purpose |
| --- | --- |
| `find-animation-opportunities` | Read-only audit — what *should* animate |
| `improve-animations` | Prioritized motion improvement plans |
| `review-animations` | Review motion code against a craft bar |
| `animation-vocabulary` | Name an effect you can describe but not label |
| `apple-design` | Gesture/spring/material patterns |

**When to revisit:** Grimoire is actively shipping motion (transitions, sheets, editors) and `emil-design-eng` alone isn’t enough.

### ui.sh (paid; partial setup)

- Product: task skills from Adam Wathan / Steve Schoger (`/design`, `/ideas`, `/make-responsive`, etc.).
- Install: `npx @uidotsh/install --token=…` (invite/token from ui.sh account).
- Cursor bridge: local `ui` skill + `user-uidotsh` MCP (`uidotsh_fetch`).
- **Not** on skills.sh; separate from ibelick and mattpocock.

**When to revisit:** After re-reading ui.sh docs and trying `/design` + `/ideas` on a real Grimoire surface (e.g. world editor, library).

### ibelick extras (declined for now)

| Skill | Why deferred |
| --- | --- |
| `baseline-ui` | Okay in past use; not strong enough to keep by default |
| `fixing-motion-performance` | No dedicated motion push yet; prefer holistic motion review later |
| `improve-ui` | Consider with ui.sh / Emil audit skills in the same evaluation |

### Vercel agent-skills (removed from project)

Were repo-local: `vercel-react-best-practices`, `vercel-composition-patterns`, `web-design-guidelines`. Useful for React/Inertia perf and composition **during implement/code-review**, but removed to reduce noise. Re-add project-local or global only if a concrete Grimoire refactor needs them.

## Open questions (for a future design pass)

1. **Separate “frontend cycle” or extend Matt’s flow?** Default: extend (`implement` + specialists). Revisit if ui.sh + Emil audit skills need a repeated “design sprint” pattern (ideas → prototype → implement → review-animations).
2. **Project vs global for frontend skills?** Global is fine for personal workflow; pin project-local copies only if collaborators must share exact versions.
3. **ui.sh vs ibelick vs Emil overlap?** Map each skill to one slot: *explore*, *build*, *audit*, *fix* — avoid three skills that all “make UI better.”
4. **Grimoire interim design philosophy** (see root `AGENTS.md`): stock shadcn, minimal custom chrome — frontend skills should respect that until a deliberate design phase.

## Maintenance

From any directory (prefer `pnpm dlx` inside this repo — `npx` breaks on pnpm `catalog:` deps):

```powershell
pnpm dlx skills ls -g --json
pnpm dlx skills update -g -y
```

Refresh a single source:

```powershell
pnpm dlx skills add mattpocock/skills -g -y --skill <names...>
pnpm dlx skills add ibelick/ui-skills -g -y --skill fixing-accessibility fixing-metadata
pnpm dlx skills add emilkowalski/skill -g -y --skill emil-design-eng
```

Optional: bump Node to ≥ 22.20 when convenient (skills CLI warns on 22.14).

## Decision log

| Date | Decision |
| --- | --- |
| 2026-07-24 | Fresh global mattpocock v1.1.0; dropped legacy `to-prd` / `to-issues`; removed grimoire project Vercel skills; kept ibelick a11y + metadata only; kept `emil-design-eng`; deferred motion suite and ui.sh workflow integration |
