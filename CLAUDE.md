# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js)
npm run build        # Production build
npm run lint         # ESLint (flat config, Next.js core-web-vitals + typescript)
npm run typecheck    # tsc --noEmit
npm run format       # Prettier (all .ts/.tsx files)
```

Add shadcn components: `npx shadcn@latest add <component-name>`

## Architecture

Next.js 16 app using the App Router with React Server Components enabled by default. Uses Tailwind CSS v4 (via `@tailwindcss/postcss` — no `tailwind.config` file; configuration lives in `app/globals.css` using `@theme inline`).

UI components come from shadcn/ui (style: `radix-maia`, base color: `mist`). They use Radix UI primitives, `class-variance-authority` for variants, and `cn()` from `lib/utils.ts` for class merging (`clsx` + `tailwind-merge`).

Dark mode is handled via `next-themes` with class-based toggling. The `ThemeProvider` in `components/theme-provider.tsx` wraps the app and includes a `d` hotkey for toggling.

Path alias: `@/*` maps to the project root.

## Code Style

- No semicolons, double quotes, 2-space indent, trailing commas (`es5`)
- Prettier sorts Tailwind classes (via `prettier-plugin-tailwindcss`, configured to recognize `cn` and `cva` functions)

## Next.js Version Notice

This project runs a recent Next.js version that may differ from training data. Consult `node_modules/next/dist/docs/` before using Next.js APIs to check for breaking changes or deprecations (per AGENTS.md).
