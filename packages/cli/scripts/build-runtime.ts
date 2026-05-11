import { copyFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const coreDistDir = resolve(__dirname, "../../core/dist");

// Read the pre-built manifest to find the IIFE artifact name
const manifest = JSON.parse(readFileSync(resolve(coreDistDir, "pentovideo.manifest.json"), "utf8"));
const iifeFileName = manifest.artifacts?.iife ?? "pentovideo.runtime.iife.js";

// Copy the pre-built artifacts from core/dist — these have matching SHA256
// checksums. Do NOT regenerate via loadPentovideoRuntimeSource() as that
// produces output without the trailing newline, causing a checksum mismatch.
copyFileSync(resolve(coreDistDir, "pentovideo.manifest.json"), "dist/pentovideo.manifest.json");
copyFileSync(resolve(coreDistDir, iifeFileName), `dist/${iifeFileName}`);

// Keep legacy name for backward compat (e.g. studio dev server)
copyFileSync(resolve(coreDistDir, iifeFileName), "dist/pentovideo-runtime.js");
