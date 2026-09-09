/**
 * Resolve the Magento project root: the directory holding bin/magento, app/, pub/ and vendor/.
 *
 * The theme package can live at different depths below that root:
 *   - Composer install:  <root>/vendor/genaker/theme-frontend-tailwind-luna   (3 levels)
 *   - app/design clone:  <root>/app/design/frontend/Genaker/tailwind_luna     (5 levels)
 *   - symlinked clone:   app/design/... -> ~/tailwind-luna, __dirname may resolve outside <root>
 * so a fixed "../.." from the package cannot be right for all of them. Detect by marker instead.
 *
 * Resolution order:
 *   1. MAGENTO_ROOT env (explicit override, e.g. symlinked clones or CI)
 *   2. nearest ancestor of the theme that contains bin/magento (or app/etc + pub)
 *   3. legacy fallback: two levels above the theme package
 */
"use strict";

const fs = require("fs");
const path = require("path");

function looksLikeMagentoRoot(dir) {
  if (fs.existsSync(path.join(dir, "bin", "magento"))) return true;
  return fs.existsSync(path.join(dir, "app", "etc")) && fs.existsSync(path.join(dir, "pub"));
}

/** Walk up from `startDir` (exclusive) and return the first Magento root, or null. */
function findMagentoRootFrom(startDir) {
  let dir = path.resolve(startDir);
  for (;;) {
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
    if (looksLikeMagentoRoot(dir)) return dir;
  }
}

/**
 * @param {string} themeRoot absolute path of the theme package
 * @returns {string} absolute Magento root
 */
function resolveMagentoRoot(themeRoot) {
  if (process.env.MAGENTO_ROOT) {
    return path.resolve(process.env.MAGENTO_ROOT);
  }
  return findMagentoRootFrom(themeRoot) || path.resolve(themeRoot, "..", "..");
}

module.exports = { resolveMagentoRoot, findMagentoRootFrom, looksLikeMagentoRoot };
