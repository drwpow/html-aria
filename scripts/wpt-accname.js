import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'tinyglobby';

const TEST_FILE = new URL('../test/dom/get-accdescription.test.ts', import.meta.url);
const WANT_MATCH = /"property",\n\s+"accDescription",\n\s+"is",\n\s+"([^"]+)"/;
const WPT_DIR = new URL('./wpt/', import.meta.url);

async function main() {
  const tests = await glob('accname/**/*.html', { cwd: fileURLToPath(WPT_DIR), absolute: true });

  const testcases = [];

  for (const testfile of tests) {
    const contents = fs.readFileSync(testfile, 'utf8');
    const want = contents.match(WANT_MATCH)?.[1];
    let html = contents.substring(contents.indexOf('</p>') + '</p>'.length).trim();
    html = html.substring(0, html.indexOf('<div id="manualMode">')).trim();

    testcases.push([
      path.basename(testfile).replace(/\.html$/, ''),
      {
        given: [html, '#test'],
        want,
      },
    ]);
  }

  // this just shoves them at the end. cuz I need to format anyway
  const old = fs.readFileSync(TEST_FILE, 'utf8');
  fs.writeFileSync(TEST_FILE, `${old}${JSON.stringify(testcases)}`);
}

main();
