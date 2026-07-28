/** Best-effort human-readable detail from a caught value, for internal (auth-gated) admin surfaces. */
export function errorDetail(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
