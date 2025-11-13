# Infrastructure Analysis Tools - EKS vs ECS

This directory contains focused tools for comparing EKS (Kubernetes) vs ECS (Fargate) infrastructure deployments for the video chat application.

## 🎯 Purpose

Analyze and compare two infrastructure approaches:
- **EKS**: Kubernetes-based deployment with full container orchestration
- **ECS**: Fargate-based serverless containers with simplified management

## 📁 Files

- **`analyze.sh`** - Main analysis script with two scenarios
- **`yaml_terragrunt_analyzer.py`** - YAML-based infrastructure analyzer
- **`analyzer-config.yaml`** - Configuration file defining scenarios and preferences
- **`aws_pricing_fetcher.py`** - Real-time AWS pricing data fetcher
- **`pricing_cache_*.json`** - Cached pricing data (24-hour expiry)

## 🚀 Usage

### Two Analysis Scenarios

1. **Medium Application** (500 users):
   ```bash
   ./analyze.sh compare-medium
   ```

2. **Large Application** (2000 users):
   ```bash
   ./analyze.sh compare-large
   ```

### Additional Options

```bash
# Analyze with specific region
./analyze.sh compare-medium --region us-east-1

# Save results to file
./analyze.sh compare-large --output results.json

# Setup environment
./analyze.sh setup

# Validate configuration
./analyze.sh validate

# Check environment status
./analyze.sh status
```

## 📊 Configuration

Edit `analyzer-config.yaml` to customize:

- **Scenarios**: CPU, memory, storage, and user requirements
- **Preferences**: Cost vs scalability vs reliability priorities
- **Infrastructure**: EKS and ECS specific configurations

### Example Scenario Configuration

```yaml
scenarios:
  medium_app:
    cpu_cores: 2.0
    memory_gb: 4.0
    storage_gb: 50
    expected_users: 500
    peak_load_multiplier: 2.5
```

## 🏗️ Infrastructure Environments

The analysis tool works with two Terragrunt environments:

- **`../terragrunt/environments/eks/`** - EKS Kubernetes deployment
- **`../terragrunt/environments/ecs/`** - ECS Fargate deployment

## 📈 Sample Output

```
🎯 Infrastructure Analysis Results
==================================================
📊 Scenario: medium_app
👥 Users: 500
🖥️ Resources: 2.0 CPU, 4.0GB RAM
🌍 Region: eu-west-1

💰 Cost Comparison
------------------------------
ECS Fargate:    $198.30/month
EKS Kubernetes: $267.80/month
Difference:     $69.50 (35.0%)
Cheaper option: ECS

🏆 Recommendation: ECS
Reason: ECS is $69/month cheaper and provides serverless simplicity
```

## 🔧 Technical Details

### Cost Calculations

- **Real AWS Pricing**: Fetches current pricing from AWS APIs
- **Regional Pricing**: Supports multiple AWS regions
- **Dynamic Scaling**: Calculates costs based on auto-scaling patterns
- **Resource Optimization**: Includes recommendations for cost savings

### Architecture Analysis

- **ECS Fargate**: Serverless containers with pay-per-use model
- **EKS**: Managed Kubernetes with worker node costs
- **Scaling**: Different scaling characteristics and timeframes
- **Ecosystem**: Tool availability and vendor lock-in considerations

## 🎛️ Preferences Weighting

Configure analysis priorities in `analyzer-config.yaml`:

```yaml
preferences:
  priority_cost: 35          # Cost considerations
  priority_scalability: 30   # Scaling capabilities  
  priority_reliability: 25   # Uptime and stability
  priority_security: 10      # Security features
```

## 🚦 Prerequisites

1. **Python 3.7+** with PyYAML
2. **Internet connection** for pricing data
3. **Terragrunt environments** (EKS and ECS) configured

## 📋 Quick Start

1. **Setup environment**:
   ```bash
   ./analyze.sh setup
   ```

2. **Run analysis**:
   ```bash
   ./analyze.sh compare-medium
   ```

3. **Review recommendations** and deploy chosen infrastructure:
   ```bash
   cd ../terragrunt/environments/ecs  # or eks
   terragrunt apply
   ```

## 🎯 Decision Framework

The tool helps decide between EKS and ECS based on:

- **Cost sensitivity**: ECS typically 20-40% cheaper
- **Operational complexity**: ECS simpler, EKS more flexible
- **Scaling requirements**: Different scaling patterns and speeds
- **Ecosystem needs**: Kubernetes vs AWS-specific tools
- **Team expertise**: Container orchestration vs serverless experience

## 📊 Continuous Analysis

Re-run analysis when:
- AWS pricing changes (automatically detected)
- Application requirements evolve
- New scenarios need evaluation
- Regional deployment considerations change

---

**Result**: Focused, actionable infrastructure recommendations for video chat application deployment.
