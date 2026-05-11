# pentovideo

CLI for creating, previewing, and rendering HTML video compositions.

## Install

```bash
npm install -g pentovideo
```

Or use directly with npx:

```bash
npx pentovideo <command>
```

**Requirements:** Node.js >= 22, FFmpeg

## Commands

### `init`

Scaffold a new Pentovideo project from a template:

```bash
npx pentovideo init my-video
cd my-video
```

### `preview`

Start the live preview studio in your browser:

```bash
npx pentovideo preview
# Studio running at http://localhost:3002

npx pentovideo preview --port 4567
```

### `render`

Render a composition to MP4:

```bash
npx pentovideo render ./my-composition.html -o output.mp4
```

### `lint`

Validate your Pentovideo HTML:

```bash
npx pentovideo lint ./my-composition
npx pentovideo lint ./my-composition --json      # JSON output for CI/tooling
npx pentovideo lint ./my-composition --verbose   # Include info-level findings
```

By default only errors and warnings are shown. Use `--verbose` to also display informational findings (e.g., external script dependency notices). Use `--json` for machine-readable output with `errorCount`, `warningCount`, `infoCount`, and a `findings` array.

### `compositions`

List compositions found in the current project:

```bash
npx pentovideo compositions
```

### `benchmark`

Run rendering benchmarks:

```bash
npx pentovideo benchmark ./my-composition.html
```

### `doctor`

Check your environment for required dependencies (Chrome, FFmpeg, Node.js):

```bash
npx pentovideo doctor
```

### `browser`

Manage the bundled Chrome/Chromium installation:

```bash
npx pentovideo browser
```

### `info`

Print version and environment info:

```bash
npx pentovideo info
```

### `docs`

Open the documentation in your browser:

```bash
npx pentovideo docs
```

### `upgrade`

Check for updates and show upgrade instructions:

```bash
npx pentovideo upgrade
npx pentovideo upgrade --check --json  # machine-readable for agents
```

## Documentation

Full documentation: [pentovideo.heygen.com/packages/cli](https://pentovideo.heygen.com/packages/cli)

## Related packages

- [`@pentovideo/core`](../core) — types, parsers, frame adapters
- [`@pentovideo/engine`](../engine) — rendering engine
- [`@pentovideo/producer`](../producer) — render pipeline
- [`@pentovideo/studio`](../studio) — composition editor UI
