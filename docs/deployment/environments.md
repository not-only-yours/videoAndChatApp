# 🚀 Deployment Guide

> Comprehensive guide for deploying the Video and Chat Application across different environments using modern CI/CD practices.

## 🎯 Deployment Overview

The application follows a GitOps approach with automated deployments triggered by code changes. Each environment has specific configurations and deployment procedures.

## 🌍 Environment Strategy

### Environment Hierarchy
```
Development → Staging → Production
     ↓           ↓         ↓
   Feature    Integration  Live
   Testing     Testing    Users
```

### Environment Specifications

| Environment | Purpose | Auto-Deploy | Manual Approval | Resources |
|-------------|---------|-------------|-----------------|-----------|
| **Development** | Feature testing | ✅ On push to `develop` | ❌ | Minimal |
| **Staging** | Pre-production validation | ✅ On push to `main` | ❌ | Production-like |
| **Production** | Live application | ❌ | ✅ Required | Optimized |

## 🏗️ Infrastructure Deployment

### Prerequisites
```bash
# Install required tools
brew install terraform terragrunt awscli

# Configure AWS credentials
aws configure

# Verify access
aws sts get-caller-identity
```

### Infrastructure Setup

#### 1. State Management Setup
```bash
# Create S3 bucket for Terraform state
aws s3 mb s3://videochat-terraform-state-$(whoami)

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

#### 2. Environment Deployment
```bash
# Navigate to infrastructure directory
cd terragrunt

# Deploy development environment
cd environments/development
terragrunt init
terragrunt plan
terragrunt apply

# Deploy staging environment  
cd ../staging
terragrunt init
terragrunt plan
terragrunt apply

# Deploy production environment
cd ../production
terragrunt init
terragrunt plan
terragrunt apply
```

#### 3. Using Makefile (Recommended)
```bash
# From project root
make init ENV=development
make plan ENV=staging
make apply ENV=production
```

## 📱 Application Deployment

### Frontend Deployment (Firebase)

#### Development Environment
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to development
cd chatandvideo
npm run build
firebase deploy --only hosting:development
```

#### Staging Environment
```bash
# Build for staging
REACT_APP_ENV=staging npm run build

# Deploy to staging
firebase deploy --only hosting:staging
```

#### Production Environment
```bash
# Build for production
REACT_APP_ENV=production npm run build

# Deploy to production (requires approval)
firebase deploy --only hosting:production
```

### Container Deployment (AWS ECS)

#### Build and Push Container
```bash
# Get ECR login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Build container image
docker build -t videochat-app .

# Tag for ECR
docker tag videochat-app:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/videochat-app:latest

# Push to ECR
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/videochat-app:latest
```

#### Update ECS Service
```bash
# Force new deployment
aws ecs update-service --cluster production-cluster --service videochat-service --force-new-deployment
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

#### Development Pipeline (`.github/workflows/development.yml`)
```yaml
name: Development Deployment

on:
  push:
    branches: [ develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
        working-directory: chatandvideo
      - name: Run tests
        run: npm test -- --coverage --watchAll=false
        working-directory: chatandvideo
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Development
        run: |
          cd chatandvideo
          npm run build:dev
          firebase deploy --only hosting:development
```

#### Staging Pipeline (`.github/workflows/staging.yml`)
```yaml
name: Staging Deployment

on:
  push:
    branches: [ main ]

jobs:
  infrastructure:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Infrastructure
        run: |
          cd terragrunt/environments/staging
          terragrunt apply --auto-approve
          
  application:
    needs: infrastructure
    runs-on: ubuntu-latest
    steps:
      - name: Build and Deploy
        run: |
          cd chatandvideo
          npm run build:staging
          docker build -t videochat:staging .
          # Push to ECR and update ECS
```

#### Production Pipeline (`.github/workflows/production.yml`)
```yaml
name: Production Deployment

on:
  release:
    types: [published]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to Production
        run: |
          # Manual approval required
          # Deploy infrastructure and application
```

## 🔧 Configuration Management

### Environment Variables

#### Development
```env
REACT_APP_ENV=development
REACT_APP_API_URL=https://dev-api.videochat.com
REACT_APP_FIREBASE_PROJECT_ID=videochat-dev
REACT_APP_TWILIO_ACCOUNT_SID=dev_account_sid
```

#### Staging
```env
REACT_APP_ENV=staging
REACT_APP_API_URL=https://staging-api.videochat.com
REACT_APP_FIREBASE_PROJECT_ID=videochat-staging
REACT_APP_TWILIO_ACCOUNT_SID=staging_account_sid
```

#### Production
```env
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.videochat.com
REACT_APP_FIREBASE_PROJECT_ID=videochat-prod
REACT_APP_TWILIO_ACCOUNT_SID=prod_account_sid
```

### Secrets Management

#### AWS Secrets Manager
```bash
# Store production secrets
aws secretsmanager create-secret \
  --name "videochat/production/config" \
  --description "Production configuration for Video Chat App" \
  --secret-string '{
    "TWILIO_API_KEY": "your_production_api_key",
    "FIREBASE_PRIVATE_KEY": "your_firebase_key"
  }'
```

#### GitHub Secrets
```bash
# Required repository secrets
FIREBASE_TOKEN         # Firebase CI token
AWS_ACCESS_KEY_ID      # AWS deployment credentials  
AWS_SECRET_ACCESS_KEY  # AWS deployment credentials
TWILIO_API_KEY         # Twilio production API key
```

## 🔍 Deployment Verification

### Health Checks

#### Frontend Health Check
```javascript
// Health check endpoint
GET /health
Response: {
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-11-10T10:00:00Z"
}
```

#### Infrastructure Health Check
```bash
# Check ALB health
aws elbv2 describe-target-health --target-group-arn arn:aws:elasticloadbalancing:...

# Check ECS service status
aws ecs describe-services --cluster production-cluster --services videochat-service
```

### Smoke Tests

#### Automated Smoke Tests
```javascript
// cypress/integration/smoke.spec.js
describe('Smoke Tests', () => {
  it('should load the application', () => {
    cy.visit('/')
    cy.contains('Video Chat App')
  })

  it('should allow Google login', () => {
    cy.get('[data-testid="login-button"]').should('be.visible')
  })
})
```

#### Manual Verification Checklist
- [ ] Application loads without errors
- [ ] Google authentication works
- [ ] Chat rooms can be created
- [ ] Video calls can be initiated
- [ ] Real-time messaging functions
- [ ] Mobile responsiveness works

## 🚀 Deployment Commands

### Quick Deploy Commands
```bash
# Deploy everything to development
make deploy-dev

# Deploy application only to staging  
make deploy-app ENV=staging

# Deploy infrastructure only to production
make deploy-infra ENV=production

# Rollback deployment
make rollback ENV=production VERSION=v1.2.3
```

### Manual Deployment Steps
```bash
# 1. Update version
npm version patch

# 2. Build application
npm run build

# 3. Deploy infrastructure
cd terragrunt/environments/production
terragrunt apply

# 4. Deploy application
firebase deploy --only hosting:production

# 5. Verify deployment
curl -f https://videochat.com/health
```

## 🔙 Rollback Procedures

### Application Rollback
```bash
# Firebase rollback
firebase hosting:clone videochat-prod:previous videochat-prod:current

# ECS rollback  
aws ecs update-service \
  --cluster production-cluster \
  --service videochat-service \
  --task-definition videochat-app:123  # Previous version
```

### Infrastructure Rollback
```bash
# Terraform rollback
cd terragrunt/environments/production
git checkout previous-working-commit
terragrunt apply
```

## 📊 Monitoring Deployment

### Deployment Metrics
- **Deployment Duration**: Target < 10 minutes
- **Success Rate**: Target > 99%
- **Rollback Time**: Target < 5 minutes
- **Zero Downtime**: Blue-green deployments

### Alerts
- Failed deployment notifications
- Health check failures
- Performance degradation alerts
- Security scan alerts

## 🛡️ Security in Deployment

### Security Scanning
```yaml
# Security scan in CI/CD
- name: Security Scan
  run: |
    npm audit --audit-level high
    docker scan videochat:latest
    terraform validate
```

### Access Controls
- **Least Privilege**: Minimal permissions for CI/CD
- **MFA Required**: Multi-factor auth for production
- **Audit Logging**: All deployment actions logged
- **Secret Rotation**: Regular key rotation

## 📚 Additional Resources

- **[Environment Configuration](environments.md)** - Detailed environment setup
- **[CI/CD Documentation](ci-cd.md)** - Pipeline configuration details
- **[Monitoring Guide](monitoring.md)** - Post-deployment monitoring
- **[Security Checklist](../architecture/security.md)** - Security best practices

## 🆘 Emergency Procedures

### Production Issues
1. **Stop deployment**: Cancel any ongoing deployments
2. **Assess impact**: Check monitoring and user reports
3. **Quick fix**: Apply hotfix if possible
4. **Rollback**: Rollback to last known good version
5. **Investigate**: Post-incident analysis

### Contact Information
- **On-call Engineer**: +1-xxx-xxx-xxxx
- **DevOps Team**: devops@videochat.com
- **Incident Channel**: #incident-response

---

<div align="center">

**🚀 Deploy with confidence** - Follow the process and monitor the results

</div>
