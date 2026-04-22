# Quick Start Guide

Get your Tailwind Luna development environment running in 5 minutes.

## Prerequisites

- Docker & Docker Compose installed
- Git installed
- Linux/WSL2 environment

## Installation & Launch

### 1. Clone the Repository

```bash
git clone <your-repo-url> tailwind-luna-theme
cd tailwind-luna-theme
```

### 2. Start Docker Services

```bash
# Start all services (PHP, Nginx, MariaDB, Elasticsearch)
./docker-compose up -d

# Verify services are running
./docker-compose ps
```

### 3. Access Your Installation

- **Frontend**: http://172.29.201.103:8888/
- **Admin Panel**: http://172.29.201.103:8888/admin_nsz0nw1/
- **Admin Credentials**: `admin` / `Admin@12345`

### 4. Verify Installation

```bash
# Check container logs
./docker-compose logs php

# Test database connection
./docker-compose exec db mysql -h localhost -u magento -p magento123 -e "SELECT VERSION();"
```

## Common Commands

### Docker Management

```bash
# Start services
./docker-compose up -d

# Stop services
./docker-compose down

# View logs
./docker-compose logs -f php

# Execute command in PHP container
./docker-compose exec php php bin/magento cache:clean
```

### Magento Commands

```bash
# Access PHP container
./docker-compose exec php sh

# Inside container:
php bin/magento cache:clean
php bin/magento indexer:reindex
php bin/magento config:set web/unsecure/base_url http://172.29.201.103:8888/
```

## Development Workflow

1. **Theme Files**: Edit in `../../luma-repo/magento/app/design/frontend/`
2. **Static Content**: Run `php bin/magento setup:static-content:deploy` after changes
3. **Cache**: Clear with `php bin/magento cache:clean`
4. **Logs**: Monitor with `./docker-compose logs -f php`

## Troubleshooting

!!! warning "Services not starting?"
    - Check Docker is running: `docker ps`
    - Review logs: `./docker-compose logs`
    - Verify ports available: `netstat -tuln | grep 8888`

!!! warning "Can't access frontend?"
    - Verify Nginx is running: `./docker-compose ps | grep nginx`
    - Check base URL: `http://172.29.201.103:8888/`
    - Clear browser cache and cookies

!!! warning "Database connection error?"
    - Verify database container: `./docker-compose logs db`
    - Check credentials in `docker-config/docker-compose.yml`
    - Restart database: `./docker-compose restart db`

## Next Steps

- Review [Full Installation Guide](installation.md) for detailed setup
- Check [Docker Documentation](../docker/DOCKER_COMPOSE_SETUP.md) for architecture
- Explore [Theme Development](../TAILWIND_EXTENSION_DEVELOPMENT.md)

---

**Need help?** Check [Project Status](../PROJECT_STATUS.md) for system overview or reference [Troubleshooting Guide](installation.md#troubleshooting).
