#!/usr/bin/env node
/**
 * Write current Unix timestamp (ms) to pub/static/deployed_version.txt for static URL cache busting.
 * Creates parent dirs if needed; replaces file when it already exists.
 * Content must be digits only (no trailing newline): core reads the file verbatim for /static/version…/ URLs.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const themeRoot = path.resolve(__dirname, "..");
const { resolveMagentoRoot } = require(path.join(themeRoot, "web", "tailwind", "magento-root.cjs"));
const defaultMagentoRoot = resolveMagentoRoot(themeRoot);
const relativeDeployedVersion = path.join("pub", "static", "deployed_version.txt");

/**
 * @param {string} [magentoRoot] — project root (parent of pub/). Defaults to the detected Magento root
 *   (see web/tailwind/magento-root.cjs: MAGENTO_ROOT env, then nearest ancestor with bin/magento).
 */
function bumpStaticDeployVersion(magentoRoot = defaultMagentoRoot) {
  const file = path.join(magentoRoot, relativeDeployedVersion);
  const ts = String(Date.now());
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // No trailing newline: Magento\Framework\App\View\Deployment\Version\Storage\File::load()
  // returns readFile() as-is; a \n would be part of the version string and break URLs like
  // .../static/version123456\n/frontend/... (JSON.parse / loader icon).
  fs.writeFileSync(file, ts, "utf8");
  console.log(`[bump-static-deploy-version] ${path.relative(magentoRoot, file)} → ${ts}`);
}

if (require.main === module) {
  bumpStaticDeployVersion();
}

module.exports = { bumpStaticDeployVersion, relativeDeployedVersion };
