# 🔐 Security Checklist

Use this checklist to ensure proper handling of secrets and sensitive configuration.

## ✅ Setup Checklist

### Initial Setup
- [ ] **Copied example files**: Created `terraform.tfvars` from `terraform.tfvars.example`
- [ ] **Updated values**: Replaced example values with actual Firebase configuration
- [ ] **Verified gitignore**: Confirmed `.tfvars` files are ignored by git
- [ ] **Tested gitignore**: Ran `git status` to ensure secrets don't appear

### Environment-Specific Setup
- [ ] **Development**: Created `environments/development/terraform.tfvars`
- [ ] **Staging**: Created `environments/staging/terraform.tfvars`
- [ ] **Production**: Created `environments/production/terraform.tfvars`
- [ ] **Unique configs**: Each environment uses different Firebase projects

### Security Validation
- [ ] **No defaults**: Removed hardcoded values from `secrets.tf`
- [ ] **Marked sensitive**: All secret variables have `sensitive = true`
- [ ] **Access control**: Limited team access to production secrets
- [ ] **Documentation**: Team knows how to handle secrets properly

## 🚨 Pre-Commit Checklist

Before any git commit:
- [ ] **Check status**: `git status` shows no `.tfvars` files
- [ ] **Check diff**: `git diff --cached` shows no sensitive data
- [ ] **Validate ignore**: `.gitignore` includes `*.tfvars`
- [ ] **Test locally**: Infrastructure deploys without errors

## 🔄 Rotation Checklist

### Monthly (Production)
- [ ] **Generate new API keys**: Create new Firebase API keys
- [ ] **Update tfvars**: Replace old values with new ones
- [ ] **Test deployment**: Verify infrastructure still works
- [ ] **Update team**: Notify team of key rotation

### Quarterly (Staging)
- [ ] **Rotate staging keys**: Update staging environment keys
- [ ] **Test CI/CD**: Ensure automated deployments work
- [ ] **Document changes**: Update any automation scripts

### Semi-Annual (Development)
- [ ] **Rotate dev keys**: Update development environment keys
- [ ] **Clean old projects**: Archive unused Firebase projects
- [ ] **Update documentation**: Refresh setup instructions

## 🆘 Incident Response

If secrets are compromised:

### Immediate Actions (0-15 minutes)
- [ ] **Revoke compromised keys**: Disable API keys in Firebase Console
- [ ] **Stop deployments**: Pause all automated deployments
- [ ] **Assess impact**: Determine what data might be at risk
- [ ] **Alert team**: Notify security team and stakeholders

### Short-term Actions (15 minutes - 2 hours)
- [ ] **Generate new keys**: Create replacement API keys
- [ ] **Update configurations**: Replace compromised keys in all environments
- [ ] **Test systems**: Verify applications work with new keys
- [ ] **Remove from git**: If committed, remove from git history

### Long-term Actions (2-24 hours)
- [ ] **Review process**: Analyze how breach occurred
- [ ] **Update procedures**: Improve security processes
- [ ] **Train team**: Reinforce security best practices
- [ ] **Document incident**: Create post-mortem report

## 📋 Environment Variables

For CI/CD environments, use these environment variable names:

```bash
# Firebase Configuration
export TF_VAR_apiKey="your-api-key"
export TF_VAR_authDomain="your-project.firebaseapp.com"
export TF_VAR_projectId="your-project-id"
export TF_VAR_storageBucket="your-project.appspot.com"
export TF_VAR_messagingSenderId="your-sender-id"
export TF_VAR_appId="your-app-id"
export TF_VAR_measurementId="your-measurement-id"
export TF_VAR_databaseURL="https://your-project.firebaseio.com"
```

## 🔍 Validation Commands

### Check Git Status
```bash
git status --ignored
# Should show terraform.tfvars in ignored files section
```

### Validate Terraform
```bash
terraform validate
terraform plan -var-file="terraform.tfvars"
```

### Test Firebase Connection
```bash
firebase projects:list
# Should show your projects
```

### Check for Leaks in History
```bash
git log -S "apiKey" --all --full-history
# Should not show sensitive values
```

## 📞 Emergency Contacts

- **Security Team**: security@videochatapp.com
- **DevOps Lead**: devops@videochatapp.com
- **On-call Engineer**: +1-xxx-xxx-xxxx
- **Firebase Support**: Firebase Console → Support

---

<div align="center">

**🛡️ Security is a team responsibility** - When in doubt, ask!

</div>
