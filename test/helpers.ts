/** Ensure no copypasta error */
export function checkTestAndTagName(testName: string, tagName: string) {
  if (!testName.includes(tagName)) {
    throw new Error(`Test name "${testName}" is missing tag name "${tagName}". Has there been a mistake?`);
  }
}
