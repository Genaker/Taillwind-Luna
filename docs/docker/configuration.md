# Docker Configuration Reference

Detailed reference for all Docker configuration files and services.

## Service Configuration

### PHP Service (FPM)

```yaml
php:
  build:
    context: .
    dockerfile: Dockerfile
  container_name: magento-php
  volumes:
    - ../../luma-repo/magento:/var/www/html
    - ./php.ini:/usr/local/etc/php/conf.d/99-custom.ini
  environment:
    - PHP_MEMORY_LIMIT=2G
    - PHP_UPLOAD_MAX_FILESIZE=128M
    - PHP_POST_MAX_SIZE=128M
  networks:
    - magento
  depends_on:
    - db
```

**Key Settings**:
- **Memory Limit**: 2GB (set in php.ini)
- **Execution Timeout**: 600 seconds
- **Upload Limit**: 128MB
- **Extensions**: 11 installed (bcmath, ctype, curl, dom, gd, hash, iconv, json, mbstring, pdo_mysql, xml)

### Nginx Service

```yaml
nginx:
  image: nginx:1.25-alpine
  container_name: magento-nginx
  ports:
    - "8888:80"
  volumes:
    - ../../luma-repo/magento:/var/www/html
    - ./nginx.conf:/etc/nginx/conf.d/default.conf
  depends_on:
    - php
  networks:
    - magento
```

**Key Settings**:
- **Port**: 8888 (external) → 80 (internal)
- **Configuration**: Official Magento nginx.conf
- **Caching**: Static files cached appropriately

### MariaDB Service

```yaml
db:
  image: mariadb:10.6
  container_name: magento-db
  environment:
    - MYSQL_ROOT_PASSWORD=root123
    - MYSQL_DATABASE=magento
    - MYSQL_USER=magento
    - MYSQL_PASSWORD=magento123
  volumes:
    - db_data:/var/lib/mysql
  networks:
    - magento
```

**Key Settings**:
- **Version**: 10.6 (stable)
- **Root User**: root / root123
- **App User**: magento / magento123
- **Database**: magento (auto-created)
- **Storage**: db_data volume (persistent)

### Elasticsearch Service

```yaml
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
  container_name: magento-elasticsearch
  environment:
    - discovery.type=single-node
    - xpack.security.enabled=false
    - ES_JAVA_OPTS=-Xms256m -Xmx256m
  volumes:
    - es_data:/usr/share/elasticsearch/data
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:9200"]
    interval: 10s
    timeout: 5s
    retries: 5
  networks:
    - magento
```

**Key Settings**:
- **Version**: 7.17.0
- **Mode**: Single-node cluster
- **Security**: Disabled (development only)
- **Memory**: 256MB heap (adjust for production)
- **Health Check**: Enabled

## Dockerfile Reference

Custom PHP 8.3-FPM image with Magento extensions:

```dockerfile
FROM php:8.3-fpm-alpine

# Install system packages
RUN apk add --no-cache \
    curl \
    wget \
    git \
    mysql-client \
    libxml2-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    icu-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install \
    bcmath \
    ctype \
    curl \
    dom \
    gd \
    hash \
    iconv \
    json \
    mbstring \
    pdo_mysql \
    xml \
    intl

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

EXPOSE 9000
CMD ["php-fpm"]
```

**Extensions Included**:
1. `bcmath` - Arbitrary precision math
2. `ctype` - Character type checking
3. `curl` - HTTP client
4. `dom` - XML/DOM manipulation
5. `gd` - Image processing
6. `hash` - Hashing functions
7. `iconv` - Character encoding
8. `json` - JSON processing
9. `mbstring` - Multi-byte string functions
10. `pdo_mysql` - MySQL database driver
11. `xml` - XML processing

## Volume Mounts

### Application Code

```yaml
volumes:
  - ../../luma-repo/magento:/var/www/html
```

Maps Magento application from host to container:
- **Host**: `/home/oro/test/luma-repo/magento/`
- **Container**: `/var/www/html/`
- **Type**: Bind mount (live editing)

### PHP Configuration

```yaml
volumes:
  - ./php.ini:/usr/local/etc/php/conf.d/99-custom.ini
```

Maps custom PHP settings:
- **File**: `docker-config/php.ini`
- **Container**: `/usr/local/etc/php/conf.d/99-custom.ini`
- **Load Order**: 99-custom (loaded last, overrides defaults)

### Nginx Configuration

```yaml
volumes:
  - ./nginx.conf:/etc/nginx/conf.d/default.conf
```

Maps Nginx configuration:
- **File**: `docker-config/nginx.conf`
- **Container**: `/etc/nginx/conf.d/default.conf`
- **Type**: Official Magento configuration

### Database Persistence

```yaml
volumes:
  db_data:
    driver: local
```

Persistent database storage:
- **Volume Name**: db_data
- **Driver**: Local filesystem
- **Persistence**: Survives container restart
- **Location**: Docker internal (/var/lib/docker/volumes/...)

### Elasticsearch Data

```yaml
volumes:
  es_data:
    driver: local
```

Persistent search index storage:
- **Volume Name**: es_data
- **Driver**: Local filesystem
- **Persistence**: Survives container restart

## Network Configuration

### Bridge Network

```yaml
networks:
  magento:
    driver: bridge
```

Internal network for service communication:
- **Name**: magento
- **Driver**: bridge (isolated from other containers)
- **DNS**: Built-in (container names resolve to IPs)

### Service Discovery

Services communicate via names:
```bash
# In PHP container:
curl http://nginx:80          # Access Nginx
mysql -h db -u magento        # Access database
curl http://elasticsearch:9200 # Access search engine
```

## Environment Variables

### Database

| Variable | Value | Purpose |
|----------|-------|---------|
| MYSQL_ROOT_PASSWORD | root123 | Root database user |
| MYSQL_DATABASE | magento | App database name |
| MYSQL_USER | magento | App database user |
| MYSQL_PASSWORD | magento123 | App database password |

### Elasticsearch

| Variable | Value | Purpose |
|----------|-------|---------|
| discovery.type | single-node | Single-node cluster |
| xpack.security.enabled | false | Disable authentication |
| ES_JAVA_OPTS | -Xms256m -Xmx256m | Java heap memory |

### PHP

```ini
; From php.ini

memory_limit = 2G              # PHP memory limit
upload_max_filesize = 128M     # Max file upload
post_max_size = 128M           # Max POST data
max_execution_time = 600       # Script timeout
max_input_time = 600           # Input timeout
```

## Service Health Checks

### Elasticsearch Health Check

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:9200"]
  interval: 10s
  timeout: 5s
  retries: 5
  start_period: 30s
```

Monitors Elasticsearch availability:
- **Test**: HTTP GET to port 9200
- **Interval**: Check every 10 seconds
- **Timeout**: Wait 5 seconds for response
- **Retries**: Mark unhealthy after 5 failures
- **Start Period**: Wait 30 seconds before first check

View health status:
```bash
./docker-compose ps
# Look for "healthy" or "unhealthy" in STATUS column
```

## Performance Tuning

### PHP Memory

Increase as needed:
```ini
memory_limit = 4G  # For larger installations
```

### Elasticsearch Heap

For production:
```yaml
environment:
  - ES_JAVA_OPTS=-Xms2g -Xmx2g
```

### Nginx Worker Processes

In nginx.conf:
```nginx
worker_processes auto;  # One per CPU core
worker_connections 10000;
```

### Database Connections

In docker-compose.yml:
```yaml
db:
  environment:
    - MYSQL_MAX_CONNECTIONS=1000
```

## Logs and Debugging

### View Service Logs

```bash
# All services
./docker-compose logs

# Specific service
./docker-compose logs php
./docker-compose logs nginx
./docker-compose logs db
./docker-compose logs elasticsearch

# Streaming logs
./docker-compose logs -f php

# Last 100 lines
./docker-compose logs --tail 100 php
```

### Inspect Container

```bash
# Enter container shell
./docker-compose exec php sh

# Run commands
./docker-compose exec php php -v
./docker-compose exec db mysql --version
./docker-compose exec elasticsearch curl http://localhost:9200
```

### Check File Permissions

```bash
# Inside PHP container
./docker-compose exec php ls -la /var/www/html/

# Set permissions if needed
./docker-compose exec php chmod -R 777 var/ generated/ pub/static/
```

## Rebuilding and Cleanup

### Rebuild Services

```bash
# Rebuild PHP image
./docker-compose build

# Force rebuild (no cache)
./docker-compose build --no-cache php
```

### Clean Up

```bash
# Remove stopped containers
docker container prune

# Remove unused volumes
docker volume prune

# Remove unused images
docker image prune

# Full reset (WARNING: deletes all data)
./docker-compose down -v
```

## Security Considerations

### Production Hardening

1. **Change default passwords**:
   - Database root: Change from root123
   - Database app user: Change from magento123

2. **Disable Elasticsearch authentication** (development only):
   - For production: `xpack.security.enabled=true`
   - Add username/password authentication

3. **Change Nginx port** from 8888 to 80 (for production)

4. **Add SSL/TLS** certificates for HTTPS

5. **Restrict network access** via firewall rules

### Secrets Management

For production, use:
- Docker Secrets (Swarm mode)
- Environment files (.env)
- CI/CD secret management (GitHub Actions Secrets)

---

## Troubleshooting

**Container won't start?**
- Check logs: `./docker-compose logs service-name`
- Verify image exists: `docker images | grep magento`

**Permission denied errors?**
- Run with sudo: `sudo ./docker-compose ...`
- Or add user to docker group: `sudo usermod -aG docker $USER`

**Port already in use?**
- Change port mapping in docker-compose.yml
- Or stop conflicting service: `lsof -i :8888`

---

Next: [Docker Compose Setup Guide](DOCKER_COMPOSE_SETUP.md)
