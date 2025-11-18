// Development proxy that re-exports the CDN runtime build for in-browser REPL
// The CDN ESM runtime build uses named exports (createApp, h, etc.) and does not provide
// a default export, so only re-export named bindings.
export * from 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom@3.5.22/dist/runtime-dom.esm-browser.js'
