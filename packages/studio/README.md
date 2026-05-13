# @pentovideo/studio

Browser-based composition editor UI for Pentovideo. Provides a visual timeline, code editor, and live preview for building video compositions.

## Install

```bash
npm install @pentovideo/studio
```

## What it does

The studio is a React application with:

- **Visual timeline** — drag, resize, and arrange elements on tracks
- **Code editor** — edit HTML and GSAP scripts with CodeMirror (syntax highlighting, autocomplete)
- **Live preview** — see changes in real time as you edit
- **Composition inspector** — view and modify element properties

## Development

The studio is embedded in the `pentovideo preview` command. To develop the studio UI itself:

```bash
cd packages/studio
bun run dev        # Start Vite dev server
bun run build      # Build for production
bun run typecheck  # Type-check
```

## Tech stack

- React 18/19, Zustand (state management)
- CodeMirror 6 (editor)
- Tailwind CSS (styling)
- Vite (bundler)
- Phosphor Icons

## Documentation

Full documentation: [github.com/zhbcher/pentovideo/packages/studio](https://github.com/zhbcher/pentovideo/packages/studio)

## Related packages

- [`@pentovideo/core`](../core) — types and parsers used by the editor
- [`pentovideo`](../cli) — CLI that serves the studio via `pentovideo preview`
