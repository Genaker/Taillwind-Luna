# Magento 2.4.7 Composer Installation Guide

## Overview

This document outlines the complete Magento 2.4.7 installation process using Composer within the Docker environment.

## Prerequisites

✅ Docker containers running:
- PHP 8.3-FPM with all required extensions
- MariaDB 10.6
- Elasticsearch 7.17.0
- Nginx 1.25.8

✅ Magento repository credentials configured

## Installation Steps

### Step 1: Clean Installation Directory

If Magento is already installed and you need a fresh start:

```bash
cd /home/oro/test/luma-repo

# Clear the magento directory (keep git if needed)
docker-compose exec php sh -c 'find /var/www/html -maxdepth 1 ! -name ".git" ! -name "." -exec rm -rf {} + 2>/dev/null'

# Verify clean state
docker-compose exec php ls -la /var/www/html
```

**Output should show**:
```
total 8
drwxr-xr-x 1 root root 4096 Apr 22 06:00 .
drwxr-xr-x 1 root root 4096 Apr 22 06:00 ..
```

---

### Step 2: Create Magento Project with Composer

Run from PHP container:

```bash
docker-compose exec php composer create-project \
  --repository-url=https://repo.magento.com/ \
  magento/project-community-edition:2.4.7 \
  ./ \
  --no-interaction \
  --ignore-platform-reqs
```

**Parameters Explained**:
- `--repository-url=https://repo.magento.com/` - Uses official Magento repository
- `magento/project-community-edition:2.4.7` - Community Edition version 2.4.7
- `./` - Installation target (root of /var/www/html)
- `--no-interaction` - Non-interactive mode (don't prompt for input)
- `--ignore-platform-reqs` - Ignore platform requirements (PHP version, extensions, etc.)

**Installation Progress**:

```
Installing magento/project-community-edition (2.4.7-p0)
  - Downloading magento/project-community-edition (2.4.7-p0)
  - Installing magento/project-community-edition (2.4.7-p0): Extracting archive
```

**Time Required**: 5-15 minutes (depending on internet speed)

**Output Size**: ~1.5-2 GB (after extraction)

---

### Step 3: Verify Composer Installation

```bash
# Check vendor directory
docker-compose exec -T php ls -la vendor/ | head -20

# Verify key packages
docker-compose exec -T php ls vendor/ | grep magento | head -10

# Check composer.json was created
docker-compose exec -T php cat composer.json | head -30
```

**Expected Structure**:
```
vendor/
├── magento/
│   ├── framework/
│   ├── module-*/ (893 modules)
│   └── ...
├── symfony/
├── zendframework/
└── ... (200+ packages)
```

---

### Step 4: Run Magento Setup

After Composer installation, run the Magento setup:

```bash
docker-compose exec php bin/magento setup:install \
  --base-url=http://172.29.201.103:8888/ \
  --db-host=db \
  --db-name=magento \
  --db-user=magento \
  --db-password=magento123 \
  --admin-firstname=Admin \
  --admin-lastname=User \
  --admin-email=admin@example.com \
  --admin-user=admin \
  --admin-password=Admin@12345 \
  --language=en_US \
  --currency=USD \
  --timezone=America/Chicago \
  --use-rewrites=1 \
  --magento-mode=default \
  --elasticsearch-host=magento-elasticsearch \
  --elasticsearch-port=9200 \
  --cleanup-database
```

**Parameters Explained**:

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `--base-url` | http://172.29.201.103:8888/ | Storefront base URL (host IP) |
| `--db-host` | db | Database host (Docker DNS) |
| `--db-name` | magento | Database name |
| `--db-user` | magento | Database username |
| `--db-password` | magento123 | Database password |
| `--admin-firstname` | Admin | Admin first name |
| `--admin-lastname` | User | Admin last name |
| `--admin-email` | admin@example.com | Admin email |
| `--admin-user` | admin | Admin username |
| `--admin-password` | Admin@12345 | Admin password |
| `--language` | en_US | Store language |
| `--currency` | USD | Default currency |
| `--timezone` | America/Chicago | Server timezone |
| `--use-rewrites` | 1 | Enable URL rewrites |
| `--magento-mode` | default | Execution mode |
| `--elasticsearch-host` | magento-elasticsearch | Search engine host |
| `--elasticsearch-port` | 9200 | Search engine port |
| `--cleanup-database` | (flag) | Drop existing tables first |

**Installation Progress Output**:

```
Magento Database Setup
[Progress: 1 / 893]
...
[Progress: 893 / 893]
[SUCCESS]: Magento installation complete.
[SUCCESS]: Magento Admin URI: /admin_nsz0nw1
```

**Time Required**: 5-10 minutes

**Admin Panel URI**: `/admin_nsz0nw1` (random suffix for security)

---

### Step 5: Fix Directory Permissions

After installation, Magento requires specific permissions:

```bash
docker-compose exec -T php bash -c '
  chmod -R 777 /var/www/html/generated /var/www/html/var && \
  chmod 555 /var/www/html/app/etc
'
```

**Explanation**:
- `/var/www/html/generated` - Write-enabled (Magento generates class files)
- `/var/www/html/var` - Write-enabled (logs, cache, session files)
- `/var/www/html/app/etc` - Read-only (security best practice)

---

### Step 6: Deploy Static Content

For production-ready frontend:

```bash
docker-compose exec -T php bin/magento setup:static-content:deploy -f
```

**Parameters**:
- `-f` - Force deployment, overwrite existing files

**Output**:
```
frontend/Magento/blank/en_US             1943/1943           100%
frontend/Magento/luma/en_US              1959/1959           100%
adminhtml/Magento/backend/en_US          1991/1991           100%

Execution time: 22.397316932678
```

**Files Generated**:
- CSS compiled files
- JavaScript concatenated and minified
- Images optimized
- Fonts processed
- Located in: `/var/www/html/pub/static/`

---

### Step 7: Flush Cache

Clear all Magento caches:

```bash
docker-compose exec -T php bin/magento cache:flush
```

**Output**:
```
Flushed cache types:
config
layout
block_html
collections
reflection
db_ddl
compiled_config
eav
customer_notification
graphql_query_resolver_result
config_integration
config_integration_api
full_page
config_webservice
translate
```

---

## Verification

### Test Frontend Access

```bash
# From host
curl -I http://172.29.201.103:8888/

# Expected: HTTP/1.1 200 OK
```

### Test Admin Panel

```bash
curl -I http://172.29.201.103:8888/admin_nsz0nw1/

# Expected: HTTP/1.1 200 OK
```

### Verify Database

```bash
# Access database
docker-compose exec -T db mysql -umagento -pmagento123 magento

# Check installed tables
mysql> SHOW TABLES;

# Should show 200+ tables
mysql> exit
```

### Check Elasticsearch Connection

```bash
# From PHP container
docker-compose exec -T php curl http://magento-elasticsearch:9200

# Should return cluster info
```

---

## Composer Lock File

After successful installation, a `composer.lock` file is generated:

**Location**: `/home/oro/test/luma-repo/magento/composer.lock`

**Purpose**:
- Records exact versions of all dependencies
- Ensures reproducible installations
- Should be committed to version control

**Key Information**:
```bash
# Check locked packages
docker-compose exec -T php cat composer.lock | grep -A 2 '"name"' | head -30

# Get package count
docker-compose exec -T php grep -c '"name"' composer.lock
```

---

## Troubleshooting

### Issue: Memory Exhausted During Installation

**Error**: `Fatal error: Allowed memory size of 134217728 bytes exhausted`

**Solution**: Ensure php.ini has 2GB memory limit
```bash
docker-compose exec -T php php -i | grep memory_limit
# Should show: memory_limit => 2G => 2G
```

### Issue: Database Connection Error

**Error**: `SQLSTATE[HY000] [2002] Can't connect to server`

**Solution**: 
```bash
# Verify database is running
docker-compose ps

# Check connection from PHP
docker-compose exec -T php php -r "
    \$link = mysqli_connect('db', 'magento', 'magento123');
    if (\$link) echo 'Connection OK';
"
```

### Issue: Elasticsearch Connection Failed

**Error**: `Elasticsearch is not responding. Falling back to 'mysql' search engine`

**Solution**:
```bash
# Check Elasticsearch health
docker-compose logs elasticsearch

# Test connection
docker-compose exec -T php curl http://magento-elasticsearch:9200

# Restart if needed
docker-compose restart elasticsearch
```

### Issue: Missing Required Extensions

**Error**: `The PHP extension "gd" is missing`

**Solution**: Rebuild PHP container
```bash
docker-compose up -d --build php
```

---

## Clean Installation from Scratch

If you need to start over completely:

```bash
# Stop all containers
docker-compose down

# Remove volumes (WARNING: Deletes database!)
docker-compose down -v

# Clean local files
rm -rf magento/

# Create empty directory
mkdir magento

# Start fresh
docker-compose up -d

# Run installation steps 2-7 again
```

---

## Command Reference

### Installation Commands
```bash
# Full fresh installation
docker-compose exec php composer create-project \
  --repository-url=https://repo.magento.com/ \
  magento/project-community-edition:2.4.7 \
  ./ --no-interaction --ignore-platform-reqs

# Run Magento setup
docker-compose exec php bin/magento setup:install [options]

# Deploy static content
docker-compose exec -T php bin/magento setup:static-content:deploy -f

# Flush all caches
docker-compose exec -T php bin/magento cache:flush
```

### Verification Commands
```bash
# Check installation status
docker-compose exec -T php bin/magento setup:db:status

# List admin users
docker-compose exec -T php bin/magento admin:user:create

# Show Magento version
docker-compose exec -T php bin/magento --version

# Check module status
docker-compose exec -T php bin/magento module:status
```

### Database Commands
```bash
# Database dump
docker-compose exec -T db mysqldump -umagento -pmagento123 magento > backup.sql

# Database restore
docker-compose exec -T db mysql -umagento -pmagento123 magento < backup.sql

# Table count
docker-compose exec -T db mysql -umagento -pmagento123 magento -e "SHOW TABLES;" | wc -l
```

---

## Theme Installation via Composer

### Install Tailwind Luna Theme from Packagist

The Tailwind Luna theme is published on Packagist and can be installed into any Magento 2.4.7+ installation.

#### Installation Steps

```bash
# In your Magento installation directory
cd /var/www/html

# Install via composer (widget module is bundled inside the theme)
composer require genaker/theme-frontend-tailwind-luna
```

#### Latest Version

The latest version is **1.0.4** with all fixes applied. Composer will automatically install the latest stable version:

```bash
# Packagist URL
# https://packagist.org/packages/genaker/theme-frontend-tailwind-luna

# Install latest
composer update genaker/theme-frontend-tailwind-luna
```

#### Important: Version Configuration

The theme's `composer.json` should **NOT have a hardcoded `version` field** to allow Packagist to properly recognize git tags:

```json
// ✅ CORRECT - Packagist recognizes all tags
{
    "name": "genaker/theme-frontend-tailwind-luna",
    "type": "magento2-theme",
    ...
}

// ❌ WRONG - Causes tag version mismatches
{
    "version": "1.0.0",
    "name": "genaker/theme-frontend-tailwind-luna",
    ...
}
```

### Theme & Widget Module Registration

The widget module (`Genaker_ThemeTailwindLuna`) is **bundled inside the theme** under `Module/ThemeModule/`. There is no separate `genaker/module-tailwind-luna-widgets` package — Composer registers both the theme and the module via the theme's autoloader:

```json
{
    "autoload": {
        "files": [
            "registration.php",
            "Module/ThemeModule/registration.php"
        ],
        "psr-4": {
            "Genaker\\ThemeTailwindLuna\\": "Module/ThemeModule/"
        }
    }
}
```

**Theme Registration** (`registration.php`)
```php
ComponentRegistrar::register(
    ComponentRegistrar::THEME,
    'frontend/Genaker/tailwind_luna',
    __DIR__
);
```

**Widget Module Registration** (`Module/ThemeModule/registration.php`)
```php
ComponentRegistrar::register(
    ComponentRegistrar::MODULE,
    'Genaker_ThemeTailwindLuna',
    __DIR__
);
```

These are automatically loaded via Magento's component registration system.

### Docker Installation

With tailwind-luna-theme mounted in Docker:

```yaml
# docker-compose.yml
services:
  php:
    volumes:
      - ../../luma-repo/magento:/var/www/html
      - ../tailwind-luna-theme:/var/www/tailwind-luna-theme  # Add this
```

Then install inside container:

```bash
docker-compose exec php composer require genaker/theme-frontend-tailwind-luna
```

### Verification

After installation:

```bash
# Check vendor directory
ls -la vendor/genaker/

# Expected:
# drwxr-xr-x theme-frontend-tailwind-luna
# (no separate module-tailwind-luna-widgets — it is bundled inside the theme)

# Verify autoloader
composer dump-autoload

# Check module is registered
bin/magento module:status | grep Genaker
# Expected: Genaker_ThemeTailwindLuna
```

---

## Performance Tips

1. **Use SSD** for `/var/www/html` mount point
2. **Increase PHP Memory** to 4GB for faster setup
3. **Warm Elasticsearch** before running setup
4. **Cache Composer Packages** if reinstalling frequently
5. **Use Static Content Versioning** in production

---

## References

- Composer Documentation: https://getcomposer.org/doc/
- Magento 2 Installation Guide: https://devdocs.magento.com/guides/v2.4/install-gde/install-quick.html
- Magento 2 System Requirements: https://devdocs.magento.com/guides/v2.4/install-gde/system-requirements.html
- Elasticsearch Configuration: https://devdocs.magento.com/guides/v2.4/config-guide/elasticsearch/configure-magento.html
