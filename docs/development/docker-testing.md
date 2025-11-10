# 🐳 Docker Compose Setup for Testing

This directory contains Docker Compose configurations for running the Video and Chat Application in different environments with comprehensive testing capabilities.

## 📁 Files Overview

```
├── docker-compose.dev.yml      # Development environment
├── docker-compose.test.yml     # Testing environment
├── nginx.conf                  # Nginx configuration
├── chatandvideo/
│   ├── Dockerfile.dev         # Development container
│   └── Dockerfile.test        # Testing container
└── test/
    └── mock-api/
        └── db.json            # Mock API data
```

## 🚀 Quick Start

### Development Environment
```bash
# Start development services
docker-compose -f docker-compose.dev.yml up --build

# Access the application
open http://localhost:3000

# View Firebase Emulator UI
open http://localhost:4000
```

### Testing Environment
```bash
# Run all tests
docker-compose -f docker-compose.test.yml up --build

# Run specific test services
docker-compose -f docker-compose.test.yml up test-runner
docker-compose -f docker-compose.test.yml up cypress
```

## 🔧 Services Included

### Development Services (`docker-compose.dev.yml`)

| Service | Port | Description |
|---------|------|-------------|
| **app** | 3000 | React development server with hot reload |
| **firebase** | 4000, 9099, 8080, 9199 | Firebase emulator suite |

### Testing Services (`docker-compose.test.yml`)

| Service | Port | Description |
|---------|------|-------------|
| **app** | 3000 | Main application |
| **firebase-emulator** | 4000, 9099, 8080, 9199 | Firebase emulators for testing |
| **test-runner** | - | Jest unit and integration tests |
| **cypress** | - | End-to-end testing |
| **mock-api** | 3001 | Mock REST API server |
| **nginx** | 8080 | Production-like web server |
| **lighthouse** | - | Performance testing |
| **test-db** | 5432 | PostgreSQL for complex tests |
| **redis** | 6379 | Caching and session storage |

## 📋 Usage Examples

### Running Individual Test Suites

#### Unit Tests
```bash
# Run unit tests only
docker-compose -f docker-compose.test.yml run --rm test-runner npm test

# Run tests with coverage
docker-compose -f docker-compose.test.yml run --rm test-runner npm run test:coverage
```

#### E2E Tests
```bash
# Run Cypress tests
docker-compose -f docker-compose.test.yml run --rm cypress

# Run Cypress in interactive mode
docker-compose -f docker-compose.test.yml run --rm -e DISPLAY=$DISPLAY cypress cypress open
```

#### Performance Tests
```bash
# Run Lighthouse audit
docker-compose -f docker-compose.test.yml run --rm lighthouse

# Check reports
ls ./lighthouse-reports/
```

### Development Workflow

#### Start Development Environment
```bash
# Start all development services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Stop services
docker-compose -f docker-compose.dev.yml down
```

#### Hot Reload Development
```bash
# Start with file watching
docker-compose -f docker-compose.dev.yml up

# Make changes to files in ./chatandvideo/src/
# Changes will be automatically reflected in the browser
```

### Database Testing

#### Setup Test Database
```bash
# Start test database
docker-compose -f docker-compose.test.yml up -d test-db

# Connect to database
docker-compose -f docker-compose.test.yml exec test-db psql -U test_user -d videochat_test
```

#### Run Database Migrations
```bash
# Run custom database initialization
docker-compose -f docker-compose.test.yml run --rm test-runner npm run db:migrate
```

## 🔧 Configuration

### Environment Variables

#### Development (`.env.development`)
```env
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:3001
REACT_APP_FIREBASE_PROJECT_ID=demo-videochat
REACT_APP_FIREBASE_AUTH_DOMAIN=demo-videochat.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://demo-videochat.firebaseio.com
```

#### Testing (`.env.test`)
```env
REACT_APP_ENV=test
REACT_APP_API_URL=http://mock-api:3001
REACT_APP_FIREBASE_PROJECT_ID=demo-videochat
CI=true
```

### Firebase Emulator Configuration

The Firebase emulators are configured to run on specific ports:
- **Auth Emulator**: `localhost:9099`
- **Firestore Emulator**: `localhost:8080`
- **Realtime Database**: `localhost:9199`
- **Emulator UI**: `localhost:4000`

### Custom Test Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test:ci": "react-scripts test --coverage --ci --watchAll=false",
    "test:docker": "docker-compose -f docker-compose.test.yml up --build",
    "dev:docker": "docker-compose -f docker-compose.dev.yml up --build",
    "e2e:docker": "docker-compose -f docker-compose.test.yml run cypress",
    "lighthouse:docker": "docker-compose -f docker-compose.test.yml run lighthouse"
  }
}
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use different ports
docker-compose -f docker-compose.dev.yml up --build -p "3001:3000"
```

#### Firebase Emulator Issues
```bash
# Reset emulator data
docker-compose -f docker-compose.dev.yml down -v
docker volume rm videochat_firebase-dev-data
docker-compose -f docker-compose.dev.yml up --build
```

#### Node Modules Issues
```bash
# Rebuild containers without cache
docker-compose -f docker-compose.test.yml build --no-cache

# Reset volumes
docker-compose -f docker-compose.test.yml down -v
```

### Performance Issues

#### Slow File Watching (macOS/Windows)
```yaml
# Add to docker-compose.dev.yml app service
environment:
  - CHOKIDAR_USEPOLLING=true
  - WATCHPACK_POLLING=true
```

#### Memory Issues
```yaml
# Add memory limits to services
deploy:
  resources:
    limits:
      memory: 1G
```

## 📊 Test Results and Reports

### Test Output Directories
```
├── test-results/          # Jest test results and coverage
├── cypress-results/       # Cypress screenshots and videos
└── lighthouse-reports/    # Performance audit reports
```

### Viewing Results
```bash
# View test coverage
open ./test-results/lcov-report/index.html

# View Lighthouse report
open ./lighthouse-reports/report.html

# View Cypress results
ls ./cypress-results/screenshots/
ls ./cypress-results/videos/
```

## 🚀 CI/CD Integration

### GitHub Actions Integration
```yaml
# .github/workflows/docker-tests.yml
name: Docker Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Docker Tests
        run: |
          docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
          
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            test-results/
            cypress-results/
            lighthouse-reports/
```

### Local CI Simulation
```bash
# Simulate CI environment
CI=true docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Run tests as CI would
docker-compose -f docker-compose.test.yml run --rm -e CI=true test-runner
```

## 🔒 Security Considerations

### Container Security
- All containers run as non-root users where possible
- Minimal base images (Alpine Linux)
- No sensitive data in environment variables
- Network isolation between services

### Development Security
- Firebase emulators use demo projects
- Mock data only for testing
- No production credentials in containers

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Cypress in Docker](https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/)
- [React Testing with Docker](https://create-react-app.dev/docs/running-tests/)

---

<div align="center">

**🐳 Containerized testing for consistent, reliable results across all environments**

</div>
