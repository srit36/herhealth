import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const tokens = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8');
const globals = readFileSync(join(root, 'src/app/globals.css'), 'utf8');

function definedTokens(css: string): Set<string> {
  return new Set(
    [...css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map((m) => m[1]),
  );
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(css|ts|tsx)$/.test(name) && !name.endsWith('.test.ts')
      ? [path]
      : [];
  });
}

describe('design tokens', () => {
  const defined = definedTokens(tokens);

  it('defines the core palette', () => {
    for (const name of [
      '--color-ink',
      '--color-muted',
      '--color-line',
      '--color-surface',
      '--color-canvas',
      '--color-teal',
      '--color-teal-dark',
      '--color-teal-soft',
      '--font-sans',
      '--font-display',
    ]) {
      expect(defined.has(name), `${name} should be defined`).toBe(true);
    }
  });

  it('every token the global CSS references is defined', () => {
    const referenced = [
      ...globals.matchAll(
        /var\((--(?:color|font|radius|shadow)-[a-z0-9-]+)\)/g,
      ),
    ].map((m) => m[1]);
    expect(referenced.length).toBeGreaterThan(0);
    for (const name of new Set(referenced)) {
      expect(defined.has(name), `${name} is used but not defined`).toBe(true);
    }
  });

  it('keeps every legacy variable as an alias of a token', () => {
    const legacy = [
      'ink',
      'muted',
      'faint',
      'line',
      'surface',
      'canvas',
      'teal',
      'teal-dark',
      'teal-soft',
      'sage',
      'sand',
      'sidebar',
    ];
    for (const name of legacy) {
      expect(globals).toContain(`--${name}: var(--color-${name});`);
    }
  });
});

describe('privacy', () => {
  it('loads no fonts or styles from third-party hosts', () => {
    const offenders = sourceFiles(join(root, 'src')).filter((file) =>
      /fonts\.googleapis\.com|fonts\.gstatic\.com/.test(
        readFileSync(file, 'utf8'),
      ),
    );
    expect(offenders).toEqual([]);
  });
});
