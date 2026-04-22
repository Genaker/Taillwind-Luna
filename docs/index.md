# Tailwind Luna Theme - Documentation & GitHub Actions

This is the main documentation hub for Tailwind Luna, a modern Magento 2.4.7 theme with complete Docker infrastructure and automated CI/CD via GitHub Actions.

## Quick Links

- 🚀 **[Getting Started](getting-started/overview.md)** - Overview and navigation
- ⚡ **[Quick Start](getting-started/quick-start.md)** - Up and running in 5 minutes  
- 📦 **[Installation Guide](getting-started/installation.md)** - Complete setup walkthrough
- 🐳 **[Docker Setup](docker/DOCKER_COMPOSE_SETUP.md)** - Container configuration
- 🔧 **[Composer Setup](composer/INSTALLATION_GUIDE.md)** - Dependency management
- 🚀 **[GitHub Actions](github-actions/workflows.md)** - CI/CD automation
- 📖 **[Deployment Guide](github-actions/deployment.md)** - Publishing to GitHub Pages
- 📊 **[Project Status](PROJECT_STATUS.md)** - System overview

## Documentation Structure

```
docs/
├── index.md                              ← You are here
├── getting-started/                      ← Quick setup guides
│   ├── overview.md                       ← Project introduction
│   ├── quick-start.md                    ← 5-minute setup
│   └── installation.md                   ← Detailed installation
├── docker/                               ← Docker documentation
│   ├── DOCKER_COMPOSE_SETUP.md          ← Container architecture
│   └── configuration.md                  ← Service details
├── composer/                             ← Installation guides
│   ├── INSTALLATION_GUIDE.md            ← Magento setup
│   └── troubleshooting.md               ← Common issues
├── github-actions/                       ← CI/CD documentation
│   ├── workflows.md                      ← Workflow reference
│   └── deployment.md                     ← GitHub Pages deployment
└── [Original Theme Docs]                 ← Theme development docs
    ├── TAILWIND_EXTENSION_DEVELOPMENT.md
    ├── CSS_BUILD_ARCHITECTURE.md
    ├── WARDEN.md
    └── ...
```

## Key Features

✅ **Complete Docker Setup**
- PHP 8.3-FPM with 11 extensions
- Nginx 1.25 with official Magento config
- MariaDB 10.6 database
- Elasticsearch 7.17.0 search engine

✅ **Automated Deployment**
- GitHub Actions workflow for continuous deployment
- Automatic publishing to GitHub Pages
- MkDocs for professional documentation
- PR build verification

✅ **Comprehensive Documentation**
- Getting started guides
- Docker configuration reference
- Composer installation walkthrough
- Theme development resources
- Troubleshooting guides

✅ **Easy Development**
- Docker Compose for local environment
- Wrapper scripts for convenience
- Clear configuration organization
- Well-documented architecture

## Getting Started

### 1. Quick Setup (5 minutes)

```bash
# Clone repository
git clone <your-repo-url> tailwind-luna-theme
cd tailwind-luna-theme

# Start services
./docker-compose up -d

# Access frontend
open http://172.29.201.103:8888/
```

→ See [Quick Start](getting-started/quick-start.md) for details

### 2. Full Installation (15 minutes)

→ See [Installation Guide](getting-started/installation.md) for complete walkthrough

### 3. GitHub Actions Setup

The documentation is automatically published to GitHub Pages via GitHub Actions.

→ See [GitHub Actions Workflows](github-actions/workflows.md) for details

→ See [Deployment Guide](github-actions/deployment.md) for GitHub Pages setup

## Common Tasks

### Start/Stop Services

```bash
# Start all services
./docker-compose up -d

# Stop services
./docker-compose down

# View logs
./docker-compose logs -f php
```

### Access Magento

| Service | URL | User |
|---------|-----|------|
| Frontend | http://172.29.201.103:8888/ | Public |
| Admin | http://172.29.201.103:8888/admin_nsz0nw1/ | admin / Admin@12345 |

### Update Documentation

1. Edit files in `docs/` directory (Markdown format)
2. Test locally: `mkdocs serve` (requires Python 3.11+)
3. Commit and push changes
4. GitHub Actions automatically deploys to GitHub Pages

### Run Magento Commands

```bash
# From theme repository
./docker-compose exec php php bin/magento cache:clean
./docker-compose exec php php bin/magento indexer:reindex
```

## System Requirements

- Docker & Docker Compose
- Linux, macOS, or Windows (with WSL2)
- Git for version control
- Python 3.11+ (for local MkDocs development)
- 10 GB free disk space

## Architecture Overview

```
┌─────────────────────────────────────────┐
│      GitHub Repository (Main)           │
├─────────────────────────────────────────┤
│ .github/workflows/deploy-mkdocs.yml     │ ← GitHub Actions
└──────────────┬──────────────────────────┘
               │ Push trigger
               ▼
┌─────────────────────────────────────────┐
│    GitHub Actions Build Environment     │
├─────────────────────────────────────────┤
│ 1. Checkout code                        │
│ 2. Setup Python 3.11                    │
│ 3. Install MkDocs & dependencies        │
│ 4. Build static site (mkdocs build)     │ ← Generates HTML
│ 5. Deploy to GitHub Pages               │
└──────────────┬──────────────────────────┘
               │ Publish
               ▼
┌─────────────────────────────────────────┐
│   GitHub Pages (Published Docs)         │
├─────────────────────────────────────────┤
│ https://your-org.github.io/             │
│   tailwind-luna-theme/                  │
└─────────────────────────────────────────┘
```

## Documentation Technology Stack

- **MkDocs**: Static site generator for documentation
- **Material Theme**: Professional Material Design theme
- **GitHub Actions**: Continuous deployment workflow
- **GitHub Pages**: Free hosting for static content
- **Markdown**: Documentation source format

## Workflow Explanation

1. **Developer makes changes** to docs in `docs/` directory
2. **Push to main branch** via git
3. **GitHub detects push** to main branch
4. **GitHub Actions workflow triggers**:
   - Installs Python and dependencies
   - Builds MkDocs site (converts Markdown to HTML)
   - Uploads site to GitHub Pages
5. **Documentation published** and live within 2-3 minutes

## Supported Features

- 📱 Responsive design (mobile-friendly)
- 🌓 Dark/light mode toggle
- 🔍 Full-text search
- 📋 Automatic navigation menu
- 🎨 Code syntax highlighting
- ⚡ Fast static site serving
- 🔄 Automatic sitemap generation

## Troubleshooting

### Documentation not updating after push?
- Wait 2-3 minutes for GitHub Actions workflow
- Check [Actions tab](https://github.com/your-org/repo/actions) for build status
- Clear browser cache (Ctrl+Shift+Delete)

### Build fails with "module not found"?
- Check `requirements.txt` has all dependencies
- Verify `mkdocs.yml` YAML syntax
- Test locally: `mkdocs build`

### Still stuck?
→ See [Installation Guide troubleshooting](getting-started/installation.md#troubleshooting) section

---

## Resources

- **Magento 2.4.7**: https://magento.com/
- **MkDocs**: https://www.mkdocs.org/
- **Material Theme**: https://squidfunk.github.io/mkdocs-material/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Docker**: https://www.docker.com/

---

**Last Updated**: April 22, 2026  
**Status**: ✅ Full Documentation Enabled with GitHub Actions
