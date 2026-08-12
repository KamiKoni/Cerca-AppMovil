export function mapProblemReasonToI18nKey(
  reason: string | undefined,
  namespace: string,
): string {
  return reason ? `${namespace}.${reason}` : `${namespace}.unknown`;
}
