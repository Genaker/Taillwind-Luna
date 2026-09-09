#!/usr/bin/env node
/**
 * Tests for web/tailwind/magento-root.cjs — the theme must find the Magento root from any
 * install depth (Composer vendor/, app/design clone, symlinked clone via MAGENTO_ROOT).
 * Run: node scripts/tests/magento-root.test.cjs
 */
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const themeRoot = path.resolve(__dirname, "..", "..");
const { resolveMagentoRoot, findMagentoRootFrom } = require(
  path.join(themeRoot, "web", "tailwind", "magento-root.cjs"),
);

const PASS = "\x1b[32m✓\x1b[0m";
const FAIL = "\x1b[31m✗\x1b[0m";
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    console.log(`  ${PASS} ${msg}`);
  } else {
    console.error(`  ${FAIL} ${msg}`);
    failed++;
  }
}

function mkdirs(...dirs) {
  for (const d of dirs) fs.mkdirSync(d, { recursive: true });
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "tailwind-luna-root-"));
const savedEnv = process.env.MAGENTO_ROOT;
delete process.env.MAGENTO_ROOT;

try {
  // Composer install: <root>/vendor/genaker/theme-frontend-tailwind-luna — 3 levels down.
  const root = path.join(tmp, "magento");
  const composerTheme = path.join(root, "vendor", "genaker", "theme-frontend-tailwind-luna");
  mkdirs(path.join(root, "bin"), path.join(root, "app", "etc"), path.join(root, "pub"), composerTheme);
  fs.writeFileSync(path.join(root, "bin", "magento"), "#!/usr/bin/env php\n");
  assert(resolveMagentoRoot(composerTheme) === root, "composer install (vendor/, 3 levels) resolves to Magento root");

  // app/design clone: <root>/app/design/frontend/Genaker/tailwind_luna — 5 levels down.
  const designTheme = path.join(root, "app", "design", "frontend", "Genaker", "tailwind_luna");
  mkdirs(designTheme);
  assert(resolveMagentoRoot(designTheme) === root, "app/design clone (5 levels) resolves to Magento root");

  // Root recognised by app/etc + pub even without bin/magento.
  const rootNoBin = path.join(tmp, "nobin");
  const themeNoBin = path.join(rootNoBin, "vendor", "genaker", "theme");
  mkdirs(path.join(rootNoBin, "app", "etc"), path.join(rootNoBin, "pub"), themeNoBin);
  assert(resolveMagentoRoot(themeNoBin) === rootNoBin, "app/etc + pub without bin/magento is accepted as root");

  // No marker anywhere (standalone checkout, CI): legacy two-levels-up fallback.
  const standalone = path.join(tmp, "standalone", "a", "b", "theme");
  mkdirs(standalone);
  assert(findMagentoRootFrom(standalone) === null, "no marker → findMagentoRootFrom returns null");
  assert(
    resolveMagentoRoot(standalone) === path.resolve(standalone, "..", ".."),
    "no marker → falls back to two levels above the theme",
  );

  // Explicit override wins over detection.
  const override = path.join(tmp, "override-root");
  mkdirs(override);
  process.env.MAGENTO_ROOT = override;
  assert(resolveMagentoRoot(composerTheme) === override, "MAGENTO_ROOT env overrides detection");
  delete process.env.MAGENTO_ROOT;

  // sources.cjs exposes the resolved root and builds absolute Magento-wide globs from it.
  const sources = require(path.join(themeRoot, "web", "tailwind", "sources.cjs"));
  assert(path.isAbsolute(sources.magentoRoot), "sources.magentoRoot is absolute");
  const vendorGlobs = sources.contentFiles.filter((g) => g.includes("vendor/magento"));
  assert(vendorGlobs.length > 0 && vendorGlobs.every((g) => g.startsWith(sources.magentoRoot.replace(/\\/g, "/"))),
    "vendor content globs are absolute under sources.magentoRoot (no fixed ../../)");
  assert(!sources.scssRootGlobs.some((g) => g.startsWith("../../")), "scssRootGlobs contain no ../../ patterns");
} finally {
  if (savedEnv !== undefined) process.env.MAGENTO_ROOT = savedEnv;
  fs.rmSync(tmp, { recursive: true, force: true });
}

if (failed) {
  console.error(`\n${failed} assertion(s) failed`);
  process.exit(1);
}
console.log("\nmagento-root tests passed");
