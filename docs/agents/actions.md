# Actions

Application-layer behavior that is not a Model, Form Request, Policy, Rule, Middleware, Job, or Controller belongs in `App\Actions`.

## Conventions

- Prefer **invokable** classes with a verb-led name (`RedirectStaleWorkspaceSlug`, `CreateWorld`, …).
- Expose a single entry point: `public function __invoke(...): ...`.
- Keep HTTP entrypoints thin: Controllers and route closures resolve the Action and call it.
- Prefer Actions over `app/Support`, `app/Services`, or fat Controllers.

## Example

[`app/Actions/RedirectStaleWorkspaceSlug.php`](../../app/Actions/RedirectStaleWorkspaceSlug.php) turns stale workspace slug URLs into 301 redirects. Routes call it from resource `missing()` handlers:

```php
app(RedirectStaleWorkspaceSlug::class)($request) ?? abort(404);
```
