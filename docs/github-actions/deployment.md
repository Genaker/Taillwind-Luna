# Deployment Guide

Step-by-step guide for deploying Tailwind Luna Theme documentation to GitHub Pages with GitHub Actions.

## Prerequisites

- GitHub repository created and pushed
- GitHub Actions enabled (default)
- Documentation files in place

## Initial Setup (First-Time Only)

### Step 1: Configure Repository Settings

1. **Go to GitHub Repository** → Settings
2. **Navigate to** Pages
3. **Source**: Select "GitHub Actions"
4. **Save**

### Step 2: Ensure Workflow File Exists

Verify `.github/workflows/deploy-mkdocs.yml` exists in repository root:

```bash
ls -la .github/workflows/deploy-mkdocs.yml
```

If missing, create it with the provided template.

### Step 3: Push to Repository

```bash
git add .github/workflows/deploy-mkdocs.yml mkdocs.yml requirements.txt
git commit -m "Add MkDocs GitHub Actions workflow"
git push origin main
```

This triggers the first workflow run.

## Deployment Process

### Automatic Deployment (Main Branch)

**Trigger**: Push to `main` or `master` branch

```bash
# Make changes locally
vim docs/some-file.md

# Commit and push
git add docs/
git commit -m "Update documentation"
git push origin main
```

**Result**: 
1. GitHub Actions automatically builds site
2. Deploys to GitHub Pages
3. Available at `https://your-org.github.io/tailwind-luna-theme/`

### Manual Deployment

If needed, manually trigger workflow:

1. Go to GitHub → **Actions**
2. Select **Deploy MkDocs to GitHub Pages**
3. Click **Run workflow**
4. Select branch and **Run workflow**

### Pull Request Preview

When submitting a PR:

1. GitHub Actions **builds** documentation
2. Adds comment: "✅ Documentation built successfully!"
3. Once merged to main, **publishes** to GitHub Pages

**Note**: PR documentation is NOT published, only built and verified.

## Deployment Status and Monitoring

### Check Deployment Status

1. **Go to Actions tab**
2. **Select "Deploy MkDocs to GitHub Pages"**
3. **Review the latest workflow run**

### View Deployment Details

Access the published site:

```
https://your-org.github.io/tailwind-luna-theme/
```

### Review Workflow Logs

1. **Actions** → **Workflow Run**
2. **Deploy to GitHub Pages** job
3. Expand step for details

Key steps to review:
- ✓ Checkout repository
- ✓ Setup Python
- ✓ Install dependencies
- ✓ Build MkDocs site
- ✓ Deploy to GitHub Pages

## Documentation Updates

### Updating Documentation

```bash
# Edit documentation locally
cd /home/oro/test/tailwind-luna-theme

# Update files in docs/ directory
vim docs/getting-started/overview.md

# Test locally
pip install -r requirements.txt
mkdocs serve

# Browse to http://localhost:8000 to preview
```

### Committing Changes

```bash
# Stage changes
git add docs/ mkdocs.yml

# Commit with clear message
git commit -m "docs: add deployment guide explanation"

# Push to main
git push origin main
```

**Result**: Automatic deployment triggered

### Safe Deployment with Branches

For significant changes:

```bash
# Create feature branch
git checkout -b docs/add-api-reference

# Make changes
vim docs/api-reference.md

# Commit changes
git add docs/
git commit -m "docs: add API reference section"

# Push branch
git push origin docs/add-api-reference

# Create Pull Request on GitHub
# - Workflow will build and test
# - Comment appears when ready
# - Merge when satisfied
# - Auto-deploys to GitHub Pages
```

## Customization

### Update Site Configuration

Edit `mkdocs.yml`:

```yaml
site_name: Your Site Name
site_url: https://your-domain.com/
repo_url: https://github.com/your-org/repo
```

### Modify Navigation

Update `mkdocs.yml` `nav` section:

```yaml
nav:
  - Home: index.md
  - New Section:
    - Page 1: section/page1.md
    - Page 2: section/page2.md
```

### Change Theme

In `mkdocs.yml`:

```yaml
theme:
  name: material  # Options: material, readthedocs, mkdocs
  palette:
    primary: indigo
    accent: deep orange
```

### Add Extensions

Update `requirements.txt`:

```txt
mkdocs==1.5.3
mkdocs-material==9.5.3
mkdocs-search-replace==0.1.0
```

Then push - workflow automatically installs new packages.

## Deployment Environments

### GitHub Pages Environments

Default environment: `github-pages`

View deployments:
```
Settings → Environments → github-pages → Deployments
```

### Custom Domain (Optional)

1. **Settings** → **Pages**
2. **Custom domain**: Enter your domain (e.g., docs.example.com)
3. **Save**
4. Add DNS records:
   ```
   A record: 185.199.108.153
   A record: 185.199.109.153
   A record: 185.199.110.153
   A record: 185.199.111.153
   OR CNAME to: your-org.github.io
   ```

## Troubleshooting Deployments

### Build Failures

**Error**: Build fails with YAML error

```bash
# Solution: Validate mkdocs.yml locally
mkdocs serve

# Check for syntax errors
python -m yaml mkdocs.yml
```

**Error**: Dependencies missing

```bash
# Make sure requirements.txt includes all packages
pip install -r requirements.txt

# Update if needed
pip list > requirements.txt
```

### Not Deploying to GitHub Pages

1. Check **Settings** → **Pages** → Source is "GitHub Actions"
2. Verify workflow runs successfully (green checkmark in Actions)
3. Verify repository is public
4. Clear browser cache

### Access Issues

**404 Errors**: Verify repository is public and workflow completed successfully.

**HTTPS Certificate**: GitHub Pages automatically provisions SSL certificates.

**Old Content Showing**: Clear browser cache and verify latest deployment completed.

## Advanced Deployments

### Deploy to Multiple Locations

Extend workflow to also:

1. **Push Docker image to Docker Hub**
2. **Push to PyPI package repository**
3. **Deploy to staging server**

Requires additional job steps and secrets.

### Scheduled Deployments

```yaml
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly Sunday midnight
```

Use for:
- Auto-generated documentation
- Refreshing examples
- Testing stability

### Status Checks for PRs

Prevent merging without passing workflow:

1. **Settings** → **Branches** → **Branch Protection Rules**
2. **Require status checks to pass**
3. **Select "Deploy MkDocs to GitHub Pages"**

Now PRs require successful doc builds before merging.

## Performance Optimization

### Caching

The workflow includes Python dependency caching:

```yaml
- uses: actions/setup-python@v4
  with:
    cache: 'pip'
```

This improves build performance on subsequent runs.

### Parallel Builds

Current workflow runs single job. For large docs:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps: [...]
  
  test:
    runs-on: ubuntu-latest
    needs: build
    steps: [...]
```

### CDN Configuration (Optional)

GitHub Pages automatically uses global CDN. No additional config needed.

---

## Summary

**Process Flow**:
1. Edit documentation locally in `docs/` directory
2. Commit and push to `main` branch
3. GitHub Actions automatically builds and deploys
4. Site becomes available at `https://your-org.github.io/tailwind-luna-theme/`

**Quick Links**:
- GitHub Actions: `https://github.com/your-org/repo/actions`
- Published Site: `https://your-org.github.io/tailwind-luna-theme/`
- Workflow File: `.github/workflows/deploy-mkdocs.yml`

---

Next: [Workflows Reference](workflows.md)
