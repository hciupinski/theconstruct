import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve('dist');
const home = await readFile(resolve(dist, 'index.html'), 'utf8');

assert.match(home, /<link rel="canonical" href="https:\/\/theconstruct\.ing\/"/);
