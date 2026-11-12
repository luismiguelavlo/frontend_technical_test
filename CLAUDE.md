# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Minimal React 19 + TypeScript + Vite 8 app (scaffolded from the Vite `react-ts` template). Single component so far: `src/main.tsx` mounts `src/App.tsx` into `#root` of `index.html` inside `StrictMode`.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — `tsc -b` type-check (project references) then `vite build`
- `npm run lint` — Oxlint (config in `.oxlintrc.json`)
- `npm run preview` — serve production build

No test runner is configured.

## Toolchain notes

- **React Compiler enabled** via `@rolldown/plugin-babel` + `reactCompilerPreset()` in `vite.config.ts`. Components are auto-memoized — avoid manual `useMemo`/`useCallback`/`memo` unless needed; code must follow Rules of React. Slows dev/build.
- **Linter is Oxlint, not ESLint.** Rules: `react/rules-of-hooks` (error), `react/only-export-components` (warn — keep component files exporting only components, for Fast Refresh).
- **TypeScript ~7** with project references: `tsconfig.app.json` (covers `src/`) and `tsconfig.node.json` (covers `vite.config.ts`). Strict-ish flags: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` (no enums/namespaces/parameter properties), `verbatimModuleSyntax` (use `import type` for type-only imports). Imports may include `.tsx` extensions.
- Static assets: `public/` served at root (e.g. `/icons.svg` sprite); `src/assets/` imported via modules.
