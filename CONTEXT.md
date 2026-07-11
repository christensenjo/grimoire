# Grimoire

A worldbuilding web app for writers and tabletop gamers: create, organize, and explore worldbuilding assets (settings, characters, locations, and more), with AI-assisted features and a community library.

## Language

**World**:
The top-level container for a user's worldbuilding work — one fictional universe holding folders, files, and images. A user can have many Worlds.
_Avoid_: Setting (collides with account settings), Vault, Realm, Project

**File**:
A free-form document inside a World, stored as markdown (JSON-canvas variant arrives with the canvas editor). Its content lives in the database; it is not an object-storage artifact. May carry an optional type inherited from a Template. Whether a user authors via markdown syntax or rich-text controls is an input preference, not a property of the File.
_Avoid_: Document, Note, Page

**Folder**:
A user-named grouping of Files within a World's tree. Every World has a default images folder.
_Avoid_: Directory

**Scratchpad**:
A designated File in each World for unorganized, spur-of-the-moment notes, quick-accessible from the Dashboard. Exactly one per World.
_Avoid_: Inbox, Quick notes, Daily note

**Template**:
A preset that creates (or is later applied to) a File, pre-filling its body and stamping it with a type such as Character or Location. Typing is optional and additive — Files never require a Template.
_Avoid_: Asset type, Schema

**Wiki-link**:
A reference from one File to another File in the same World, authored as `[[...]]` and stored by target File id so renames don't break it.
_Avoid_: Backlink (that's the reverse view, a later feature), Mention

**Worldbuilding Asset**:
Umbrella term for anything a user creates in a World — Files, images, and later soundscapes or canvases. Use only when speaking generically; prefer the specific term.
_Avoid_: Content item

**Local-First UX**:
An editor experience where reads and writes hit a local replica instantly and sync to the server in the background (the promise of engines like Zero or ElectricSQL). A deferred possibility, not a launch feature.
_Avoid_: local-first (unqualified), offline mode

**User-Owned Files**:
Worldbuilding assets stored as real files on the user's own disk, editable outside Grimoire (the Obsidian model). A potential future desktop-app feature; not applicable to the web app.
_Avoid_: self-hosted files, local files
