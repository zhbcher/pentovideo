import type { Example } from "./_examples.js";
import { createInspectCommand } from "./layout.js";

export const examples: Example[] = [
  ["Inspect visual layout across the current composition", "pentovideo inspect"],
  ["Inspect a specific project", "pentovideo inspect ./my-video"],
  ["Output agent-readable JSON", "pentovideo inspect --json"],
  ["Use explicit hero-frame timestamps", "pentovideo inspect --at 1.5,4.0,7.25"],
  ["Run the compatibility alias", "pentovideo layout --json"],
];

export default createInspectCommand("inspect");
