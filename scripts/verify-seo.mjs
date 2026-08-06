import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve('dist');

for (const path of ['robots.txt', 'site.webmanifest', 'favicon.svg', 'og-default.svg', 'og-default.png']) {
  await access(resolve(dist, path));
}

const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8');
assert.equal(robots.trim(), 'User-agent: *\nAllow: /\nSitemap: https://theconstruct.ing/sitemap-index.xml');

const home = await readFile(resolve(dist, 'index.html'), 'utf8');

assert.match(home, /<meta property="og:url" content="https:\/\/theconstruct\.ing\/"/);
assert.match(home, /<meta property="og:image" content="https:\/\/theconstruct\.ing\/og-default\.png"/);
assert.match(home, /<meta name="twitter:card" content="summary_large_image"/);
assert.match(home, /"@type":"WebSite"/);
assert.match(home, /"@type":"Person"/);
assert.match(home, /<link rel="canonical" href="https:\/\/theconstruct\.ing\/"/);
assert.doesNotMatch(home, /hciupinski\.github\.io/);
assert.match(home, /<h1[^>]*>Software architecture, security, and engineering<\/h1>/);
assert.match(home, /href="\/portfolio\//);
assert.match(home, /href="\/blog\//);
assert.match(home, /href="\/architect\//);

await access(resolve('src/pages/blog/tags/[tag].astro'));

const portfolioDirectories = await readdir(resolve(dist, 'portfolio'), { withFileTypes: true });
const firstProject = portfolioDirectories.find((entry) => entry.isDirectory());
assert.ok(firstProject, 'Expected at least one generated portfolio project');
const project = await readFile(resolve(dist, 'portfolio', firstProject.name, 'index.html'), 'utf8');
assert.match(project, /"@type":"CreativeWork"/);
assert.match(project, /<link rel="canonical" href="https:\/\/theconstruct\.ing\/portfolio\//);
assert.doesNotMatch(project, /hciupinski\.github\.io/);

await access(resolve(dist, 'sitemap-index.xml'));
const rss = await readFile(resolve(dist, 'rss.xml'), 'utf8');
assert.match(rss, /https:\/\/theconstruct\.ing\//);
assert.doesNotMatch(rss, /hciupinski\.github\.io/);
