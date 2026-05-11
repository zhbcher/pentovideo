import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/pentovideo-player.ts"],
  format: ["esm", "cjs", "iife"],
  globalName: "PentovideoPlayer",
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
});
