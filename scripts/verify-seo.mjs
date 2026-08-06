import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve('dist');

for (const path of ['robots.txt', 'site.webmanifest', 'favicon.svg', 'og-default.svg']) {
  await access(resolve(dist, path));
}

const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8');
assert.equal(robots.trim(), 'User-agent: *\nAllow: /\nSitemap: https://theconstruct.ing/sitemap-index.xml');

const home = await readFile(resolve(dist, 'index.html'), 'utf8');

assert.match(home, /<link rel="canonical" href="https:\/\/theconstruct\.ing\/"/);
