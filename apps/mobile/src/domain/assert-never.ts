/**
 * Fails to compile when a union grows a member some `switch` forgot.
 *
 * The value is typed `never`, so passing anything else is a type error at the
 * call site rather than a bug found in QA. Adding a sixth booking state without
 * handling it turns every exhaustive switch red immediately, which is the whole
 * point of modelling state as a union instead of a string.
 *
 * It also throws at runtime, for the case the types cannot cover: a payload
 * that arrived with a kind the build never knew about.
 */
export function assertNever(value: never, context: string): never {
  throw new Error(`Unhandled ${context}: ${JSON.stringify(value)}`);
}
