# Agent Guidelines for Grimoire

> Laravel 12 + React 19 + Inertia v2 + Tailwind v4 + Pest v3

## Build/Development Commands

```bash
### In most cases, the developer will already have the environment running locally as they work via Laravel Herd and `npm run dev`. Feel free to build in order to catch build errors, or to start your own dev environment if you specifically need to, but in many cases you can simply ask the developer to check the app for your changes.

# Start full dev environment (runs concurrently)
composer run dev              # Starts: artisan serve, queue, vite

# Individual frontend commands
npm run dev                   # Start Vite dev server
npm run build                 # Production build
npm run build:ssr             # Build with SSR support

# PHP commands
php artisan serve             # Start Laravel server
php artisan queue:listen      # Start queue worker
```

## Testing Commands

```bash
# Run all tests
php artisan test              # Run complete test suite
./vendor/bin/pest             # Direct Pest execution

# Run specific tests
php artisan test tests/Feature/Auth/AuthenticationTest.php
php artisan test --filter=testName

# Run tests by suite
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature
```

## Lint/Format Commands

```bash
# PHP formatting (MUST run before finalizing changes)
vendor/bin/pint               # Auto-fix all PHP files
vendor/bin/pint --dirty       # Fix only changed files

# Frontend formatting
npm run format                # Auto-fix with Prettier
npm run format:check          # Check without fixing
npm run lint                  # ESLint with auto-fix
npm run types                 # TypeScript type check (tsc --noEmit)
```

## Code Style Guidelines

### PHP

- **PHP 8.2+ features**: Use constructor property promotion
- **Types**: Always declare explicit return types and parameter types
- **Braces**: Always use curly braces for control structures
- **PHPDoc**: Prefer PHPDoc blocks over inline comments
- **Models**: Use `casts()` method instead of `$casts` property
- **Naming**: Descriptive variable/method names (`isRegisteredForDiscounts`, not `discount()`)
- **Factories**: Always create factories when creating new models
- **Validation**: Use Form Request classes, not inline validation

### TypeScript/React

- **Types**: Use explicit types, avoid implicit `any`
- **Imports**: Group: React → External libs → Internal (@/components)
- **Components**: Export default for pages, named exports for UI components
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Props**: Destructure in function parameters
- **Hooks**: Follow rules of hooks, include exhaustive deps

### Inertia.js

- Use `Inertia::render()` instead of Blade views
- Place page components in `resources/js/pages`
- Use `<Link>` or `router.visit()` for navigation (not `<a>` tags)
- Use `<Form>` component for forms or `useForm` hook

### Tailwind CSS v4

- Use `@import "tailwindcss"` (not deprecated `@tailwind` directives)
- Use `/` for opacity: `bg-black/50` (not `bg-opacity-50`)
- Use `shrink-*` and `grow-*` (not `flex-shrink-*` / `flex-grow-*`)
- Prefer gap utilities over margins for spacing in lists
- Support dark mode with `dark:` prefixes where existing

### Testing (Pest v3)

- All tests use Pest syntax (not PHPUnit)
- Use specific assertion methods: `assertForbidden()`, `assertNotFound()`
- Create tests with: `php artisan make:test --pest <name>`
- Use datasets for repetitive validation tests
- Test happy paths, failure paths, and edge cases

## Project Structure

```
app/
  Console/Commands/         # Auto-registered commands
  Http/
    Controllers/            # Follow existing patterns
    Requests/               # Form Request validation classes
    Middleware/             # Middleware classes
  Models/                   # Eloquent models with casts() method
  Providers/
bootstrap/
  app.php                   # Register middleware, routes, exceptions
  providers.php             # Service providers
config/
database/
  factories/                # Model factories
  seeders/                  # Database seeders
resources/
  js/
    components/             # React components
      ui/                   # shadcn/ui components
    hooks/                  # Custom React hooks
    layouts/                # Layout components
    lib/                    # Utilities (cn function)
    pages/                  # Inertia page components
    types/                  # TypeScript definitions
  css/
tests/
  Feature/                  # Feature tests
  Unit/                     # Unit tests
```

## Key Conventions

1. **Laravel 12 Structure**: No `app/Console/Kernel.php`, no middleware directory by default
2. **Routes**: Use named routes with `route()` helper
3. **Config**: Use `config()` helper, never `env()` outside config files
4. **Database**: Prefer Eloquent over `DB::` facade, eager load to avoid N+1
5. **Queues**: Implement `ShouldQueue` for time-consuming operations
6. **Imports**: Check sibling files for existing conventions before writing new code

## Pre-commit Checklist

- [ ] Run `vendor/bin/pint --dirty` for PHP formatting
- [ ] Run `npm run format` for frontend formatting
- [ ] Run `npm run lint` for ESLint checks
- [ ] Run `npm run types` for TypeScript validation
- [ ] Run affected tests: `php artisan test --filter=YourFeature`
- [ ] Ensure dark mode support if applicable

## React Performance Guidelines (Vercel Best Practices)

Reference these guidelines when writing React components, implementing data fetching, or optimizing performance:

### 1. Eliminating Waterfalls (CRITICAL)

- `async-parallel` - Use `Promise.all()` for independent operations
- `async-defer-await` - Move await into branches where actually used
- `async-dependencies` - Use better-all for partial dependencies
- `async-suspense-boundaries` - Use Suspense to stream content

### 2. Bundle Size Optimization (CRITICAL)

- `bundle-barrel-imports` - Import directly, avoid barrel files
- `bundle-dynamic-imports` - Use `React.lazy()` for heavy components
- `bundle-defer-third-party` - Load analytics after hydration
- `bundle-conditional` - Load modules only when feature is activated

### 3. Re-render Optimization (MEDIUM)

- `rerender-memo` - Extract expensive work into memoized components
- `rerender-memo-with-default-value` - Hoist default non-primitive props
- `rerender-dependencies` - Use primitive dependencies in effects
- `rerender-derived-state` - Subscribe to derived booleans, not raw values
- `rerender-lazy-state-init` - Pass function to useState for expensive values
- `rerender-transitions` - Use startTransition for non-urgent updates
- `rerender-use-ref-transient-values` - Use refs for transient frequent values

### 4. Rendering Performance (MEDIUM)

- `rendering-animate-svg-wrapper` - Animate div wrapper, not SVG element
- `rendering-hoist-jsx` - Extract static JSX outside components
- `rendering-conditional-render` - Use ternary, not && for conditionals

### 5. JavaScript Performance (LOW-MEDIUM)

- `js-batch-dom-css` - Group CSS changes via classes or cssText
- `js-cache-property-access` - Cache object properties in loops
- `js-combine-iterations` - Combine multiple filter/map into one loop
- `js-early-exit` - Return early from functions
- `js-set-map-lookups` - Use Set/Map for O(1) lookups

## React Composition Patterns

Reference these guidelines when building flexible, maintainable React components:

### 1. Component Architecture (HIGH)

- `architecture-avoid-boolean-props` - Use composition instead of boolean props to customize behavior
- `architecture-compound-components` - Structure complex components with shared context

### 2. State Management (MEDIUM)

- `state-lift-state` - Move state into provider components for sibling access
- `state-context-interface` - Define generic interface (state, actions, meta) for dependency injection

### 3. Implementation Patterns (MEDIUM)

- `patterns-explicit-variants` - Create explicit variant components instead of boolean modes
- `patterns-children-over-render-props` - Use children for composition instead of renderX props

### 4. React 19 APIs (MEDIUM)

- `react19-no-forwardref` - Don't use `forwardRef`; use `use()` instead of `useContext()`

## Web Interface Guidelines

When asked to "review my UI", "check accessibility", "audit design", or "review UX":

- Follow Web Interface Guidelines for UI best practices
- Check accessibility compliance (keyboard navigation, ARIA labels, color contrast)
- Ensure responsive design patterns are properly implemented
- Validate semantic HTML structure

## Animation Performance Guidelines

Reference these guidelines when adding or changing UI animations:

### 1. Never Patterns (CRITICAL)

- Do not interleave layout reads and writes in the same frame
- Do not animate layout continuously on large surfaces
- Do not drive animation from scroll events
- No requestAnimationFrame loops without a stop condition
- Do not mix multiple animation systems

### 2. Choose the Mechanism (CRITICAL)

- Default to `transform` and `opacity` for motion
- Use JS-driven animation only when interaction requires it
- Paint or layout animation only on small, isolated surfaces
- Prefer downgrading technique over removing motion entirely

### 3. Measurement (HIGH)

- Measure once, then animate via transform or opacity
- Batch all DOM reads before writes
- Prefer FLIP-style transitions for layout-like effects

### 4. Scroll (HIGH)

- Prefer Scroll or View Timelines for scroll-linked motion
- Use IntersectionObserver for visibility and pausing
- Do not poll scroll position for animation
- Pause animations when off-screen

### 5. Paint & Layers (MEDIUM)

- Paint-triggering animation only on small, isolated elements
- Do not animate CSS variables for transform/opacity
- Use `will-change` temporarily and surgically
- Avoid many or large promoted layers

### 6. Blur and Filters (MEDIUM)

- Keep blur animation small (<=8px)
- Use blur only for short, one-time effects
- Never animate blur continuously on large surfaces
- Prefer opacity and translate before blur

## Design System & Components

We use **shadcn/ui** as our component library. When creating components or building features:

- **Check shadcn first** - Look for existing components at https://ui.shadcn.com/docs/components before building custom ones
- **shadcn MCP available** - Use the shadcn MCP server (configured in `opencode.json`) for component discovery and documentation
- **Brand colors configured** - Our `resources/css/app.css` is set up with brand colors mapped to shadcn CSS variables
- **Prefer Base UI** - When using shadcn components, prefer the Base UI version over Radix primitives
- **Extend, don't replace** - Build on top of existing shadcn components rather than creating parallel implementations

## External Rules

See `.cursor/rules/laravel-boost.mdc` for comprehensive Laravel Boost guidelines including:

- Version-specific documentation search with `search-docs` tool
- Laravel Boost MCP server usage
- Inertia v2 features (polling, prefetching, deferred props)
- React + Inertia form patterns
- Tailwind v4 migration notes
