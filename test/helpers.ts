/** Ensure no copypasta error */
export function checkTestAndTagName(testName: string, tagName: string) {
  if (!testName.includes(tagName)) {
    throw new Error(`Test "${testName}" is testing tag "${tagName}". Has there been a mistake?`);
  }
}
