// Development proxy that re-exports the CDN server-renderer build for in-browser SSR
// The CDN ESM build exports named helpers (e.g. renderToString); it does not provide a default export,
// so re-export named bindings only.
export * from 'https://cdn.jsdelivr.net/npm/@vue/server-renderer@3.5.22/dist/server-renderer.esm-browser.js'
