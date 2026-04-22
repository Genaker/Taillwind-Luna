# Using Local Path Repositories with Composer

Guide for cloning repositories locally and installing them via Composer without using Packagist or other remote registries.

## Overview

Local path repositories allow you to:
- ✅ Develop packages locally while integrating them into your project
- ✅ Work with private packages not available on Packagist
- ✅ Test packages before publishing
- ✅ Use custom Magento modules and themes during development
- ✅ Avoid uploading sensitive code to public registries

## Prerequisites

- Composer installed
- Git or file system access to the package
- Basic understanding of Composer

## Method 1: Local Path Repository (Development)

### Step 1: Clone or Create Your Package Locally

```bash
# Clone from a repository
cd /path/to/projects
git clone https://github.com/your-org/my-package.git

# Or create a new directory
mkdir my-package
cd my-package
```

### Step 2: Create Package Structure

Ensure your package has a valid `composer.json`:

```bash
cd /path/to/projects/my-package
cat > composer.json << 'EOF'
{
  "name": "your-vendor/my-package",
  "description": "My custom package",
  "type": "library",
  "version": "1.0.0",
  "authors": [
    {
      "name": "Your Name",
      "email": "you@example.com"
    }
  ],
  "require": {
    "php": "^8.0"
  },
  "autoload": {
    "psr-4": {
      "YourVendor\\MyPackage\\": "src/"
    }
  }
}
EOF
```

### Step 3: Configure Composer to Use Local Path

In your main project's `composer.json`, add the local repository:

```json
{
  "repositories": [
    {
      "type": "path",
      "url": "../my-package",
      "options": {
        "symlink": true
      }
    }
  ],
  "require": {
    "your-vendor/my-package": "*"
  }
}
```

**Options Explained**:
- `"type": "path"` - Use local file system path
- `"url": "../my-package"` - Relative path to package directory
- `"symlink": true` - Create symlink instead of copying files (development only)
- `"symlink": false` - Copy files instead of symlink (production)

### Step 4: Install via Composer

```bash
# From your main project directory
cd /path/to/projects/main-project

# Install or update
composer update your-vendor/my-package

# Or install specific version
composer require "your-vendor/my-package:^1.0"
```

## Method 2: Absolute Path Repository

### For Absolute Paths

```json
{
  "repositories": [
    {
      "type": "path",
      "url": "/home/oro/test/tailwind-luna-theme",
      "options": {
        "symlink": true
      }
    }
  ],
  "require": {
    "your-vendor/tailwind-luna": "*"
  }
}
```

**Example with Magento project**:

```json
{
  "repositories": [
    {
      "type": "path",
      "url": "/home/oro/tailwind-luna-theme",
      "options": {
        "symlink": true
      }
    }
  ],
  "require": {
    "tailwind/luna-theme": "*"
  }
}
```

## Method 3: Multiple Local Repositories

### Configure Multiple Packages

```json
{
  "repositories": [
    {
      "type": "path",
      "url": "/path/to/package-1",
      "options": {"symlink": true}
    },
    {
      "type": "path",
      "url": "/path/to/package-2",
      "options": {"symlink": true}
    },
    {
      "type": "path",
      "url": "/path/to/package-3",
      "options": {"symlink": true}
    }
  ],
  "require": {
    "vendor/package-1": "*",
    "vendor/package-2": "*",
    "vendor/package-3": "*"
  }
}
```

## Example: Installing Tailwind Luna Theme Locally

### Step 1: Ensure Theme Repository Exists

```bash
# Check if theme is cloned
ls -la /home/oro/test/tailwind-luna-theme/composer.json

# Should show the theme's composer.json
```

### Step 2: Update Magento Project's composer.json

```bash
cd /home/oro/test/luma-repo/magento

# Edit composer.json to add local repository
cat >> composer.json << 'EOF'
{
  "repositories": [
    {
      "type": "path",
      "url": "/home/oro/test/tailwind-luna-theme",
      "options": {
        "symlink": true
      }
    }
  ]
}
EOF
```

Better approach - edit composer.json directly:

```bash
# Use jq to add repository (if jq installed)
jq '.repositories += [{"type": "path", "url": "/home/oro/test/tailwind-luna-theme", "options": {"symlink": true}}]' composer.json > composer.json.tmp
mv composer.json.tmp composer.json

# Or manually edit with editor
nano composer.json
```

### Step 3: Install the Theme

```bash
# Install via Composer
composer require "tailwind/luna-theme:*"

# Or if package name is different
composer require "your-vendor/tailwind-luna:*"
```

## Version Constraints with Local Paths

### Using Version Wildcards

```json
{
  "require": {
    "vendor/package": "*"
  }
}
```

Matches any version defined in the package's `composer.json`.

### Using Specific Versions

```json
{
  "require": {
    "vendor/package": "^1.0",
    "vendor/package": ">=1.0.0",
    "vendor/package": "1.x"
  }
}
```

Note: Version must match what's in the package's `composer.json`.

## Docker-Based Installation

### Using Docker Compose with Local Paths

```yaml
services:
  php:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - /path/to/my-package:/my-package
      - /path/to/project:/var/www/html
    working_dir: /var/www/html
```

### Running Composer in Container

```bash
# Install from local path repository
docker-compose exec php composer require vendor/package

# Or update
docker-compose exec php composer update vendor/package
```

## Common Use Cases

### Use Case 1: Custom Magento Module

**Directory Structure**:
```
/home/oro/custom-module/
├── composer.json
├── registration.php
├── etc/
│   └── module.xml
└── Code/
    └── ...
```

**composer.json**:
```json
{
  "name": "yourcompany/custom-module",
  "description": "Custom Magento Module",
  "type": "magento2-module",
  "version": "1.0.0"
}
```

**In Magento's composer.json**:
```json
{
  "repositories": [
    {
      "type": "path",
      "url": "../custom-module"
    }
  ],
  "require": {
    "yourcompany/custom-module": "*"
  }
}
```

### Use Case 2: Theme Installation

**Directory Structure**:
```
/home/oro/custom-theme/
├── composer.json
├── etc/
│   └── view.xml
└── web/
    └── ...
```

**composer.json**:
```json
{
  "name": "yourcompany/custom-theme",
  "description": "Custom Magento Theme",
  "type": "magento2-theme",
  "version": "1.0.0"
}
```

**In Magento's composer.json**:
```json
{
  "repositories": [
    {
      "type": "path",
      "url": "../custom-theme"
    }
  ],
  "require": {
    "yourcompany/custom-theme": "*"
  }
}
```

### Use Case 3: Shared Library

**Directory Structure**:
```
/home/oro/shared-lib/
├── composer.json
├── src/
│   └── MyClass.php
└── tests/
    └── ...
```

**Installation in multiple projects**:
```json
{
  "repositories": [
    {
      "type": "path",
      "url": "../../shared-lib"
    }
  ],
  "require": {
    "mycompany/shared-lib": "*"
  }
}
```

## Troubleshooting

### Issue: "Could not find package at path"

**Cause**: Incorrect path or missing composer.json

**Solution**:
```bash
# Verify path exists
ls -la /path/to/package/composer.json

# Check composer.json is valid
composer validate /path/to/package/
```

### Issue: "Package not found in any canal"

**Cause**: Repository not properly configured

**Solution**:
```bash
# Clear Composer cache
composer clearcache

# Re-run install with verbose
composer install -vvv
```

### Issue: "Symlink failed, using hard copy instead"

**Cause**: File system doesn't support symlinks (Windows without admin)

**Solution**:
```json
{
  "repositories": [
    {
      "type": "path",
      "url": "../my-package",
      "options": {
        "symlink": false
      }
    }
  ]
}
```

### Issue: Changes in local package not reflected

**Cause**: Hard-copy mode caches files

**Solution**:
```bash
# Remove vendor directory
rm -rf vendor/

# Reinstall
composer install

# Or use dump-autoload
composer dump-autoload
```

## Best Practices

### 1. Use Relative Paths for Portability

```json
{
  "repositories": [
    {
      "type": "path",
      "url": "../my-package"
    }
  ]
}
```

Better than absolute paths for team collaboration.

### 2. Enable Symlinks for Development

```json
{
  "repositories": [
    {
      "type": "path",
      "url": "../my-package",
      "options": {
        "symlink": true
      }
    }
  ]
}
```

Allows immediate reflection of changes in development.

### 3. Disable Symlinks for Production

```json
{
  "repositories": [
    {
      "type": "path",
      "url": "/path/to/package",
      "options": {
        "symlink": false
      }
    }
  ]
}
```

More stable and isolated in production.

### 4. Document Local Dependencies

```bash
# In project README
echo "Local dependencies:
- ../my-package (Development mode with symlinks)
- ../another-package (Copy mode)
"
```

### 5. Use composer.lock

```bash
# Commit lock file to version control
git add composer.lock
git commit -m "Lock composition of local dependencies"
```

Ensures team uses same versions.

## Advanced Usage

### Conditional Repository Configuration

```json
{
  "repositories": [
    {
      "type": "path",
      "url": "../my-package",
      "options": {
        "symlink": true
      }
    },
    {
      "type": "composer",
      "url": "https://repo.packagist.org"
    }
  ]
}
```

Uses local path first, falls back to Packagist.

### Environment-Specific Repositories

**composer-dev.json**:
```json
{
  "repositories": [
    {"type": "path", "url": "../my-package"}
  ]
}
```

**composer-prod.json**:
```json
{
  "repositories": [
    {"type": "composer", "url": "https://repo.packagist.org"}
  ]
}
```

```bash
# Development
composer install -f composer-dev.json

# Production
composer install -f composer-prod.json
```

## Workflow for Team Development

### Setup for Team

**1. Clone Main Project**:
```bash
git clone https://github.com/team/main-project.git
cd main-project
```

**2. Clone Dependencies**:
```bash
cd ..
git clone https://github.com/team/my-package.git
```

**3. Configure Local Paths**:
```bash
cd main-project
# Edit composer.json to add local path repository
```

**4. Install**:
```bash
composer install
```

### Synchronizing Changes

```bash
# Developer 1: Make changes
cd ../my-package
git add .
git commit -m "Update package"
git push origin main

# Developer 2: Pull changes
cd ../my-package
git pull origin main

# Reinstall if needed
cd ../main-project
composer update my-package
```

## Publishing to Packagist (Later)

Once development is complete, publish package:

```bash
# Register on Packagist
# https://packagist.org/packages/submit

# Remove local repository from composer.json
# composer.json - remove repositories section

# Install from Packagist
composer require vendor/my-package
```

## CLI Commands Reference

### Install Local Package

```bash
# Install all
composer install

# Install specific package
composer require vendor/package

# Update package
composer update vendor/package
```

### Validate Setup

```bash
# Validate main project
composer validate

# Validate package
composer validate /path/to/package
```

### View Installed Packages

```bash
# Show all packages
composer show

# Show specific package
composer show vendor/package

# Show dependency tree
composer show -t
```

### Clear Cache

```bash
# Clear Composer cache
composer clearcache

# Remove vendor and reinstall
rm -rf vendor composer.lock
composer install
```

## Security Considerations

### 1. File System Permissions

```bash
# Ensure package directory readable by web server
chmod 755 /path/to/my-package
chmod 644 /path/to/my-package/*
```

### 2. Sensitive Data

Don't commit credentials in local packages:

```bash
# Use environment files
cp .env.example .env
# Add .env to .gitignore
```

### 3. Version Control

```bash
# Always commit composer.lock
git add composer.lock

# Never commit vendor/ in package
echo "vendor/" >> .gitignore
```

## Testing Local Installation

### Quick Test

```bash
# In main project
cd /var/www/html

# List installed packages
vendor/bin/composer show vendor/my-package

# Check if autoloader works
php -r "require 'vendor/autoload.php'; var_dump(class_exists('YourVendor\MyPackage\ClassName'));"
```

### Automated Testing

```bash
# Run package tests
composer test

# Or specific test suite
vendor/bin/phpunit tests/
```

---

## Tailwind Luna Theme - Path Repository Setup

### For Local Development

When developing the Tailwind Luna theme locally without publishing to Packagist, use path repositories in your Magento installation:

#### Update Magento's `composer.json`

```json
{
    "repositories": {
        "genaker-theme": {
            "type": "path",
            "url": "/var/www/tailwind-luna-theme",
            "options": {
                "symlink": false
            }
        }
    },
    "require": {
        "genaker/theme-frontend-tailwind-luna": "^1.0"
    }
}
```

> **Note:** The widget module (`Genaker_ThemeTailwindLuna`) is bundled inside the theme under `Module/ThemeModule/` and registered via the theme's autoloader. No separate `genaker/module-tailwind-luna-widgets` package or path repository is needed.

#### Install Packages

```bash
cd /var/www/html

# Install from local path (widget module is included inside the theme)
composer update genaker/theme-frontend-tailwind-luna
```

#### Docker Configuration

Mount the theme in `docker-compose.yml`:

```yaml
services:
  php:
    volumes:
      - ../../luma-repo/magento:/var/www/html
      - ../tailwind-luna-theme:/var/www/tailwind-luna-theme
```

Then install inside container:

```bash
docker-compose exec php composer update genaker/theme-frontend-tailwind-luna
```

#### Advantages

✅ Work on local theme changes
✅ Composer handles everything automatically
✅ No need to publish to Packagist
✅ Easy to test before publishing
✅ Full integration with Magento

#### Important Notes

- Remove `"version": "1.0.0"` from theme's `composer.json` before publishing to Packagist
- Use `"symlink": false` for Windows compatibility
- Use `"symlink": true` for faster development on Unix/Linux (optional)

### Switching Between Packagist and Path Repositories

**From Path to Packagist:**

```bash
# Remove path repositories from Magento's composer.json
composer require genaker/theme-frontend-tailwind-luna:^1.0

# Composer will now use Packagist instead of local path
```

**From Packagist to Path:**

```bash
# Add path repositories back to Magento's composer.json
# Then update to use local version
composer update genaker/theme-frontend-tailwind-luna
```

---

## Summary

| Scenario | Method | Reference |
|----------|--------|-----------|
| Local Development | Path Repository | [See above](#tailwind-luna-theme---path-repository-setup) |
| Publishing to Packagist | Remove `version` field | [Installation Guide](INSTALLATION_GUIDE.md) |
| Testing Before Publish | Path Repository | [See above](#tailwind-luna-theme---path-repository-setup) |
| Production Installation | Packagist | [Installation Guide](INSTALLATION_GUIDE.md) |

---

Next: [Composer Troubleshooting](troubleshooting.md) | Reference: [Installation Guide](INSTALLATION_GUIDE.md)
