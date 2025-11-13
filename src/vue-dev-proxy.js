// Development proxy that re-exports the CDN runtime build for in-browser REPL
// This file is intentionally simple so Vite serves a local module path
export * from 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom@3.5.22/dist/runtime-dom.esm-browser.js'
export { default } from 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom@3.5.22/dist/runtime-dom.esm-browser.js'
