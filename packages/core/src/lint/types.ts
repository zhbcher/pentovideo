export type PentovideoLintSeverity = "error" | "warning" | "info";

export type PentovideoLintFinding = {
  code: string;
  severity: PentovideoLintSeverity;
  message: string;
  file?: string;
  selector?: string;
  elementId?: string;
  fixHint?: string;
  snippet?: string;
};

export type PentovideoLintResult = {
  ok: boolean;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  findings: PentovideoLintFinding[];
};

export type PentovideoLinterOptions = {
  filePath?: string;
  isSubComposition?: boolean;
  externalStyles?: Array<{ href: string; content: string }>;
};

// A rule is a pure function: receives parsed context, returns zero or more findings.
// Rule modules should receive a LintContext (defined in ./context) as the type parameter.
export type LintRule<TContext> = (ctx: TContext) => PentovideoLintFinding[];
