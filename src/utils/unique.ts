/**
 * Generates something fairly unique
 *
 * @returns A fairly unique string
 */
export function uniqueFileName() {
  const timestamp = Date.now().toString(36);
  const randomPart1 = Math.random().toString(36).replace("0.", ""); // Remove '0.'
  const randomPart2 = Math.random().toString(36).replace("0.", ""); // Remove '0.'
  return `${timestamp}-${randomPart1}-${randomPart2}`;
}
