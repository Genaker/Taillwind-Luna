# Magento 2.4.7 Project Documentation

## Overview

This directory contains complete documentation for the Magento 2.4.7 setup with Docker Compose, including Composer installation steps, configuration details, and theme integration guides.

## Project Structure

```
/home/oro/
├── test/                          # Main project directory
│   ├── luma-repo/                # Magento 2.4.7 installation (Docker)
│   │   ├── docker-compose.yml    # Docker service configuration
│   │   ├── Dockerfile            # PHP 8.3-FPM custom image
│   │   ├── php.ini               # PHP configuration overrides (2GB memory)
│   │   ├── nginx.conf            # Magento official nginx config
│   │   └── magento/              # Magento application root
│   │
│   └── docs/                     # Documentation (THIS DIRECTORY)
│       ├── docker/               # Docker Compose documentation
│       ├── composer/             # Installation & Composer guides
│       ├── magento/              # Magento-specific docs
│       └── themes/               # Theme integration guides
│
└── tailwind-luna/                # Tailwind-Luna custom theme (separate repo)
    ├── README.md                 # Theme documentation
    ├── warden/                   # Warden configuration files
    ├── src/                      # Theme source code
    └── ...
```

---

## Quick Start

### 1. Start Docker Services

```bash
cd /home/oro/test/luma-repo
docker-compose up -d
```

### 2. Access Magento

**Frontend**: http://172.29.201.103:8888/
**Admin Panel**: http://172.29.201.103:8888/admin_nsz0nw1/

**Credentials**:
- Username: `admin`
- Password: `Admin@12345`

### 3. Run Magento Commands

```bash
# Clear cache
docker-compose exec -T php bin/magento cache:flush

# Check status
docker-compose exec -T php bin/magento setup:db:status

# Enable a module
docker-compose exec -T php bin/magento module:enable Module_Name
```

---

## Documentation Map

### 📘 Docker Compose Setup
**Location**: `docs/docker/DOCKER_COMPOSE_SETUP.md`

**Contents**:
- ✓ Full Docker stack architecture
- ✓ Service configurations (PHP, MySQL, Elasticsearch, Nginx)
- ✓ Network and volume setup
- ✓ Startup/shutdown procedures
- ✓ Troubleshooting guide
- ✓ Performance tuning

**Best For**: Understanding the infrastructure and debugging container issues

---

### 📗 Composer Installation Guide
**Location**: `docs/composer/INSTALLATION_GUIDE.md`

**Contents**:
- ✓ Step-by-step Magento installation
- ✓ Composer command reference
- ✓ Setup and configuration process
- ✓ Static content deployment
- ✓ Permission setup
- ✓ Verification procedures
- ✓ Troubleshooting common issues

**Best For**: Installing or reinstalling Magento from scratch

---

### 📙 Magento Configuration
**Location**: `docs/magento/`

**Contents** (to be added):
- Configuration structure
- Admin panel setup
- Store settings
- Payment & shipping methods
- Security configuration

---

### 📕 Themes Documentation
**Location**: `docs/themes/`

**Contents** (to be added):
- Theme structure and layout
- Tailwind-Luna integration
- Custom CSS/JS
- Asset deployment

---

## Service Information

### Environment Configuration

**Database**:
```
Host: db (from container) / 127.0.0.1 (from host)
Port: 3306
Database: magento
User: magento
Password: magento123
```

**PHP**:
```
Memory Limit: 2GB
Max Execution Time: 600s
FPM Port: 9000
Socket: /var/run/php-fpm.sock
```

**Elasticsearch**:
```
Host: magento-elasticsearch (from container)
Port: 9200
Index Prefix: magento2_
Java Heap: 512MB
```

**Nginx**:
```
Port: 8888 (external: 0.0.0.0:8888)
Document Root: /var/www/html/pub
Config: Official Magento nginx.conf.sample
```

---

## Key Files & Configurations

### Docker Compose
- **File**: `/home/oro/test/luma-repo/docker-compose.yml`
- **Purpose**: Defines all services, volumes, networks
- **Edit When**: Changing service versions, ports, or environment variables

### PHP Configuration
- **File**: `/home/oro/test/luma-repo/php.ini`
- **Purpose**: PHP runtime settings
- **Key Settings**: 
  - memory_limit = 2G
  - max_execution_time = 600

### Nginx Configuration
- **File**: `/home/oro/test/luma-repo/nginx.conf`
- **Purpose**: Web server configuration (official Magento setup)
- **Features**: FastCGI, static caching, security rules, compression

### Magento Configuration
- **File**: `/home/oro/test/luma-repo/magento/app/etc/env.php`
- **Purpose**: Magento system configuration
- **Includes**: Database, cache, search engine, admin credentials

---

## Installation History

### Initial Setup (Current Session)
- ✅ Created Docker Compose stack with PHP 8.3, MariaDB 10.6, Elasticsearch 7.17
- ✅ Installed Magento 2.4.7 Community Edition via Composer
- ✅ Configured PHP with 2GB memory for installation
- ✅ Applied official Magento Nginx configuration
- ✅ Deployed static content (3951 files)
- ✅ Created admin user: admin / Admin@12345
- ✅ Fixed directory permissions for code generation

### System Status
```
Service Status: ✅ All running
Frontend: ✅ HTTP 200 OK (~2.5s response)
Admin Panel: ✅ HTTP 200 OK
Database: ✅ Connected (893 modules installed)
Elasticsearch: ✅ Healthy
Nginx: ✅ Official Magento config active
```

---

## Themes

### Available Themes

#### 1. Magento Luma (Default)
- **Type**: Built-in Magento theme
- **Status**: Currently active
- **Path**: `/home/oro/test/luma-repo/magento/app/design/frontend/Magento/luma/`
- **Features**: Standard responsive design, Bootstrap 3

#### 2. Tailwind-Luna (Custom)
- **Type**: Custom Tailwind CSS theme
- **Status**: Available in separate repo
- **Location**: `/home/oro/tailwind-luna/`
- **Repository**: https://github.com/Genaker/Tailwind-Luna
- **Features**: Tailwind CSS, modern utilities, custom components

---

## Switching to Tailwind-Luna Theme

To integrate Tailwind-Luna theme:

```bash
# Copy theme to Magento
cp -r /home/oro/tailwind-luna /home/oro/test/luma-repo/magento/app/design/frontend/Genaker/tailwind-luna

# Register theme in Magento
docker-compose exec -T php bin/magento config:set design/theme/theme_id 2

# Clear cache and redeploy static
docker-compose exec -T php bin/magento cache:clean
docker-compose exec -T php bin/magento setup:static-content:deploy -f

# Verify
docker-compose exec -T php bin/magento design:theme:list
```

**See**: `docs/themes/` for detailed integration guide

---

## Common Tasks

### Install/Reinstall Magento
See: `docs/composer/INSTALLATION_GUIDE.md`

### Debug Container Issues
See: `docs/docker/DOCKER_COMPOSE_SETUP.md` → Troubleshooting

### Configure Store Settings
See: `docs/magento/` (to be created)

### Integrate Custom Theme
See: `docs/themes/` (to be created)

---

## File Reference

### Documentation Files

```
docs/
├── docker/
│   ├── DOCKER_COMPOSE_SETUP.md       ← Full Docker documentation
│   └── README.md                     ← Docker section overview
│
├── composer/
│   ├── INSTALLATION_GUIDE.md         ← Composer & setup guide
│   └── README.md                     ← Composer section overview
│
├── magento/
│   ├── CONFIGURATION.md              ← (to be created)
│   ├── ADMIN_SETUP.md               ← (to be created)
│   └── README.md                     ← Magento section overview
│
├── themes/
│   ├── TAILWIND_LUNA_INTEGRATION.md ← (to be created)
│   ├── THEME_SETUP.md               ← (to be created)
│   └── README.md                     ← Themes section overview
│
└── README.md                         ← This file
```

### Project Files

```
/home/oro/test/luma-repo/
├── docker-compose.yml               ← Docker orchestration
├── Dockerfile                       ← PHP image build
├── php.ini                          ← PHP config
├── nginx.conf                       ← Nginx config
└── magento/                         ← Application root
    ├── app/
    ├── bin/
    ├── pub/
    ├── vendor/
    ├── var/
    └── app/etc/env.php             ← Magento config

/home/oro/tailwind-luna/            ← Custom theme
├── README.md
├── warden/
└── src/
```

---

## Useful Links

### Internal Documentation
- [Docker Compose Setup](./docker/DOCKER_COMPOSE_SETUP.md)
- [Installation Guide](./composer/INSTALLATION_GUIDE.md)

### External References
- **Magento 2 DevDocs**: https://devdocs.magento.com/
- **Docker Documentation**: https://docs.docker.com/
- **Composer Documentation**: https://getcomposer.org/doc/
- **Tailwind-Luna Theme**: https://github.com/Genaker/Tailwind-Luna
- **Nginx Configuration**: https://devdocs.magento.com/guides/v2.4/config-guide/multi-site/ms_nginx.html

---

## Support & Troubleshooting

### Quick Diagnostics

```bash
# Check all services
docker-compose ps

# View logs
docker-compose logs -f

# Test database
docker-compose exec -T db mysql -umagento -pmagento123 magento -e "SELECT 1;"

# Test Elasticsearch
docker-compose exec -T php curl http://magento-elasticsearch:9200

# Check Magento status
docker-compose exec -T php bin/magento setup:db:status
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Container won't start | Check logs: `docker-compose logs php` |
| Memory exhaustion | Verify php.ini: 2GB limit should be set |
| Database connection failed | Ensure db service is running: `docker-compose ps` |
| Static files not loading | Run: `bin/magento setup:static-content:deploy -f` |
| Permission denied errors | Fix: `chmod -R 777 var/ generated/` |

**See**: `docs/docker/DOCKER_COMPOSE_SETUP.md` for detailed troubleshooting

---

## Next Steps

1. **Review** `docs/docker/DOCKER_COMPOSE_SETUP.md` for infrastructure details
2. **Study** `docs/composer/INSTALLATION_GUIDE.md` for installation process
3. **Integrate** Tailwind-Luna theme (see themes documentation)
4. **Configure** store settings (payment, shipping, etc.)
5. **Deploy** to production with proper security settings

---

## Document Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| Docker Setup | ✅ Complete | 2026-04-22 |
| Installation Guide | ✅ Complete | 2026-04-22 |
| Configuration | 🔄 In Progress | — |
| Themes Integration | 🔄 In Progress | — |
| Admin Setup | 🔄 In Progress | — |
| Security Guide | 📋 Planned | — |

---

## Credits

- **Magento 2.4.7**: Community Edition by Adobe
- **PHP 8.3**: Official Docker image
- **MariaDB 10.6**: Official Docker image
- **Elasticsearch 7.17**: Official Docker image
- **Nginx 1.25**: Official Alpine image
- **Tailwind-Luna**: https://github.com/Genaker/Tailwind-Luna

---

**Last Updated**: April 22, 2026
**Maintainer**: Development Team
**Version**: 1.0
