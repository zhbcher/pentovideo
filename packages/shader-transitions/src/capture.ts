import html2canvas from "html2canvas";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "./webgl.js";

type CanvasWithLayoutSubtree = HTMLCanvasElement & {
  layoutSubtree: boolean;
  requestPaint: () => void;
};

type DrawElementImageContext = CanvasRenderingContext2D & {
  drawElementImage: (
    element: Element,
    dx: number,
    dy: number,
    dwidth: number,
    dheight: number,
  ) => DOMMatrix;
};

let patched = false;

function patchCreatePattern(): void {
  if (patched) return;
  patched = true;
  const orig = CanvasRenderingContext2D.prototype.createPattern;
  CanvasRenderingContext2D.prototype.createPattern = function (
    image: CanvasImageSource,
    repetition: string | null,
  ): CanvasPattern | null {
    if (
      image &&
      "width" in image &&
      "height" in image &&
      ((image as HTMLCanvasElement).width === 0 || (image as HTMLCanvasElement).height === 0)
    ) {
      return null;
    }
    return orig.call(this, image, repetition);
  };
}

export function initCapture(): void {
  patchCreatePattern();
}

function hasLayoutSubtreeCanvas(canvas: HTMLCanvasElement): canvas is CanvasWithLayoutSubtree {
  const candidate = canvas as HTMLCanvasElement & {
    layoutSubtree?: unknown;
    requestPaint?: unknown;
  };
  return "layoutSubtree" in candidate && typeof candidate.requestPaint === "function";
}

function getDrawElementImageContext(canvas: HTMLCanvasElement): DrawElementImageContext | null {
  const ctx = canvas.getContext("2d");
  const candidate = ctx as (CanvasRenderingContext2D & { drawElementImage?: unknown }) | null;
  if (!candidate || typeof candidate.drawElementImage !== "function") {
    return null;
  }
  return candidate as DrawElementImageContext;
}

export function isHtmlInCanvasCaptureSupported(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const canvas = document.createElement("canvas");
  return hasLayoutSubtreeCanvas(canvas) && getDrawElementImageContext(canvas) !== null;
}

function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function waitForPaint(canvas: CanvasWithLayoutSubtree): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      canvas.removeEventListener("paint", onPaint);
      reject(new Error("Timed out waiting for canvas paint event"));
    }, 1000);

    const onPaint = () => {
      clearTimeout(timeout);
      resolve();
    };

    canvas.addEventListener("paint", onPaint, { once: true });
    canvas.requestPaint();
  });
}

async function captureSceneWithHtmlInCanvas(
  sceneEl: HTMLElement,
  bgColor: string,
  width: number,
  height: number,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  if (!hasLayoutSubtreeCanvas(canvas)) {
    throw new Error("HTML-in-canvas layoutsubtree support is unavailable");
  }

  const ctx = getDrawElementImageContext(canvas);
  if (!ctx) {
    throw new Error("HTML-in-canvas drawElementImage support is unavailable");
  }

  const clone = sceneEl.cloneNode(true);
  if (!(clone instanceof HTMLElement)) {
    throw new Error("Scene clone is not an HTMLElement");
  }

  canvas.width = width;
  canvas.height = height;
  canvas.layoutSubtree = true;
  canvas.setAttribute("layoutsubtree", "");
  canvas.style.cssText = [
    "position:fixed",
    "left:0",
    "top:0",
    `width:${width}px`,
    `height:${height}px`,
    "pointer-events:none",
    "opacity:0.001",
    "z-index:-2147483648",
  ].join(";");

  clone.style.position = "absolute";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;

  canvas.appendChild(clone);
  document.body.appendChild(canvas);

  try {
    await waitForNextFrame();
    await waitForPaint(canvas);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    ctx.drawElementImage(clone, 0, 0, width, height);
    canvas.remove();
    return canvas;
  } catch (err) {
    canvas.remove();
    throw err;
  }
}

function captureSceneWithHtml2Canvas(
  sceneEl: HTMLElement,
  bgColor: string,
  width: number = DEFAULT_WIDTH,
  height: number = DEFAULT_HEIGHT,
): Promise<HTMLCanvasElement> {
  return html2canvas(sceneEl, {
    width,
    height,
    scale: 1,
    backgroundColor: bgColor,
    logging: false,
    // Safari applies stricter canvas-taint rules than Chrome. SVG data URLs
    // with <filter> elements (e.g. feTurbulence grain backgrounds), certain
    // cross-origin images, and mask/clip-path url() refs can taint the
    // output canvas on WebKit. Without these flags, html2canvas throws
    // `SecurityError: The operation is insecure` during its own read-back
    // path and every shader transition falls through to the catch handler
    // — observed in Safari + Claude Design's cross-origin iframe sandbox.
    //
    // useCORS:    send CORS headers on image fetches so cross-origin images
    //             with proper `Access-Control-Allow-Origin` don't taint the
    //             canvas in the first place. Strict improvement.
    // allowTaint: let html2canvas complete and return a canvas even when it
    //             becomes tainted (instead of throwing). Important caveat:
    //             a tainted canvas CANNOT be uploaded to WebGL via
    //             `gl.texImage2D` — WebGL spec requires SecurityError on
    //             non-origin-clean sources, with no opt-out. So this flag
    //             only moves the failure point from html2canvas to the
    //             texImage2D call in webgl.ts. In both cases `hyper-shader.ts`
    //             catches the rejected promise and runs the CSS crossfade
    //             fallback. Net effect: the end-user UX is the same (smooth
    //             CSS fade in either case), but we get a cleaner, more
    //             predictable error site and the flag is defensively
    //             correct for the non-taint branches where it genuinely
    //             helps (e.g., `crossOrigin="anonymous"` image fetches
    //             that already had CORS headers).
    useCORS: true,
    allowTaint: true,
    ignoreElements: (el: Element) => el.tagName === "CANVAS" || el.hasAttribute("data-no-capture"),
  });
}

export function captureScene(
  sceneEl: HTMLElement,
  bgColor: string,
  width: number = DEFAULT_WIDTH,
  height: number = DEFAULT_HEIGHT,
): Promise<HTMLCanvasElement> {
  if (!isHtmlInCanvasCaptureSupported()) {
    return captureSceneWithHtml2Canvas(sceneEl, bgColor, width, height);
  }

  return captureSceneWithHtmlInCanvas(sceneEl, bgColor, width, height).catch(() =>
    captureSceneWithHtml2Canvas(sceneEl, bgColor, width, height),
  );
}

/**
 * Capture the incoming scene with .scene-content hidden (background + decoratives only).
 * Shows the scene behind the outgoing scene via z-index, waits 2 rAFs for font rendering,
 * captures, then restores.
 *
 * IMPORTANT: We force `visibility: visible` during capture because the HyperFrames runtime's
 * time-based visibility gate (in `packages/core/src/runtime/init.ts`) sets `style.visibility
 * = "hidden"` on every `[data-start]` element that's outside its current playback window —
 * every frame. When a shader transition fires *before* the incoming scene's `data-start`
 * boundary (the recommended "transition.time = boundary - duration/2" centered placement),
 * the runtime has `visibility: hidden` on the incoming scene. Without the visibility override
 * here, `html2canvas` captures the element as blank → shader transitions from the real
 * outgoing scene to a blank incoming texture → users see content fade/morph into the
 * background color mid-transition (a visible "blink"). Forcing `visibility: visible` only
 * for the duration of the capture fixes this without affecting what the user sees during
 * normal playback.
 */
export function captureIncomingScene(
  toScene: HTMLElement,
  bgColor: string,
  width: number = DEFAULT_WIDTH,
  height: number = DEFAULT_HEIGHT,
): Promise<HTMLCanvasElement> {
  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    const origZ = toScene.style.zIndex;
    const origOpacity = toScene.style.opacity;
    const origVisibility = toScene.style.visibility;
    toScene.style.zIndex = "-1";
    toScene.style.opacity = "1";
    toScene.style.visibility = "visible";

    const contentEl = toScene.querySelector<HTMLElement>(".scene-content");
    if (contentEl) contentEl.style.visibility = "hidden";

    const restore = () => {
      if (contentEl) contentEl.style.visibility = "";
      toScene.style.visibility = origVisibility;
      toScene.style.opacity = origOpacity;
      toScene.style.zIndex = origZ;
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        captureScene(toScene, bgColor, width, height).then(resolve, reject).finally(restore);
      });
    });
  });
}
