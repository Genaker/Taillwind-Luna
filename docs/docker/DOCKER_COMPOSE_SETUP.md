# Docker Compose Setup for Magento 2.4.7

## Overview
This document describes the Docker Compose configuration used to set up a complete Magento 2.4.7 environment with PHP 8.3-FPM, MariaDB, Nginx, and Elasticsearch.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│           Docker Compose Network (luma-repo_magento)    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │  PHP 8.3-FPM     │  │  MariaDB 10.6    │              │
│  │ (magento-php)    │  │  (magento-db)    │              │
│  │  - Port: 9000    │  │  - Port: 3306    │              │
│  │  - Vol: magento/ │  │  - Vol: db_data  │              │
│  │  - conf.d mount  │  │                  │              │
│  └─────────┬────────┘  └──────────────────┘              │
│            │                                              │
│  ┌─────────┴────────┐     ┌──────────────────┐           │
│  │  Nginx 1.25      │     │ Elasticsearch    │           │
│  │ (magento-nginx)  │     │ 7.17.0           │           │
│  │ - Port: 8888    │     │ (magento-es)     │           │
│  │ - conf mount   │     │ - Port: 9200     │           │
│  └──────────────────┘     │ - Vol: es_data   │           │
│                            │ - Health check   │           │
│                            └──────────────────┘           │
└─────────────────────────────────────────────────────────┘

External Access: 0.0.0.0:8888 → Nginx:80
```

## Services

### 1. MariaDB (magento-db)
**Image**: mariadb:10.6

**Purpose**: Relational database for Magento

**Configuration**:
```yaml
Environment:
  MYSQL_ROOT_PASSWORD: root123
  MYSQL_DATABASE: magento
  MYSQL_USER: magento
  MYSQL_PASSWORD: magento123
```

**Ports**: 127.0.0.1:3306:3306 (Internal only)

**Volumes**: db_data (Persistent database storage)

**Connection**:
- Host: db (from within Docker network)
- Host: 127.0.0.1 (from WSL/host)
- User: magento
- Password: magento123
- Database: magento

---

### 2. PHP 8.3-FPM (magento-php)
**Image**: Custom Docker image (debian-based)

**Purpose**: PHP application runtime for Magento

**Dockerfile Configuration**:
- Base: php:8.3-fpm-debian
- Extensions: pdo_mysql, mysqli, soap, xsl, gd, intl, bcmath, zip, curl, opcache, mbstring
- Memory Limit: 2GB (configured via `/usr/local/etc/php/conf.d/99-custom.ini`)

**Environment Variables**:
```yaml
PHP_MEMORY_LIMIT: 2G
```

**Volumes**:
- `./magento:/var/www/html` - Main application code
- `./php.ini:/usr/local/etc/php/conf.d/99-custom.ini` - Custom PHP configuration

**Dependencies**: db, elasticsearch

**Working Directory**: /var/www/html

**Key PHP Settings** (in php.ini):
```ini
memory_limit = 2G
max_execution_time = 600
upload_max_filesize = 256M
post_max_size = 256M
```

---

### 3. Elasticsearch (magento-elasticsearch)
**Image**: elasticsearch:7.17.0

**Purpose**: Search engine for Magento catalog

**Environment Variables**:
```yaml
discovery.type: single-node
xpack.security.enabled: false
ES_JAVA_OPTS: -Xms512m -Xmx512m
```

**Ports**: 
- 9200 (HTTP API)
- 9300 (Node communication)

**Volumes**: es_data (Persistent search index storage)

**Health Check**:
```yaml
Test: curl -s http://localhost:9200 >/dev/null || exit 1
Interval: 10s
Timeout: 5s
Retries: 5
```

---

### 4. Nginx (magento-nginx)
**Image**: nginx:alpine (1.25.8)

**Purpose**: Web server and reverse proxy

**Ports**: 0.0.0.0:8888:80

**Volumes**:
- `./magento:/var/www/html` - Application code (read-only mount)
- `./nginx.conf:/etc/nginx/conf.d/default.conf` - Nginx configuration (Magento standard)

**Dependencies**: php service

**Nginx Configuration**: Uses official Magento nginx.conf.sample with:
- FastCGI backend pointing to php:9000
- Proper rewrite rules for Magento
- Security controls (deny access to sensitive files)
- Static content caching with versioning
- Media file serving with proper headers
- Gzip compression

---

## Networking

**Network Name**: luma-repo_magento

**Type**: Bridge network

**DNS Resolution** (internal):
- db → MariaDB container
- php → PHP-FPM container
- elasticsearch → Elasticsearch container
- magento-nginx → Nginx container

**External Access**:
- Frontend: http://172.29.201.103:8888/
- Admin Panel: http://172.29.201.103:8888/admin_nsz0nw1/

---

## Volumes

### Named Volumes
1. **db_data** - MariaDB persistent storage
2. **es_data** - Elasticsearch persistent storage

### Bind Mounts
1. **./magento** → /var/www/html (Application code)
2. **./php.ini** → /usr/local/etc/php/conf.d/99-custom.ini (PHP config)
3. **./nginx.conf** → /etc/nginx/conf.d/default.conf (Nginx config)

---

## File Structure

```
luma-repo/
├── docker-compose.yml           # Main compose configuration
├── Dockerfile                   # Custom PHP image build
├── php.ini                      # PHP configuration overrides
├── nginx.conf                   # Magento nginx configuration
└── magento/
    ├── app/                     # Magento application code
    ├── bin/                     # Magento CLI
    ├── pub/                     # Public web root
    ├── var/                     # Var directory (logs, cache, session)
    ├── vendor/                  # Composer dependencies
    └── app/etc/env.php         # Magento environment configuration
```

---

## Starting the Stack

### First Time Setup
```bash
cd /home/oro/test/luma-repo

# Build and start services
docker-compose up -d

# Wait for services to be healthy
sleep 5

# Check status
docker-compose ps
```

### Subsequent Starts
```bash
docker-compose up -d
```

### Stopping Services
```bash
docker-compose down
```

### Restarting Services
```bash
docker-compose restart
```

---

## Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f php
docker-compose logs -f nginx
docker-compose logs -f db

# Last N lines
docker-compose logs --tail=50 php
```

### Execute Commands in Container
```bash
# PHP/Magento commands
docker-compose exec -T php bin/magento cache:flush
docker-compose exec -T php bin/magento setup:upgrade
docker-compose exec -T php bin/magento config:set web/unsecure/base_url http://127.0.0.1:8888/

# Database access
docker-compose exec -T db mysql -umagento -pmagento123 magento

# PHP info
docker-compose exec -T php php -i
docker-compose exec -T php php -i | grep memory_limit
```

### Stop Specific Service
```bash
docker-compose stop php
docker-compose stop nginx
```

### Rebuild Service
```bash
docker-compose up -d --build php
```

---

## Environment Configuration

### Database Connection (from PHP)
```
Host: db (internal Docker DNS)
Port: 3306
User: magento
Password: magento123
Database: magento
```

### Database Connection (from Host)
```
Host: 127.0.0.1
Port: 3306
User: magento
Password: magento123
Database: magento
```

### Search Engine Configuration
Configured in `magento/app/etc/env.php`:
```php
'searchengine' => [
    'elasticsearch7' => [
        'server' => 'localhost:9200',
        'index_prefix' => 'magento2_'
    ]
]
```

**Note**: From PHP container perspective, use `magento-elasticsearch:9200`

---

## Performance Tuning

### PHP Memory Limit
Currently set to **2GB** to handle:
- Composer installation
- bin/magento setup:install
- DI compilation
- Static content deployment

**File**: `/home/oro/test/luma-repo/php.ini`

### Elasticsearch Heap Size
Currently set to **512MB**:
```yaml
ES_JAVA_OPTS: -Xms512m -Xmx512m
```

Adjust based on your system resources.

### FastCGI Buffers (Nginx)
```
fastcgi_buffers 16 16k;
fastcgi_buffer_size 32k;
fastcgi_read_timeout 600s;
fastcgi_connect_timeout 600s;
```

---

## Troubleshooting

### Service Won't Start
```bash
# Check logs
docker-compose logs php
docker-compose logs nginx

# Restart all
docker-compose down
docker-compose up -d
```

### Permission Errors in Generated/Var
```bash
# Fix permissions
docker-compose exec -T php bash -c 'chmod -R 777 /var/www/html/generated /var/www/html/var'
```

### Memory Limit Issues
```bash
# Verify PHP memory limit
docker-compose exec -T php php -i | grep memory_limit

# Should show: memory_limit => 2G => 2G
```

### Nginx Configuration Error
```bash
# Test nginx config
docker-compose exec -T nginx nginx -t

# Reload nginx
docker-compose exec -T nginx nginx -s reload
```

### Elasticsearch Connection Failed
```bash
# Check Elasticsearch status
docker-compose logs elasticsearch

# Verify from PHP container
docker-compose exec -T php curl -s http://magento-elasticsearch:9200 | jq .
```

---

## Security Considerations

1. **Database Password**: Change `MYSQL_PASSWORD` in production
2. **Root Password**: Change `MYSQL_ROOT_PASSWORD` in production
3. **Network Access**: Database port only exposed to 127.0.0.1
4. **File Permissions**: Set to read-only where possible (app/etc)
5. **Nginx Security**: 
   - Denies access to .php files outside designated locations
   - Restricts access to setup/update/admin directories
   - Blocks access to hidden files

---

## Backup & Restore

### Database Backup
```bash
docker-compose exec -T db mysqldump -umagento -pmagento123 magento > backup.sql
```

### Database Restore
```bash
docker-compose exec -T db mysql -umagento -pmagento123 magento < backup.sql
```

### Full System Backup
```bash
# Backup database and volumes
docker-compose exec -T db mysqldump -umagento -pmagento123 magento > db_backup.sql
tar -czf magento_backup.tar.gz magento/ php.ini nginx.conf
```

---

## References

- Docker Compose Documentation: https://docs.docker.com/compose/
- PHP Official Image: https://hub.docker.com/_/php
- Nginx Official Image: https://hub.docker.com/_/nginx
- MariaDB Official Image: https://hub.docker.com/_/mariadb
- Elasticsearch Official Image: https://hub.docker.com/_/elasticsearch
- Magento 2 Official Guide: https://devdocs.magento.com/
