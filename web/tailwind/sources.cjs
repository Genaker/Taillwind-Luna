/**
 * Single source of truth for SCSS merge roots and Tailwind content globs.
 * Theme-local paths are relative to the theme package root (parent of web/tailwind).
 * Magento-wide paths (vendor, app/code, src, app/design) are absolute, built from the resolved
 * Magento root — see magento-root.cjs. A fixed "../.." only holds for one install layout.
 */
const path = require("path");
const { resolveMagentoRoot } = require("./magento-root.cjs");

const themeRoot = path.join(__dirname, "..", "..");
const magentoRoot = resolveMagentoRoot(themeRoot);

/** Absolute, forward-slash glob under the Magento root (glob patterns never use backslashes). */
function fromMagento(rel) {
  return path.join(magentoRoot, rel).replace(/\\/g, "/");
}

/** @type {string[]} */
const scssRootGlobs = [
  "web/tailwind/modules/**/*.scss",
  "web/tailwind/extensions/**/*.scss", // merge order: after modules (see scripts/merge-scss.cjs)
  // Magento module SCSS (same path in vendor, app/code, or src): …/view/frontend/web/tailwind/*.scss
  fromMagento("vendor/magento/module-*/view/frontend/web/tailwind/**/*.scss"),
  fromMagento("app/code/*/*/view/frontend/web/tailwind/**/*.scss"),
  fromMagento("src/**/view/frontend/web/tailwind/**/*.scss"),
];

/** Optional layered merge config (theme first, then these paths, sorted). See scss-config.cjs */
const scssConfigGlobs = [
  fromMagento("vendor/magento/module-*/view/frontend/web/tailwind/scss.config.json"),
  fromMagento("app/code/*/*/view/frontend/web/tailwind/scss.config.json"),
  fromMagento("src/**/view/frontend/web/tailwind/scss.config.json"),
];

/**
 * styles.yaml discovery — placed at module/theme root (not inside web/tailwind/).
 * Inspired by OroInc frontend architecture: https://doc.oroinc.com/frontend/storefront/css/
 * Format: inputs (list of SCSS paths relative to the yaml file), tier (0-2), exclude (list).
 */
const stylesYamlGlobs = [
  "styles.yaml",
  "styles.yml",
  fromMagento("vendor/magento/module-*/styles.yaml"),
  fromMagento("vendor/magento/module-*/styles.yml"),
  fromMagento("app/code/*/*/styles.yaml"),
  fromMagento("app/code/*/*/styles.yml"),
  fromMagento("src/**/styles.yaml"),
  fromMagento("src/**/styles.yml"),
];

/** @type {string[]} */
const contentFiles = [
  "./Magento_*/**/*.phtml",
  "./Magento_*/**/*.xml",
  "./Magento_*/web/template/**/*.html",
  "./Magento_*/web/templates/**/*.html",
  "./web/tailwind/**/*.scss",
  "./web/tailwind/css-safelist.html",
  fromMagento("vendor/magento/module-*/view/frontend/templates/**/*.phtml"),
  fromMagento("vendor/magento/module-*/view/frontend/layout/**/*.xml"),
  fromMagento("vendor/magento/module-*/view/frontend/web/template/**/*.html"),
  fromMagento("vendor/magento/module-*/view/frontend/web/tailwind/**/*.scss"),
  fromMagento("app/code/*/*/view/frontend/templates/**/*.phtml"),
  fromMagento("app/code/*/*/view/frontend/layout/**/*.xml"),
  fromMagento("app/code/*/*/view/frontend/web/template/**/*.html"),
  fromMagento("app/code/*/*/view/frontend/web/tailwind/**/*.scss"),
  fromMagento("app/design/frontend/*/*/Magento_*/templates/**/*.phtml"),
  fromMagento("app/design/frontend/*/*/Magento_*/layout/**/*.xml"),
  fromMagento("src/**/view/frontend/templates/**/*.phtml"),
  fromMagento("src/**/view/frontend/web/tailwind/**/*.scss"),
];

/** Primary storefront theme code (see registration.php — same package also registers win_luna). */
const defaultPubStaticPath = "pub/static/frontend/Genaker/tailwind_luna/en_US";

/** Copy build output to every path the theme is registered under so dev refresh works for either code. */
const defaultPubStaticPaths = [
  defaultPubStaticPath,
  "pub/static/frontend/Genaker/win_luna/en_US",
];

module.exports = {
  themeRoot,
  magentoRoot,
  scssRootGlobs,
  scssConfigGlobs,
  stylesYamlGlobs,
  contentFiles,
  defaultPubStaticPath,
  defaultPubStaticPaths,
};
