import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

execSync(
  'npx vite build --base=https://dtgreene.github.io/yan-calculator/dist/',
  { stdio: 'inherit' }
);

// Adds a redirect due to the build being within the /dist/ directory. This just
// prevents the user staring at a blank page if the URL is wrong.
const script = [
  '    <script>',
  '      if(!window.location.pathname.includes("/dist")) {',
  '        window.location.pathname = "/yan-calculator/dist/";',
  '      }',
  '    </script>',
];
const distHTML = readFileSync('dist/index.html', 'utf-8');
const output = distHTML
  .split('\n')
  .map((line) => {
    if (line.includes('<div id="root"></div>')) {
      return [].concat(line, script);
    } else {
      return line;
    }
  })
  .flat(2)
  .join('\n');
writeFileSync('dist/index.html', output, 'utf-8');
