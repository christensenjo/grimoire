[Project Technical Discussion Thread](https://chatgpt.com/g/g-p-689c5e0138b08191b6a5f90afa06ef38-grimiore-io/c/69c4b05d-f0f0-832e-a214-6958d6dddfdb)

## Tech Stack

### I. Web Backend
- **Laravel + Inertia.js**

### II. Frontend
- **React + Inertia.js**

### III. Deployment
- **Laravel Cloud**

### IV. Primary Database
- **Postgres** for user management and hosted/synced assets  
- Managed via Laravel Cloud

### V. Storage
- **S3 buckets** or **R2 buckets(?)** through Laravel Cloud  
- Considering more robust storage options

### VI. Local-First Database Features
- Exploring: [ElectricSQL](https://electric-sql.com/), [Zero](https://zerodb.io/)
- Goal: Instant database operations on local worldbuilding assets and user-owned Free tier usage
- Motivation: Experience with local-first databases and improved UX
- Note: Requires further research and planning

### VII. Sandbox Browser Runtime
- **Phaser** or **Godot**
    - [Phaser React Template](https://github.com/phaserjs/template-react)
    - [Godot Web Export Documentation](https://docs.godotengine.org/en/latest/tutorials/export/exporting_for_web.html)
    - [Project ChatGPT Thread](https://chatgpt.com/g/g-p-689c5e0138b08191b6a5f90afa06ef38-grimiore-io/c/69c4b05d-f0f0-832e-a214-6958d6dddfdb)

### VIII. AI Features
- **Laravel AI SDK**
- Integrations:
    - Streaming & queues using Laravel's packages (Reverb, Echo, etc.)
    - **Reverb WebSocket server** (via Laravel Cloud, as needed)
    - **fal.ai**: Direct HTTP API or via [cjmellor/fal-ai-laravel](https://packagist.org/packages/cjmellor/fal-ai-laravel)
        - [fal.ai](https://fal.ai/)

### IX. Canvas Editor
- Implementation in **React** using **HTML canvas**
- Follow [Obsidian's JSON canvas spec](https://github.com/obsidianmd/jsoncanvas)