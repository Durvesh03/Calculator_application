---
applyTo: "src/**/*.jsx"
---

# React component conventions

1. Function components with hooks only; no class components.
2. Keep components small and colocated with their styles (`Component.jsx` + shared `App.css`/`index.css`).
3. Prefer CSS variables/tokens already defined in `src/index.css`/`src/App.css` over inline styles.
4. Every interactive element must have a visible keyboard focus state and be reachable via Tab.
5. Avoid introducing new dependencies (e.g. state/UI libraries) unless the architecture stage explicitly calls for it.
