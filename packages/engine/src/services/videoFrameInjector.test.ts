// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { __testing } from "./videoFrameInjector.js";

const { createFrameSourceCache } = __testing;

describe("frame source cache eviction", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "hf-frame-cache-test-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  // Each PNG is base64-encoded into the data URI, so the cached string is
  // ~4/3 the file size plus a small `data:image/png;base64,` prefix. Build
  // distinct files so eviction has predictable victims.
  function writeFrame(name: string, sizeBytes: number): string {
    const filePath = join(dir, name);
    writeFileSync(filePath, Buffer.alloc(sizeBytes, 0));
    return filePath;
  }

  it("evicts oldest entry when entry count exceeds limit", async () => {
    const cache = createFrameSourceCache(2, Number.MAX_SAFE_INTEGER);
    const a = writeFrame("a.png", 16);
    const b = writeFrame("b.png", 16);
    const c = writeFrame("c.png", 16);

    await cache.get(a);
    await cache.get(b);
    expect(cache.stats().entries).toBe(2);

    await cache.get(c);
    expect(cache.stats().entries).toBe(2);
  });

  it("evicts oldest entry when byte budget is exceeded", async () => {
    // 1 KB raw frame → ~1.4 KB base64 + ~22-byte data URI prefix. Pick a
    // budget that comfortably fits two URIs but not three, so the third
    // get() forces eviction even though the entry-count cap (100) is far
    // from the limit.
    const cache = createFrameSourceCache(100, 4 * 1024);
    const a = writeFrame("a.png", 1024);
    const b = writeFrame("b.png", 1024);
    const c = writeFrame("c.png", 1024);

    await cache.get(a);
    await cache.get(b);
    expect(cache.stats().entries).toBe(2);

    await cache.get(c);
    const afterC = cache.stats();
    // The byte budget is the contract — the cache MUST stay under it after
    // an insert that would otherwise overflow. Entry count is incidental.
    expect(afterC.bytes).toBeLessThanOrEqual(4 * 1024);
    expect(afterC.entries).toBeLessThan(3);
  });

  it("returns the served URL untouched when frameSrcResolver yields one", async () => {
    let served: string | null = "/served/frame.png";
    const cache = createFrameSourceCache(4, 64 * 1024, () => served);
    const file = writeFrame("a.png", 256);

    expect(await cache.get(file)).toBe("/served/frame.png");
    // Cache stays empty because the resolver short-circuits the read.
    expect(cache.stats()).toEqual({ entries: 0, bytes: 0 });

    served = null;
    const dataUri = await cache.get(file);
    expect(dataUri.startsWith("data:image/png;base64,")).toBe(true);
    expect(cache.stats().entries).toBe(1);
  });

  it("treats a re-read as a cache hit (no second file read)", async () => {
    const cache = createFrameSourceCache(2, Number.MAX_SAFE_INTEGER);
    const a = writeFrame("a.png", 64);

    const first = await cache.get(a);
    const second = await cache.get(a);
    expect(second).toBe(first);
    expect(cache.stats().entries).toBe(1);
  });
});
