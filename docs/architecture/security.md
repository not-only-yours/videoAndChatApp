# 🔐 Security Architecture

> Comprehensive security implementation for the Video and Chat Application, covering network security, application security, and data protection.

## 🛡️ Security Overview

The Video and Chat Application implements a defense-in-depth security strategy, with multiple layers of protection spanning from infrastructure to application level.

## 🏗️ Security Layers

### Security Architecture Stack
```
┌─────────────────────────────────────────────────────────────┐
│                    Application Security                     │
│ • Input validation • XSS protection • CSRF protection      │
├─────────────────────────────────────────────────────────────┤
│                   Authentication Layer                     │
│ • Google OAuth 2.0 • JWT tokens • Session management      │
├─────────────────────────────────────────────────────────────┤
│                    Transport Security                      │
│ • TLS 1.3 encryption • Certificate management • HSTS      │
├─────────────────────────────────────────────────────────────┤
│                     Network Security                       │
│ • VPC isolation • Security groups • Private subnets       │
├─────────────────────────────────────────────────────────────┤
│                 Infrastructure Security                    │
│ • IAM least privilege • Container isolation • Secrets     │
└─────────────────────────────────────────────────────────────┘
```

## 🔒 Authentication & Authorization

### Google OAuth 2.0 Implementation
```javascript
// Firebase Authentication configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

// Google OAuth provider setup
const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');
```

### JWT Token Management
- **Token Expiration**: 1 hour for access tokens
- **Refresh Strategy**: Automatic token refresh
- **Secure Storage**: HttpOnly cookies for tokens
- **Validation**: Server-side token verification

### Authorization Model
```
User Roles:
├── Guest: Can view public rooms
├── Member: Can join rooms and send messages  
├── Moderator: Can manage room settings
└── Admin: Full system access
```

## 🌐 Network Security

### VPC Security Architecture
```
Internet Gateway (IGW)
        │
        ▼
┌─────────────────┐
│  Public Subnet  │ ← ALB (ports 80, 443)
│  10.0.1.0/24   │
├─────────────────┤
│ Private Subnet  │ ← ECS Tasks (no direct internet)
│  10.0.2.0/24   │
├─────────────────┤
│   NAT Gateway   │ ← Outbound internet access
│  10.0.3.0/24   │
└─────────────────┘
```

### Security Group Rules

#### ALB Security Group
```hcl
resource "aws_security_group" "alb" {
  name_prefix = "videochat-alb-"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }
}
```

#### ECS Security Group
```hcl
resource "aws_security_group" "ecs" {
  name_prefix = "videochat-ecs-"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

## 🔐 Data Protection

### Encryption Standards

#### Data at Rest
- **Database**: Firebase encryption at rest
- **Secrets**: AWS Secrets Manager encryption
- **Container Images**: ECR encryption
- **Logs**: CloudWatch Logs encryption

#### Data in Transit
- **Client-Server**: TLS 1.3 encryption
- **Service-Service**: mTLS for internal communication
- **API Calls**: HTTPS only
- **WebSocket**: WSS (WebSocket Secure)

### Secrets Management
```bash
# AWS Secrets Manager structure
videochat/production/config
├── TWILIO_API_KEY
├── FIREBASE_PRIVATE_KEY
├── JWT_SECRET
└── ENCRYPTION_KEY
```

## 🛡️ Application Security

### Input Validation
```javascript
// Message validation example
const validateMessage = (message) => {
  // Length validation
  if (!message || message.length > 1000) {
    throw new Error('Invalid message length');
  }
  
  // Content sanitization
  const sanitized = DOMPurify.sanitize(message);
  
  // XSS prevention
  return sanitized.trim();
};
```

### XSS Protection
```javascript
// React JSX automatic escaping
const MessageComponent = ({ message }) => (
  <div className="message">
    {/* React automatically escapes this */}
    <span>{message.content}</span>
    
    {/* For HTML content, use sanitization */}
    <div dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(message.htmlContent)
    }} />
  </div>
);
```

### CSRF Protection
```javascript
// CSRF token implementation
const getCsrfToken = () => {
  return document.querySelector('meta[name="csrf-token"]').content;
};

const apiCall = async (url, data) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCsrfToken(),
    },
    body: JSON.stringify(data),
  });
};
```

## 🔍 Security Monitoring

### Security Events
```javascript
// Security event logging
const logSecurityEvent = (event, details) => {
  console.log({
    timestamp: new Date().toISOString(),
    event: event,
    userId: details.userId,
    ip: details.ip,
    userAgent: details.userAgent,
    severity: details.severity,
  });
};

// Examples
logSecurityEvent('LOGIN_ATTEMPT', { userId, ip, success: false });
logSecurityEvent('SUSPICIOUS_ACTIVITY', { userId, action: 'RAPID_REQUESTS' });
```

### AWS CloudTrail Integration
```json
{
  "eventVersion": "1.08",
  "userIdentity": {
    "type": "AssumedRole",
    "principalId": "AROABC123DEFGHIJKLMN:videochat-app",
    "arn": "arn:aws:sts::123456789012:assumed-role/ECSTaskRole/videochat-app"
  },
  "eventTime": "2025-11-10T10:30:00Z",
  "awsRegion": "us-east-1",
  "eventName": "GetSecretValue",
  "eventSource": "secretsmanager.amazonaws.com"
}
```

## 🚨 Incident Response

### Security Incident Levels
| Level | Description | Response Time | Actions |
|-------|-------------|---------------|---------|
| **Critical** | Active attack or breach | < 15 minutes | Immediate containment |
| **High** | Potential security threat | < 1 hour | Investigation and mitigation |
| **Medium** | Security policy violation | < 4 hours | Review and documentation |
| **Low** | Security awareness issue | < 24 hours | Education and monitoring |

### Incident Response Procedures
```bash
# 1. Immediate Response
# Isolate affected systems
aws ecs update-service --cluster prod --service videochat --desired-count 0

# 2. Evidence Collection  
# Capture logs and system state
aws logs create-export-task --log-group-name /aws/ecs/videochat

# 3. Communication
# Notify stakeholders via incident channel
curl -X POST "https://slack.com/api/chat.postMessage" \
  -H "Authorization: Bearer $SLACK_TOKEN" \
  -d "channel=#incident-response&text=Security incident detected"

# 4. Recovery
# Restore services after threat mitigation
aws ecs update-service --cluster prod --service videochat --desired-count 3
```

## 🔒 Container Security

### Image Security
```dockerfile
# Use official, minimal base images
FROM node:18-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S videochat -u 1001

# Copy files with correct permissions
COPY --chown=videochat:nodejs . .

# Run as non-root user
USER videochat

# Expose only necessary port
EXPOSE 3000
```

### Runtime Security
```yaml
# ECS Task Definition security
{
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ECSTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/ECSTaskRole",
  "containerDefinitions": [{
    "name": "videochat-app",
    "user": "1001:1001",
    "readonlyRootFilesystem": true,
    "privileged": false
  }]
}
```

## 🔐 API Security

### Rate Limiting
```javascript
// Express rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

### API Key Management
```javascript
// API key validation
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  // Validate against stored hash
  const isValid = bcrypt.compareSync(apiKey, process.env.API_KEY_HASH);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};
```

## 📊 Security Compliance

### GDPR Compliance
- **Data Minimization**: Collect only necessary data
- **Right to Deletion**: User data removal capability
- **Data Portability**: Export user data functionality
- **Consent Management**: Clear privacy consent flows

### SOC 2 Considerations
- **Security**: Access controls and monitoring
- **Availability**: High availability design
- **Processing Integrity**: Data validation and accuracy
- **Confidentiality**: Data encryption and access controls

## 🔧 Security Configuration

### Environment Variables Security
```bash
# Development environment
REACT_APP_API_URL=https://dev-api.videochat.com
# Do not include secrets in client-side env vars

# Server environment (stored in AWS Secrets Manager)
JWT_SECRET=random_256_bit_secret
TWILIO_API_SECRET=twilio_secret_key
DATABASE_PASSWORD=strong_database_password
```

### HTTPS Configuration
```nginx
# ALB SSL/TLS configuration
server {
    listen 443 ssl http2;
    server_name videochat.com;
    
    ssl_certificate /etc/ssl/certs/videochat.crt;
    ssl_certificate_key /etc/ssl/private/videochat.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256;
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
}
```

## 🧪 Security Testing

### Automated Security Scanning
```yaml
# GitHub Actions security workflow
name: Security Scan

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run npm audit
        run: npm audit --audit-level high
        
      - name: Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
          
      - name: Container scan
        run: |
          docker build -t videochat:latest .
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy image videochat:latest
```

### Penetration Testing
```bash
# OWASP ZAP automated scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://videochat.com \
  -r zap-report.html
```

## 📚 Security Documentation

### Security Policies
- **Password Policy**: Strong password requirements
- **Access Control Policy**: Least privilege access
- **Data Retention Policy**: Data lifecycle management
- **Incident Response Policy**: Security incident procedures

### Security Training
- **Developer Security Training**: Secure coding practices
- **Incident Response Training**: Security incident handling
- **Compliance Training**: GDPR and SOC 2 requirements
- **Security Awareness**: General security best practices

---

<div align="center">

**🛡️ Security is everyone's responsibility** - Stay vigilant and follow security best practices

</div>
