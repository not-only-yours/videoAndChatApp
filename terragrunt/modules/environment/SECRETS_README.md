# 🔐 Secrets Management

This directory contains sensitive configuration variables for the Video and Chat Application infrastructure.

## ⚠️ Security Notice

**NEVER commit actual secrets to version control!** The `.gitignore` file is configured to exclude all `*.tfvars` files to prevent accidental commits of sensitive data.

## 📁 File Structure

```
environment/
├── secrets.tf                    # Variable definitions (commit to git)
├── terraform.tfvars.example      # Example values (commit to git)
├── terraform.tfvars              # Actual secrets (DO NOT COMMIT)
└── README.md                     # This documentation

environments/
├── development/
│   ├── terraform.tfvars.example  # Development example (commit to git)
│   └── terraform.tfvars          # Development secrets (DO NOT COMMIT)
├── staging/
│   ├── terraform.tfvars.example  # Staging example (commit to git)
│   └── terraform.tfvars          # Staging secrets (DO NOT COMMIT)
└── production/
    ├── terraform.tfvars.example  # Production example (commit to git)
    └── terraform.tfvars          # Production secrets (DO NOT COMMIT)
```

## 🚀 Quick Setup

### 1. Create Your Variables File
```bash
# For environment module
cp terraform.tfvars.example terraform.tfvars

# For specific environments
cp environments/development/terraform.tfvars.example environments/development/terraform.tfvars
cp environments/staging/terraform.tfvars.example environments/staging/terraform.tfvars
cp environments/production/terraform.tfvars.example environments/production/terraform.tfvars
```

### 2. Update Variables
Edit the `terraform.tfvars` files with your actual Firebase configuration:

```hcl
# terraform.tfvars
apiKey = "your-actual-firebase-api-key"
authDomain = "your-project-id.firebaseapp.com"
projectId = "your-project-id"
# ... other values
```

### 3. Verify Gitignore Protection
```bash
# Check that .tfvars files are ignored
git status
# terraform.tfvars files should NOT appear in untracked files
```

## 🔧 Variable Descriptions

| Variable | Description | Sensitive | Example |
|----------|-------------|-----------|---------|
| `aws-region` | AWS region for deployment | ❌ | `ap-south-1` |
| `apiKey` | Firebase API key | ✅ | `AIzaSyCybu...` |
| `authDomain` | Firebase auth domain | ❌ | `project.firebaseapp.com` |
| `projectId` | Firebase project ID | ❌ | `videochatapp-prod` |
| `storageBucket` | Firebase storage bucket | ❌ | `project.appspot.com` |
| `messagingSenderId` | Firebase messaging ID | ✅ | `534185277677` |
| `appId` | Firebase app ID | ✅ | `1:534185277677:web:...` |
| `measurementId` | Google Analytics ID | ❌ | `G-EBR83FKZWW` |
| `databaseURL` | Firebase database URL | ❌ | `https://project.firebaseio.com` |

## 🌍 Environment-Specific Configuration

### Development
- Use Firebase project with `-dev` suffix
- Lower security requirements
- Debug mode enabled

### Staging
- Use Firebase project with `-staging` suffix
- Production-like configuration
- Testing environment

### Production
- Use production Firebase project
- Highest security requirements
- Performance optimized

## 🔒 Security Best Practices

### 1. Environment Variables
For CI/CD, use environment variables instead of files:
```bash
export TF_VAR_apiKey="your-api-key"
export TF_VAR_projectId="your-project-id"
```

### 2. AWS Secrets Manager
For production, consider using AWS Secrets Manager:
```hcl
data "aws_secretsmanager_secret_version" "firebase" {
  secret_id = "firebase-config"
}

locals {
  firebase_config = jsondecode(data.aws_secretsmanager_secret_version.firebase.secret_string)
}
```

### 3. Terraform Cloud/Enterprise
Use Terraform Cloud workspace variables for team environments:
- Mark sensitive variables as "Sensitive"
- Use different workspaces per environment
- Enable workspace access controls

### 4. Local Development
```bash
# Use direnv for automatic environment loading
echo 'export TF_VAR_apiKey="your-key"' > .envrc
direnv allow
```

## 🚨 Emergency Procedures

### If Secrets Are Accidentally Committed

1. **Immediate Actions**
   ```bash
   # Remove from git history
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch terraform.tfvars' \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (dangerous - coordinate with team)
   git push origin --force --all
   ```

2. **Rotate All Exposed Secrets**
   - Regenerate Firebase API keys
   - Create new Firebase projects if necessary
   - Update all deployment configurations

3. **Update Security**
   - Review `.gitignore` configuration
   - Add pre-commit hooks to prevent future incidents
   - Audit team access to repositories

### Secret Rotation Schedule
- **Development**: Every 6 months
- **Staging**: Every 3 months  
- **Production**: Every month or after team changes

## 🔍 Validation

### Check Variable Usage
```bash
# Validate terraform configuration
terraform validate

# Check variable usage
terraform plan -var-file="terraform.tfvars"

# Ensure sensitive variables are not logged
TF_LOG=TRACE terraform plan 2>&1 | grep -i apikey
# Should show [REDACTED] or similar
```

### Test Configuration
```bash
# Test Firebase connectivity
firebase projects:list --token "your-token"

# Validate Firebase configuration
curl "https://firebase.googleapis.com/v1/projects/your-project-id" \
  -H "Authorization: Bearer your-token"
```

## 📚 References

- [Terraform Sensitive Variables](https://www.terraform.io/docs/language/values/variables.html#suppressing-values-in-cli-output)
- [Firebase Configuration](https://firebase.google.com/docs/web/setup)
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/)
- [Terragrunt Secrets Management](https://terragrunt.gruntwork.io/docs/features/keep-your-terraform-code-dry/#working-with-multiple-aws-accounts)

## 🆘 Support

If you need help with secrets management:
- Check this documentation first
- Review Terraform and Firebase documentation
- Contact the DevOps team: devops@videochatapp.com
- Create an issue: [GitHub Issues](https://github.com/your-org/videochatapp/issues)

---

<div align="center">

**🔐 Keep secrets secret** - Security is everyone's responsibility

</div>
