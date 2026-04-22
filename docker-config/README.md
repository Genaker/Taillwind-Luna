# Docker Configuration

This folder contains all Docker-related configuration files for the Magento 2.4.7 installation.

## Files

- **docker-compose.yml** - Docker Compose orchestration file
  - Defines all services (PHP, MariaDB, Elasticsearch, Nginx)
  - Manages networking and volumes
  - Sets environment variables

- **Dockerfile** - PHP 8.3-FPM custom image
  - Installs PHP extensions (11 total)
  - Compiles PHP with optimizations
  - Installs Composer for dependency management

- **php.ini** - PHP runtime configuration
  - Sets memory_limit = 2GB
  - Sets max_execution_time = 600 seconds
  - Configures file upload limits

- **nginx.conf** - Magento official Nginx configuration
  - Proper FastCGI setup pointing to PHP
  - Static content caching with versioning
  - Security rules and URL rewrites
  - Gzip compression

## Usage

From the project root (`/home/oro/test/luma-repo/`):

```bash
# Start services
./docker-compose up -d

# Status
./docker-compose ps

# Logs
./docker-compose logs -f php

# Stop services
./docker-compose down
```

Or directly from this folder:

```bash
cd docker-config
docker-compose up -d
```

## Volume Mappings

The docker-compose.yml mounts volumes from the parent directory:

- `../magento:/var/www/html` - Magento application code
- `./php.ini:/usr/local/etc/php/conf.d/99-custom.ini` - PHP configuration
- `./nginx.conf:/etc/nginx/conf.d/default.conf` - Nginx configuration
- Named volumes for database and search engine persistence

## Network

All services communicate on a Docker bridge network named `docker-config_magento`.

Access from:
- **Host (Windows/WSL)**: http://172.29.201.103:8888/
- **Container internal**: Use service names (php, db, elasticsearch, nginx)

## Performance

- PHP Memory: 2GB (suitable for Magento installation and operations)
- Elasticsearch Heap: 512MB (search index storage)
- Nginx Buffers: Optimized for FastCGI communication

## Build

To rebuild the PHP image:

```bash
docker-compose up -d --build php
```

This will recompile the PHP image with all dependencies.

## Troubleshooting

### Services won't start
```bash
docker-compose logs php
docker-compose logs nginx
```

### Database connection issues
```bash
docker-compose exec -T db mysql -umagento -pmagento123 magento
```

### Need to clear everything
```bash
docker-compose down -v
docker-compose up -d
```

## Documentation

For complete Docker setup documentation, see:
`/home/oro/test/tailwind-luna-theme/docs/docker/DOCKER_COMPOSE_SETUP.md`

## Organization

This folder keeps Docker-related files organized and separate from the application code, making it:
- Easier to locate configuration
- Cleaner project structure
- Simpler to maintain and update
- Ready for deployment to different environments
