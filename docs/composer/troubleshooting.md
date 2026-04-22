# Composer Troubleshooting

Common issues and solutions for Composer and Magento installation.

## Installation Issues

### Issue: "Composer could not find a matching version"

**Cause**: Version constraint too restrictive or package not available

**Solution**:
```bash
# Remove version constraint
composer require package-name

# Or use --ignore-platform-reqs flag
composer install --ignore-platform-reqs

# Update lock file
composer update --no-interaction
```

### Issue: "Class not found after composer install"

**Cause**: Autoloader not regenerated

**Solution**:
```bash
# Regenerate Composer autoloader
./docker-compose exec php composer dump-autoload

# Or with optimization
./docker-compose exec php composer dump-autoload -o
```

### Issue: "Cannot create cache directory"

**Cause**: Permission issues with var/ directory

**Solution**:
```bash
# Set permissions in container
./docker-compose exec php chmod -R 777 var/ generated/ pub/

# Or as host user
chmod -R 777 /home/oro/test/luma-repo/magento/var/
chmod -R 777 /home/oro/test/luma-repo/magento/generated/
```

## Memory Issues

### Issue: "Fatal error: Allowed memory size exhausted"

**Cause**: PHP memory limit too low

**Solution**:

1. **Check current limit**:
   ```bash
   ./docker-compose exec php php -i | grep memory_limit
   ```

2. **Increase memory limit** in `docker-config/php.ini`:
   ```ini
   memory_limit = 4G  # Increase from 2G
   ```

3. **Restart PHP container**:
   ```bash
   ./docker-compose restart php
   ```

4. **Re-run composer**:
   ```bash
   ./docker-compose exec php composer install -vvv
   ```

### Issue: "Process timed out after 300 seconds"

**Cause**: Composer taking too long (common with large installations)

**Solution**:
```bash
# Increase timeout
./docker-compose exec php \
  php -d default_socket_timeout=600 \
  /usr/local/bin/composer install

# Or set in container
./docker-compose exec php \
  composer config process-timeout 600
```

## Network Issues

### Issue: "The requested package could not be found in any canal"

**Cause**: Incorrect repository URL or authentication issue

**Solution**:
```bash
# Clear cache
./docker-compose exec php composer clearcache

# Check repo access
./docker-compose exec php composer diagnose

# Add Magento repo explicitly
./docker-compose exec php \
  composer config repositories.magento composer https://repo.magento.com/
```

### Issue: "Connection refused" or "Cannot fetch repo.magento.com"

**Cause**: Network connectivity issue

**Solution**:
```bash
# Test connectivity from PHP container
./docker-compose exec php curl -v https://repo.magento.com/

# Check DNS resolution
./docker-compose exec php nslookup repo.magento.com

# Restart network-related services
./docker-compose down
./docker-compose up -d
```

## Platform Requirements

### Issue: "The requested PHP extension ext-gd is missing"

**Cause**: Required PHP extension not installed

**Solution**:

1. **Rebuild Docker image** with extension:
   ```bash
   # Edit docker-config/Dockerfile
   # Ensure gd is in docker-php-ext-install list
   
   # Rebuild
   ./docker-compose build --no-cache php
   
   # Restart
   ./docker-compose restart php
   ```

2. **Or skip platform checking**:
   ```bash
   ./docker-compose exec php \
     composer install --ignore-platform-reqs
   ```

### Issue: "The requested PHP version (x.y.z) is invalid or too old"

**Cause**: PHP version mismatch

**Solution**:
```bash
# Check Docker PHP version
./docker-compose exec php php -v

# If too old, rebuild Dockerfile with newer version:
# Change FROM php:8.3-fpm-alpine to FROM php:8.4-fpm-alpine
./docker-compose build --no-cache php
./docker-compose restart php
```

## Package Conflicts

### Issue: "Your requirements could not be resolved to an installable set of packages"

**Cause**: Package dependency conflict

**Solution**:
```bash
# Check for conflicts
./docker-compose exec php composer diagnose

# Try with relaxed constraints
./docker-compose exec php \
  composer update --no-interaction --with-dependencies

# Or specific version
./docker-compose exec php \
  composer require package-name:^2.0 --update-with-dependencies
```

### Issue: "Conflicting dependency versions"

**Cause**: Multiple packages requesting different versions

**Solution**:
```bash
# Show all dependencies and their constraints
./docker-compose exec php composer show -D

# If critical, edit composer.json manually:
vim /home/oro/test/luma-repo/magento/composer.json

# Then update
./docker-compose exec php composer update
```

## Optimization

### Issue: "Installation is slow"

**Solution**:

```bash
# Use parallel downloads
./docker-compose exec php \
  composer config --global github-domains {} \
  && composer update

# Or skip version checks
./docker-compose exec php \
  composer update --no-scripts --optimize-autoloader

# Load from lock file if available
./docker-compose exec php \
  composer install --no-interaction --optimize-autoloader
```

### Issue: "Autoloader takes too long"

**Solution**:
```bash
# Generate optimized autoloader
./docker-compose exec php \
  composer dump-autoload --optimize --classmap-authoritative

# Or during installation
./docker-compose exec php \
  composer install --optimize-autoloader --classmap-authoritative
```

## Authentication Issues

### Issue: "401 Unauthorized" retrieving file from repo.magento.com

**Cause**: Missing or invalid Magento repository credentials

**Solution**:

1. **Get credentials** from https://account.magento.com/ (for Commerce) or use public repo (for Community)

2. **Configure credentials**:
   ```bash
   ./docker-compose exec php \
     composer config http-basic.repo.magento.com <username> <password>
   ```

3. **Or in auth.json**:
   ```bash
   echo '{
     "http-basic": {
       "repo.magento.com": {
         "username": "your-username",
         "password": "your-password"
       }
     }
   }' > /home/oro/test/luma-repo/magento/auth.json
   ```

4. **Re-run installer**:
   ```bash
   ./docker-compose exec php composer install
   ```

## Database Issues

### Issue: "SQLSTATE[HY000] [2002] Can't connect to local MySQL server"

**Cause**: MariaDB container not running or unreachable

**Solution**:
```bash
# Check database container
./docker-compose ps | grep db

# If not running, restart
./docker-compose restart db

# Test connection
./docker-compose exec php \
  mysql -h db -u magento -pmagento123 -e "SELECT 1"

# Wait for database to be ready
sleep 10 && ./docker-compose exec php composer install
```

## Static Content Issues

### Issue: "Cannot write to /pub/static directory"

**Cause**: Permission issue or directory full

**Solution**:
```bash
# Set permissions
./docker-compose exec php chmod -R 777 pub/static/

# Clear cache
./docker-compose exec php rm -rf pub/static/*

# Re-deploy static content
./docker-compose exec php \
  php bin/magento setup:static-content:deploy -f
```

## Debugging Commands

### Enable Verbose Output

```bash
# Most verbose (all messages)
./docker-compose exec php composer install -vvv

# Verbose output
./docker-compose exec php composer install -v
```

### Run Diagnostics

```bash
# Show composer configuration
./docker-compose exec php composer diagnose

# Show installed packages
./docker-compose exec php composer show

# Show dependencies tree
./docker-compose exec php composer show --tree package-name
```

### View Lock File

```bash
# Show what's locked
./docker-compose exec php cat composer.lock | head -100

# Find specific package in lock
./docker-compose exec php grep -A 10 '"name": "magento/framework"' composer.lock
```

### Clear Caches

```bash
# Composer cache
./docker-compose exec php composer clearcache

# Magento cache
./docker-compose exec php php bin/magento cache:clean

# All caches
./docker-compose exec php php bin/magento cache:clean all
```

## Getting Help

### Log File Analysis

```bash
# View PHP error logs
./docker-compose logs php | tail -100

# View Magento log
./docker-compose exec php cat var/log/system.log | tail -50

# View debug log
./docker-compose exec php cat var/log/debug.log | tail -50
```

### Ask for Help

When reporting issues, provide:
```bash
# System info
./docker-compose exec php php -version
./docker-compose exec php composer -V

# Error log excerpt
./docker-compose exec php tail -20 var/log/system.log

# Composer diagnostics
./docker-compose exec php composer diagnose

# Lock file hash
./docker-compose exec php sha256sum composer.lock
```

---

**Still stuck?** Check:
- [Installation Guide](INSTALLATION_GUIDE.md)
- [Docker Configuration](../docker/configuration.md)
- [Magento Documentation](https://devdocs.magento.com)
