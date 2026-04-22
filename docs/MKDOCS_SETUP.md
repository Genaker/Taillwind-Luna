# MkDocs & GitHub Actions Documentation Setup

Complete guide for managing and deploying Tailwind Luna documentation with MkDocs and GitHub Actions.

## Overview

This project uses **MkDocs** to generate professional documentation with automatic deployment to **GitHub Pages** via **GitHub Actions**.

### Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **MkDocs** | Documentation site generator | `mkdocs.yml` configuration |
| **GitHub Actions** | CI/CD automation | `.github/workflows/deploy-mkdocs.yml` |
| **GitHub Pages** | Free static site hosting | Published at `*.github.io/tailwind-luna-theme/` |
| **Markdown Files** | Documentation content | `docs/` directory |

## Quick Start

### 1. Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Serve documentation locally
mkdocs serve

# Open browser to http://localhost:8000
```

### 2. Make Changes

```bash
# Edit any file in docs/ directory
vim docs/getting-started/quick-start.md

# Changes appear live at http://localhost:8000
# Just refresh your browser
```

### 3. Deploy to GitHub

```bash
# Commit changes
git add docs/ mkdocs.yml

# Create descriptive commit message
git commit -m "docs: update quick start guide"

# Push to main branch - auto-deploys!
git push origin main
```

**Result**: GitHub Actions automatically builds and publishes to GitHub Pages (2-3 min)

## Directory Structure

```
tailwind-luna-theme/
├── mkdocs.yml                          ← MkDocs configuration
├── requirements.txt                    ← Python dependencies
├── .github/
│   └── workflows/
│       └── deploy-mkdocs.yml          ← GitHub Actions workflow
└── docs/                               ← Documentation content
    ├── index.md                        ← Homepage
    ├── getting-started/
    │   ├── overview.md
    │   ├── quick-start.md
    │   └── installation.md
    ├── docker/
    │   ├── DOCKER_COMPOSE_SETUP.md
    │   └── configuration.md
    ├── composer/
    │   ├── INSTALLATION_GUIDE.md
    │   └── troubleshooting.md
    ├── github-actions/
    │   ├── workflows.md
    │   └── deployment.md
    └── [existing theme documentation]
```

## Configuration

### mkdocs.yml

Main configuration file for MkDocs:

```yaml
site_name: Tailwind Luna Theme Documentation
site_url: https://your-org.github.io/tailwind-luna-theme/
repo_url: https://github.com/your-org/tailwind-luna-theme

theme:
  name: material                         # Material Design theme
  palette:
    primary: indigo                      # Primary color
    accent: deep orange                  # Accent color
  features:
    - navigation.tracking
    - navigation.tabs
    - content.code.copy

nav:                                    # Navigation structure
  - Home: index.md
  - Getting Started:
    - Overview: getting-started/overview.md
    - Quick Start: getting-started/quick-start.md
```

### requirements.txt

Python dependencies for MkDocs:

```txt
mkdocs==1.5.3
mkdocs-material==9.5.3
mkdocs-offline==1.2.1
python-frontmatter==1.0.1
markdown==3.5.1
pymdown-extensions==10.5
```

Add packages as needed:
```bash
pip install new-package
pip freeze > requirements.txt
```

## GitHub Actions Workflow

### File: `.github/workflows/deploy-mkdocs.yml`

Automated workflow for building and deploying documentation:

```yaml
on:
  push:
    branches: [main, master]            # Trigger on push to main
    paths:                              # Only if these files change
      - 'docs/**'
      - 'mkdocs.yml'
      - 'requirements.txt'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4       # Download code
      - uses: actions/setup-python@v4   # Setup Python 3.11
        with:
          python-version: '3.11'
          cache: 'pip'                  # Cache dependencies
      - run: pip install -r requirements.txt
      - run: mkdocs build --strict      # Build static site
      - uses: actions/upload-pages-artifact@v2  # Upload artifact
      - uses: actions/deploy-pages@v2   # Deploy to Pages
```

### GitHub Pages Setup

1. **Repository Settings** → **Pages**
2. **Source**: Select "GitHub Actions"
3. **Save**

Done! Next push triggers deployment.

## Common Tasks

### Add New Documentation Page

1. **Create file** in appropriate directory:
   ```bash
   mkdir -p docs/section
   touch docs/section/new-page.md
   ```

2. **Add content** (Markdown format):
   ```markdown
   # New Page Title
   
   This is the page content.
   ```

3. **Update navigation** in `mkdocs.yml`:
   ```yaml
   nav:
     - Section:
       - New Page: section/new-page.md
   ```

4. **Deploy**:
   ```bash
   git add docs/ mkdocs.yml
   git commit -m "docs: add new page"
   git push origin main
   ```

### Update Theme Colors

In `mkdocs.yml`:

```yaml
theme:
  palette:
    primary: indigo          # Change to: red, blue, green, etc.
    accent: deep orange      # Change to: lime, cyan, etc.
```

### Enable/Disable Features

In `mkdocs.yml`:

```yaml
theme:
  features:
    - navigation.instant     # Smooth page transitions
    - navigation.tabs        # Top-level tabs
    - toc.follow            # Highlight current section in TOC
    - content.code.copy     # Copy button for code blocks
```

### Add Plugins

1. Add to `requirements.txt`:
   ```txt
   mkdocs-search-replace==0.1.0
   mkdocs-git-revision-date==0.3
   ```

2. Update `mkdocs.yml`:
   ```yaml
   plugins:
     - search
     - git-revision-date
   ```

3. Reinstall and test:
   ```bash
   pip install -r requirements.txt
   mkdocs serve
   ```

## Markdown Guide

### Headings

```markdown
# H1 - Page Title
## H2 - Section
### H3 - Subsection
#### H4 - etc
```

### Text Formatting

```markdown
**Bold text**
*Italic text*
`Code inline`
~~Strikethrough~~
```

### Code Blocks

```markdown
\`\`\`bash
#!/bin/bash
echo "Code with syntax highlighting"
\`\`\`
```

### Lists

```markdown
- Unordered item 1
- Unordered item 2

1. Ordered item 1
2. Ordered item 2
```

### Tables

```markdown
| Column 1 | Column 2 |
|----------|----------|
| Row 1, Col 1 | Row 1, Col 2 |
| Row 2, Col 1 | Row 2, Col 2 |
```

### Admonitions

```markdown
!!! note
    This is a note admonition

!!! warning
    This is a warning

!!! tip
    This is a helpful tip
```

### Links

```markdown
[Link Text](relative/path.md)
[External Link](https://example.com)
```

## Building & Testing

### Build Static Site Locally

```bash
# Build to ./site directory
mkdocs build

# Check for warnings/errors
# Look in ./site/index.html
```

### Serve Locally

```bash
# Live reload server
mkdocs serve

# Open browser to http://localhost:8000
# Hot reload on file changes
```

### Build Strict Mode

```bash
# Fail on any warnings
mkdocs build --strict

# Verbose output
mkdocs build --verbose
```

### Test for Broken Links

```bash
# Build offline version (includes link checking)
mkdocs build -f mkdocs.yml

# Check for any 404 errors in logs
```

## Deployment Workflow

```
1. Local Development
   └─ Edit .md files
   └─ Run mkdocs serve
   └─ Test in browser

2. Commit Changes
   └─ git add docs/
   └─ git commit -m "docs: ..."
   └─ git push origin main

3. GitHub Actions Triggered
   └─ Runs .github/workflows/deploy-mkdocs.yml
   └─ Python 3.11 environment
   └─ Install dependencies
   └─ mkdocs build
   └─ Deploy to GitHub Pages

4. Live on GitHub Pages
   └─ Available at https://your-org.github.io/tailwind-luna-theme/
   └─ Accessible worldwide
   └─ Cached by GitHub CDN
```

## Troubleshooting

### Port 8000 Already in Use

```bash
# Use alternate port
mkdocs serve -a localhost:8001
```

### Changes Not Appearing Locally

```bash
# Stop mkdocs (Ctrl+C)
# Clear build cache
rm -rf site/
# Restart
mkdocs serve
```

### Build Fails with YAML Error

```bash
# Check mkdocs.yml syntax
python -c "import yaml; yaml.safe_load(open('mkdocs.yml'))"

# Or validate online: https://www.yamllint.com/
```

### GitHub Actions Build Fails

1. Check **Actions** tab for error logs
2. Common issues:
   - Missing `requirements.txt` - Create it
   - Invalid `mkdocs.yml` - Check YAML syntax
   - Missing dependencies - Add to `requirements.txt`

### Documentation Not Published

1. Check **Actions** tab - is workflow passing?
2. Check **Settings** → **Pages** - source is "GitHub Actions"?
3. Wait 2-3 minutes for GitHub Pages to update
4. Clear browser cache (Ctrl+Shift+Delete)

## Performance Tips

- **Caching**: GitHub Actions caches pip dependencies automatically
- **Incremental builds**: Only changed files rebuild locally
- **CDN**: GitHub Pages uses global CDN for fast delivery
- **Compression**: Static HTML is highly compressible

Build time: ~2 minutes on first run, ~30 seconds on subsequent runs (with cache).

## Advanced Topics

### Custom CSS

Create `docs/stylesheets/extra.css`:

```css
:root {
  --md-primary-fg-color: #1f6feb;
  --md-accent-fg-color: #ff6a00;
}
```

Add to `mkdocs.yml`:

```yaml
extra_css:
  - stylesheets/extra.css
```

### Scheduled Deployments

Add to `.github/workflows/deploy-mkdocs.yml`:

```yaml
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly Sunday midnight
```

### Multi-Language Support

1. Install plugin: `mkdocs-i18n`
2. Configure in `mkdocs.yml`
3. Create language directories in `docs/`

---

## Resources

- **MkDocs Official**: https://www.mkdocs.org/
- **Material Theme Docs**: https://squidfunk.github.io/mkdocs-material/
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **GitHub Pages Docs**: https://pages.github.com/
- **Markdown Guide**: https://www.markdownguide.org/

---

**Questions?** Check:
- [GitHub Actions Workflows](docs/github-actions/workflows.md)
- [Deployment Guide](docs/github-actions/deployment.md)
- [Installation Guide](docs/getting-started/installation.md)

**Last Updated**: April 22, 2026
