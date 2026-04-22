# Installation Guide

Complete step-by-step guide for setting up Tailwind Luna Theme with Magento 2.4.7.

## System Requirements

| Component | Requirement |
|-----------|-------------|
| OS | Linux, macOS, or Windows (with WSL2) |
| Docker | 20.10+ |
| Docker Compose | 1.29+ |
| Git | 2.30+ |
| Free Disk Space | 10 GB minimum |
| RAM | 4 GB minimum (8 GB recommended) |

## Installation Steps

### Step 1: Clone Repository

```bash
# Navigate to workspace directory
cd /home/oro/test

# Clone the theme repository
git clone <your-repo-url> tailwind-luna-theme
cd tailwind-luna-theme
```

### Step 2: Start Docker Services

```bash
# Start all services in background
./docker-compose up -d

# Monitor startup (watch for "healthy" status)
./docker-compose ps

# Expected output:
# NAME                 COMMAND              STATUS              PORTS
# magento-php          docker-php-entryp... Up                  9000/tcp
# magento-nginx        nginx -g daemon off  Up                  0.0.0.0:8888->80/tcp
# magento-db           docker-entrypoint... Up                  3306/tcp
# magento-elasticsearch ...                  Up (healthy)        9200/tcp, 9300/tcp
```

### Step 3: Install Magento (First Time Only)

```bash
# Enter PHP container
./docker-compose exec php sh

# Inside container, run Composer install:
composer create-project \
  --repository-url=https://repo.magento.com/ \
  magento/project-community-edition:2.4.7 \
  ./ \
  --no-interaction \
  --ignore-platform-reqs

# Exit container
exit
```

### Step 4: Configure Magento

```bash
# Set base URL (adjust IP as needed)
./docker-compose exec php \
  php bin/magento config:set web/unsecure/base_url http://172.29.201.103:8888/

# Set admin URL (replace with your admin path)
./docker-compose exec php \
  php bin/magento config:set admin/url/custom http://172.29.201.103:8888/admin_nsz0nw1/

# Deploy static content
./docker-compose exec php \
  php bin/magento setup:static-content:deploy -f

# Reindex data
./docker-compose exec php \
  php bin/magento indexer:reindex

# Clear cache
./docker-compose exec php \
  php bin/magento cache:clean
```

### Step 5: Verify Installation

```bash
# Test frontend (HTTP 200 = success)
curl -I http://172.29.201.103:8888/

# Test admin panel (HTTP 200 = success)
curl -I http://172.29.201.103:8888/admin_nsz0nw1/

# Check database
./docker-compose exec db \
  mysql -h localhost -u magento -pmagento123 magento -e "SELECT COUNT(*) as table_count FROM information_schema.TABLES WHERE TABLE_SCHEMA='magento';"

# Verify Elasticsearch connection
./docker-compose exec php \
  php bin/magento search:index:list
```

## Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://172.29.201.103:8888/ | Public |
| Admin Panel | http://172.29.201.103:8888/admin_nsz0nw1/ | admin / Admin@12345 |
| MySQL | localhost:3306 | magento / magento123 |
| Elasticsearch | localhost:9200 | None (internal) |

## Working with the Installation

### Command Reference

```bash
# Docker commands (run from theme root)
./docker-compose up -d          # Start services
./docker-compose down           # Stop services
./docker-compose ps             # Show running services
./docker-compose logs -f php    # Stream PHP logs
./docker-compose exec php sh    # Enter PHP container

# Magento commands (with docker-compose)
./docker-compose exec php php bin/magento cache:clean
./docker-compose exec php php bin/magento indexer:reindex
./docker-compose exec php php bin/magento setup:static-content:deploy -f

# Composer commands
./docker-compose exec php composer install
./docker-compose exec php composer require vendor/package
./docker-compose exec php composer update
```

### Theme Development

1. **Theme Location**: `/home/oro/test/luma-repo/magento/app/design/frontend/Magento/luma/`
2. **App Code**: `/home/oro/test/luma-repo/magento/app/code/`
3. **Static Files**: `/home/oro/test/luma-repo/magento/pub/static/`

### Editing Files

```bash
# Edit theme files locally
vim /home/oro/test/luma-repo/magento/app/design/frontend/Magento/luma/...

# After changes, deploy static content
./docker-compose exec php \
  php bin/magento setup:static-content:deploy -f

# Clear cache
./docker-compose exec php php bin/magento cache:clean
```

## Environment Details

### Docker Services

| Service | Image | Type | Port |
|---------|-------|------|------|
| PHP | Custom PHP 8.3 | Container | 9000 |
| Nginx | nginx:1.25-alpine | Container | 8888 |
| MariaDB | mariadb:10.6 | Container | 3306 |
| Elasticsearch | docker.elastic.co/elasticsearch/elasticsearch:7.17.0 | Container | 9200 |

### PHP Extensions

The PHP container includes 11 extensions:
- bcmath, ctype, curl, dom, gd, hash, iconv, json, mbstring, pdo_mysql, xml

### Configuration Files

```
/home/oro/test/tailwind-luna-theme/docker-config/
├── docker-compose.yml  # Service orchestration
├── Dockerfile          # PHP 8.3 image definition
├── php.ini            # PHP settings (2GB memory limit)
├── nginx.conf         # Nginx configuration
└── README.md          # Docker documentation
```

## Troubleshooting

### Docker Services Won't Start

```bash
# Check Docker daemon
docker ps

# View service logs
./docker-compose logs

# Restart all services
./docker-compose down && ./docker-compose up -d
```

### Frontend Not Loading

1. **Check Nginx**: `./docker-compose logs nginx`
2. **Verify URL**: http://172.29.201.103:8888/ (adjust IP as needed)
3. **Check PHP**: `./docker-compose logs php`
4. **Test connection**: `curl -v http://172.29.201.103:8888/`

### Database Connection Issues

```bash
# Test database
./docker-compose exec db mysql -u magento -pmagento123 -e "SELECT 1"

# Check database logs
./docker-compose logs db

# Restart database
./docker-compose restart db
```

### Composer/Install Failures

```bash
# Check PHP logs
./docker-compose logs php

# Verify PHP container running
./docker-compose ps | grep php

# Check disk space
docker exec magento-php df -h

# Re-run composer with verbose output
./docker-compose exec php composer install -vvv
```

## Next Steps

1. Review [Docker Documentation](../docker/DOCKER_COMPOSE_SETUP.md) for detailed setup
2. Check [Project Status](../PROJECT_STATUS.md) for current system overview
3. Explore [Theme Architecture](../TAILWIND_EXTENSION_DEVELOPMENT.md) for customization
4. Review [GitHub Actions Guide](../github-actions/workflows.md) for CI/CD setup

---

**Stuck?** See [Quick Start](quick-start.md) for rapid overview or reference [Project Status](../PROJECT_STATUS.md).
