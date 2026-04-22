# Quick Start: Clone Tailwind Luna as Local Repository

Step-by-step guide for cloning the Tailwind Luna theme and installing it locally via Composer.

## Prerequisites

- Docker and Docker Compose running
- Git installed
- Terminal/shell access
- Magento 2.4.7 already installed

## Quick Steps (5 minutes)

### Step 1: Clone the Tailwind Luna Theme

```bash
# Navigate to workspace directory
cd /home/oro/test

# Clone the theme repository
git clone https://github.com/your-org/tailwind-luna-theme.git tailwind-luna-custom

# Navigate into the theme directory
cd tailwind-luna-custom

# Verify composer.json exists
cat composer.json | head -20
```

Expected output:
```json
{
  "name": "tailwind/luna-theme",
  "description": "Tailwind Luna Theme for Magento",
  "type": "magento2-theme",
  ...
}
```

### Step 2: Configure Magento Project

```bash
# Navigate to Magento project
cd /home/oro/test/luma-repo/magento

# Edit composer.json to add local repository
# Option A: Using jq (if installed)
jq '.repositories += [{"type": "path", "url": "../../tailwind-luna-custom", "options": {"symlink": true}}]' \
  composer.json > composer.json.tmp && mv composer.json.tmp composer.json

# Option B: Manual edit with text editor
nano composer.json
# Add this to the beginning of the file (in root object):
# "repositories": [
#   {
#     "type": "path",
#     "url": "../../tailwind-luna-custom",
#     "options": {
#       "symlink": true
#     }
#   }
# ],
```

### Step 3: Require the Theme

```bash
# Using Docker Compose from Magento directory
cd /home/oro/test/luma-repo

# Install/require the theme
./docker-compose exec php composer require "tailwind/luna-theme:*" --no-interaction

# Or from theme repo
cd /home/oro/test/tailwind-luna-theme
./docker-compose exec php composer require "tailwind/luna-theme:*" --no-interaction
```

### Step 4: Verify Installation

```bash
# Check if theme is installed
./docker-compose exec php composer show tailwind/luna-theme

# Check vendor directory
./docker-compose exec php ls -la vendor/tailwind/

# Verify symlink or copy
./docker-compose exec php cat vendor/tailwind/luna-theme/composer.json | head -5
```

### Step 5: Complete Setup

```bash
# Clear Magento cache
./docker-compose exec php php bin/magento cache:clean

# Deploy static content
./docker-compose exec php php bin/magento setup:static-content:deploy -f

# Reindex
./docker-compose exec php php bin/magento indexer:reindex

# Verify theme available
./docker-compose exec php php bin/magento theme:list | grep luna
```

## Result

Your Magento project structure should now look like:

```
/home/oro/test/
├── luma-repo/
│   └── magento/
│       ├── composer.json (with "repositories" section)
│       ├── vendor/
│       │   └── tailwind/
│       │       └── luna-theme/ (symlink or copy)
│       └── app/design/frontend/Tailwind/Luna/ (theme files)
└── tailwind-luna-custom/
    ├── composer.json
    ├── registration.php
    └── ... (theme source files)
```

## Usage During Development

### Edit Theme Files

```bash
# Theme source files are either:
# 1. Symlinked: Changes show immediately
# 2. Copied: Need to re-run composer update

# Edit theme
vim /home/oro/test/tailwind-luna-custom/web/css/custom.css

# If using symlinks, just refresh browser
# If using copies, run:
cd /home/oro/test/luma-repo/magento
./docker-compose exec php composer update tailwind/luna-theme
```

### Deploy Changes

```bash
# After making changes to theme
cd /home/oro/test/luma-repo

# Clear cache
./docker-compose exec php php bin/magento cache:clean

# Deploy static content again
./docker-compose exec php php bin/magento setup:static-content:deploy -f
```

## Complete composer.json Example

See the full structure of what your `composer.json` should look like:

```json
{
  "name": "magento/project-community-edition",
  "description": "Magento 2 Community Edition",
  "type": "project",
  "repositories": [
    {
      "type": "path",
      "url": "../../tailwind-luna-custom",
      "options": {
        "symlink": true
      }
    },
    {
      "type": "composer",
      "url": "https://repo.magento.com/"
    }
  ],
  "require": {
    "magento/product-community-edition": "2.4.7",
    "tailwind/luna-theme": "*",
    ...
  },
  "require-dev": {
    ...
  }
}
```

## Using Multiple Local Repositories

If you have multiple custom packages:

```json
{
  "repositories": [
    {
      "type": "path",
      "url": "../../tailwind-luna-custom",
      "options": {"symlink": true}
    },
    {
      "type": "path",
      "url": "../../custom-module",
      "options": {"symlink": true}
    },
    {
      "type": "path",
      "url": "../../shared-lib",
      "options": {"symlink": true}
    },
    {
      "type": "composer",
      "url": "https://repo.magento.com/"
    }
  ],
  "require": {
    "magento/product-community-edition": "2.4.7",
    "tailwind/luna-theme": "*",
    "your-org/custom-module": "*",
    "your-org/shared-lib": "*"
  }
}
```

## Troubleshooting

### Symlinks Not Working (Windows)

If symlinks fail on Windows, use copy mode:

```json
{
  "type": "path",
  "url": "../../tailwind-luna-custom",
  "options": {
    "symlink": false
  }
}
```

### Changes Not Reflected

```bash
# Clear everything and reinstall
cd /home/oro/test/luma-repo/magento

# Remove vendor and lock file
./docker-compose exec php rm -rf vendor composer.lock

# Reinstall
./docker-compose exec php composer install
```

### "Could not find package at path"

```bash
# Verify the path exists
ls -la /home/oro/test/tailwind-luna-custom/composer.json

# Verify composer.json is valid
./docker-compose exec php composer validate /path/to/tailwind-luna-custom
```

## Docker-Only Installation

If cloning in Docker:

```bash
# Clone inside PHP container
./docker-compose exec php git clone https://github.com/your-org/tailwind-luna-theme.git /tailwind-luna-custom

# Configure Magento composer.json
./docker-compose exec php composer require "tailwind/luna-theme:*" --no-interaction
```

## Next Steps

1. **Develop**: Edit files in `/home/oro/test/tailwind-luna-custom/`
2. **Test**: Access Magento and verify theme changes
3. **Deploy**: Follow [MkDocs Deployment Guide](../github-actions/deployment.md)
4. **Publish**: When ready, publish to Packagist

## References

- **Full Guide**: [Local Path Repositories](LOCAL_PATH_REPOSITORIES.md)
- **Troubleshooting**: [Composer Troubleshooting](troubleshooting.md)
- **Installation**: [Installation Guide](INSTALLATION_GUIDE.md)

---

**Time to Complete**: ~5 minutes  
**Difficulty**: ⭐⭐ (Beginner-friendly)
