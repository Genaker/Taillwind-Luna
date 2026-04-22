# Tailwind-Luna Setup & Documentation

Welcome to Tailwind-Luna theme! This guide will help you get started with the complete Docker-based Magento setup including this theme.

## 📚 Documentation

All setup and configuration documentation is located in the [`docs/`](./docs/) folder:

### Quick Start
- **[Project Status & Overview](./docs/PROJECT_STATUS.md)** - Current system status, services, and access information
- **[Main Documentation Hub](./docs/README.md)** - Central reference for all documentation

### Infrastructure Setup
- **[Docker Compose Setup](./docs/docker/DOCKER_COMPOSE_SETUP.md)** - Complete Docker infrastructure guide
  - Service configurations (PHP, MySQL, Elasticsearch, Nginx)
  - Network and volume management
  - Troubleshooting and performance tuning
  - Backup & restore procedures

- **[Installation & Composer Guide](./docs/composer/INSTALLATION_GUIDE.md)** - Magento installation steps
  - Step-by-step installation process
  - Composer configuration
  - Database setup
  - Static content deployment
  - Verification procedures

### Theme-Specific Documentation
- **[WARDEN.md](./docs/WARDEN.md)** - Original Warden configuration documentation
- **[Tailwind CSS Development](./docs/TAILWIND_EXTENSION_DEVELOPMENT.md)** - Custom theme development
- **[CSS Build Architecture](./docs/CSS_BUILD_ARCHITECTURE.md)** - Theme building process

### Performance & Advanced Topics
- **[Tailwind CSS Safelist](./docs/TAILWIND_CSS_SAFELIST.md)** - CSS purging configuration
- **[Magento JS Performance](./docs/MAGENTO_JS_PERFORMANCE.md)** - JavaScript optimization
- **[React Luma Integration](./docs/MICROFRONTEND_REACT_LUMA.md)** - Micro-frontend setup
- **[Cloudflare FPC Worker](./docs/CLOUDFLARE_FPC_WORKER.md)** - Cache configuration

---

## 🚀 Quick Start (5 minutes)

### 1. Start Docker Services
```bash
cd /home/oro/test/luma-repo
docker-compose up -d
```

### 2. Access Magento
```
Frontend: http://172.29.201.103:8888/
Admin: http://172.29.201.103:8888/admin_nsz0nw1/
Username: admin
Password: Admin@12345
```

### 3. Check Status
```bash
docker-compose ps
```

### For Detailed Setup
👉 **See: [Installation & Composer Guide](./docs/composer/INSTALLATION_GUIDE.md)**

---

## 📁 Directory Structure

```
tailwind-luna/
├── docs/                                    # Complete documentation
│   ├── README.md                            # Main docs hub
│   ├── PROJECT_STATUS.md                    # System status
│   ├── docker/
│   │   └── DOCKER_COMPOSE_SETUP.md         # Docker guide
│   ├── composer/
│   │   └── INSTALLATION_GUIDE.md           # Installation guide
│   ├── WARDEN.md                            # Warden setup
│   ├── TAILWIND_EXTENSION_DEVELOPMENT.md   # Theme dev
│   ├── CSS_BUILD_ARCHITECTURE.md           # CSS build
│   └── ... (other theme docs)
│
├── warden/                                  # Warden configuration files
│   ├── warden-env.yml
│   └── env.warden.example
│
├── src/                                     # Theme source code
│   ├── layouts/
│   ├── templates/
│   ├── web/
│   └── ...
│
├── Magento_*/                               # Theme module overrides
│
├── package.json                             # Node dependencies
├── tailwind.config.js                       # Tailwind CSS config
├── README.md                                # Theme README
├── LICENSE.txt
└── SETUP_GUIDE.md                          # This file
```

---

## 🔧 Services Architecture

```
┌─────────────────────────────────────────────────────┐
│ Docker Services (All Configured)                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ PHP 8.3-FPM (Port 9000)                           │
│ ↓                                                   │
│ Magento 2.4.7 + Tailwind-Luna Theme               │
│ ↓                                                   │
│ Nginx (Port 8888)                                 │
│ ↓                                                   │
│ Your Browser                                       │
│                                                    │
│ Supporting Services:                              │
│ - MariaDB 10.6 (Database)                         │
│ - Elasticsearch 7.17 (Search)                     │
│                                                    │
└─────────────────────────────────────────────────────┘
```

---

## 📖 Documentation Map

| Need | Document |
|------|----------|
| **Understand the setup** | [Project Status](./docs/PROJECT_STATUS.md) |
| **Deploy Magento** | [Installation Guide](./docs/composer/INSTALLATION_GUIDE.md) |
| **Configure Docker** | [Docker Setup](./docs/docker/DOCKER_COMPOSE_SETUP.md) |
| **Develop the theme** | [Theme Development](./docs/TAILWIND_EXTENSION_DEVELOPMENT.md) |
| **Optimize CSS** | [CSS Architecture](./docs/CSS_BUILD_ARCHITECTURE.md) |
| **Customize Tailwind** | [Tailwind Safelist](./docs/TAILWIND_CSS_SAFELIST.md) |
| **Use Warden** | [Warden Guide](./docs/WARDEN.md) |
| **React Integration** | [React Luma](./docs/MICROFRONTEND_REACT_LUMA.md) |
| **Performance** | [JS Performance](./docs/MAGENTO_JS_PERFORMANCE.md) |

---

## 🔐 System Information

### Database
```
Host: db (from Docker) / 127.0.0.1 (from host)
Port: 3306
Database: magento
User: magento
Password: magento123
```

### Search Engine
```
Type: Elasticsearch 7.17
Host: magento-elasticsearch:9200
Index Prefix: magento2_
Health: Healthy
```

### PHP Configuration
```
Memory Limit: 2GB
Max Execution Time: 600 seconds
Extensions: 11+ installed
```

---

## 📋 Useful Commands

### Docker Management
```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f php

# Stop services
docker-compose down
```

### Magento Commands
```bash
# Clear cache
docker-compose exec -T php bin/magento cache:flush

# Check installation
docker-compose exec -T php bin/magento setup:db:status

# Deploy static content
docker-compose exec -T php bin/magento setup:static-content:deploy -f

# List modules
docker-compose exec -T php bin/magento module:status
```

### Database Access
```bash
# Connect to database
docker-compose exec -T db mysql -umagento -pmagento123 magento

# Create backup
docker-compose exec -T db mysqldump -umagento -pmagento123 magento > backup.sql
```

---

## 🆘 Troubleshooting

### Services Won't Start
```bash
# Check logs
docker-compose logs php

# Restart
docker-compose down && docker-compose up -d
```

### Database Connection Error
```bash
# Test connection
docker-compose exec -T php php -r "
    \$link = mysqli_connect('db', 'magento', 'magento123');
    if (\$link) echo 'OK';
"
```

### See Detailed Troubleshooting
👉 **[Docker Setup Guide - Troubleshooting](./docs/docker/DOCKER_COMPOSE_SETUP.md#troubleshooting)**

---

## 📚 Additional Resources

### Internal Documentation
- [Main Documentation Hub](./docs/README.md)
- [Docker Compose Guide](./docs/docker/DOCKER_COMPOSE_SETUP.md)
- [Installation Guide](./docs/composer/INSTALLATION_GUIDE.md)
- [Project Status](./docs/PROJECT_STATUS.md)

### External References
- **Magento 2**: https://devdocs.magento.com/
- **PHP**: https://www.php.net/
- **Docker**: https://docs.docker.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Nginx**: https://nginx.org/

---

## 🎯 Next Steps

1. **Read** [Project Status](./docs/PROJECT_STATUS.md) for current system state
2. **Review** [Docker Setup](./docs/docker/DOCKER_COMPOSE_SETUP.md) to understand infrastructure
3. **Follow** [Installation Guide](./docs/composer/INSTALLATION_GUIDE.md) if reinstalling
4. **Develop** [Theme Development](./docs/TAILWIND_EXTENSION_DEVELOPMENT.md) to customize theme
5. **Deploy** to production with proper security

---

## 📝 Document Index

### Core Documentation
- ✅ [Project Status & Overview](./docs/PROJECT_STATUS.md)
- ✅ [Main Documentation Hub](./docs/README.md)

### Infrastructure
- ✅ [Docker Compose Setup](./docs/docker/DOCKER_COMPOSE_SETUP.md)
- ✅ [Composer Installation](./docs/composer/INSTALLATION_GUIDE.md)

### Original Theme Docs
- ✅ [Warden Configuration](./docs/WARDEN.md)
- ✅ [Tailwind CSS Safelist](./docs/TAILWIND_CSS_SAFELIST.md)
- ✅ [CSS Build Architecture](./docs/CSS_BUILD_ARCHITECTURE.md)
- ✅ [Tailwind Extension Development](./docs/TAILWIND_EXTENSION_DEVELOPMENT.md)
- ✅ [Magento JS Performance](./docs/MAGENTO_JS_PERFORMANCE.md)
- ✅ [React Luma Micro-Frontend](./docs/MICROFRONTEND_REACT_LUMA.md)
- ✅ [Cloudflare FPC Worker](./docs/CLOUDFLARE_FPC_WORKER.md)
- ✅ [React Luma Running](./docs/HOW_TO_RUN_REACT_LUMA.md)

---

## 📞 Support

For questions about:
- **Docker/Composer Setup**: See [Docker Setup Guide](./docs/docker/DOCKER_COMPOSE_SETUP.md)
- **Magento Installation**: See [Installation Guide](./docs/composer/INSTALLATION_GUIDE.md)
- **Theme Development**: See [Theme Development Guide](./docs/TAILWIND_EXTENSION_DEVELOPMENT.md)
- **System Status**: See [Project Status](./docs/PROJECT_STATUS.md)

---

**Last Updated**: April 22, 2026
**Magento Version**: 2.4.7 Community Edition
**Theme**: Tailwind-Luna
**Status**: ✅ Running & Documented
