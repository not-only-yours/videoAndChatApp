#!/usr/bin/env python3
"""
Terragrunt Environment Analyzer
Analyzes Terragrunt environment files and calculates costs for each environment
"""

import re
import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime
from aws_pricing_fetcher import AWSPricingFetcher

@dataclass
class TerragruntEnvironment:
    """Represents a Terragrunt environment configuration"""
    name: str
    path: str
    inputs: Dict[str, Any]
    source_module: str
    estimated_monthly_cost: float
    cost_breakdown: Dict[str, float]
    resource_estimates: Dict[str, Any]

class TerragruntParser:
    """Parses Terragrunt files and extracts environment configurations"""

    def __init__(self):
        self.aws_regions = {
            "eu-west-1": "EU (Ireland)",
            "us-east-1": "US East (N. Virginia)",
            "us-west-2": "US West (Oregon)",
            "ap-southeast-1": "Asia Pacific (Singapore)"
        }

    def parse_terragrunt_file(self, file_path: str) -> Dict[str, Any]:
        """Parse a Terragrunt HCL file"""
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"Terragrunt file not found: {file_path}")

        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract terraform source
            source_match = re.search(r'source\s*=\s*"([^"]+)"', content)
            source_module = source_match.group(1) if source_match else ""

            # Extract inputs block
            inputs = self._extract_inputs_block(content)

            return {
                "source_module": source_module,
                "inputs": inputs,
                "file_path": str(path)
            }

        except Exception as e:
            print(f"❌ Error parsing {file_path}: {e}")
            return {"source_module": "", "inputs": {}, "file_path": str(path)}

    def _extract_inputs_block(self, content: str) -> Dict[str, Any]:
        """Extract the inputs block from Terragrunt content"""
        inputs = {}

        # Find the inputs block
        inputs_match = re.search(r'inputs\s*=\s*{([^}]*(?:{[^}]*}[^}]*)*)}', content, re.DOTALL)
        if not inputs_match:
            return inputs

        inputs_content = inputs_match.group(1)

        # Parse individual input variables
        patterns = [
            (r'environment\s*=\s*"([^"]+)"', "environment"),
            (r'aws_region\s*=\s*"([^"]+)"', "aws_region"),
            (r'vpc_CIDR\s*=\s*"([^"]+)"', "vpc_cidr"),
            (r'ecs_cluster_name\s*=\s*"([^"]+)"', "ecs_cluster_name"),
            (r'ecr_name\s*=\s*"([^"]+)"', "ecr_name"),
            (r'DNS\s*=\s*"([^"]+)"', "dns"),
            (r'port\s*=\s*(\d+)', "port"),
            (r'container_port\s*=\s*(\d+)', "container_port"),
            (r'public_subnets\s*=\s*\[([^\]]+)\]', "public_subnets"),
            (r'private_subnets\s*=\s*\[([^\]]+)\]', "private_subnets"),
            (r'availability_zones\s*=\s*\[([^\]]+)\]', "availability_zones"),
        ]

        for pattern, key in patterns:
            match = re.search(pattern, inputs_content)
            if match:
                value = match.group(1)
                # Try to convert numbers
                if key in ["port", "container_port"]:
                    try:
                        inputs[key] = int(value)
                    except ValueError:
                        inputs[key] = value
                elif key in ["public_subnets", "private_subnets", "availability_zones"]:
                    # Parse array values
                    subnets = [s.strip().strip('"') for s in value.split(',')]
                    inputs[key] = subnets
                else:
                    inputs[key] = value

        return inputs

class TerragruntCostAnalyzer:
    """Analyzes Terragrunt environments and calculates infrastructure costs"""

    def __init__(self, region: str = "eu-west-1"):
        self.region = region
        self.pricing_fetcher = AWSPricingFetcher(region)
        self.parser = TerragruntParser()
        self.pricing_data = None

    def load_pricing_data(self):
        """Load current pricing data"""
        if not self.pricing_data:
            self.pricing_data = self.pricing_fetcher.fetch_all_pricing()

    def analyze_terragrunt_environment(self, env_path: str) -> TerragruntEnvironment:
        """Analyze a single Terragrunt environment"""

        self.load_pricing_data()

        env_path = Path(env_path)
        terragrunt_file = env_path / "terragrunt.hcl"

        if not terragrunt_file.exists():
            raise FileNotFoundError(f"No terragrunt.hcl found in {env_path}")

        # Parse Terragrunt file
        terragrunt_config = self.parser.parse_terragrunt_file(str(terragrunt_file))

        # Extract environment name
        env_name = terragrunt_config["inputs"].get("environment", env_path.name)

        # Estimate infrastructure costs based on the environment configuration
        cost_breakdown, resource_estimates = self._estimate_environment_costs(
            terragrunt_config["inputs"],
            terragrunt_config["source_module"]
        )

        total_cost = sum(cost_breakdown.values())

        return TerragruntEnvironment(
            name=env_name,
            path=str(env_path),
            inputs=terragrunt_config["inputs"],
            source_module=terragrunt_config["source_module"],
            estimated_monthly_cost=total_cost,
            cost_breakdown=cost_breakdown,
            resource_estimates=resource_estimates
        )

    def _estimate_environment_costs(self, inputs: Dict[str, Any], source_module: str) -> Tuple[Dict[str, float], Dict[str, Any]]:
        """Estimate costs based on environment inputs and module type"""

        cost_breakdown = {}
        resource_estimates = {}

        # Determine environment scale based on environment name
        env_name = inputs.get("environment", "development")
        is_production = env_name == "production"
        is_staging = env_name == "staging"
        is_development = env_name == "development"
        is_eks = env_name == "eks"
        is_ecs = env_name == "ecs"

        # VPC and Networking Costs
        vpc_cost = self._calculate_vpc_costs(inputs)
        cost_breakdown.update(vpc_cost)

        # Load Balancer Costs
        alb_cost = self._calculate_load_balancer_costs(inputs, is_production)
        cost_breakdown.update(alb_cost)

        # Infrastructure-specific costs
        if is_eks or "eks" in source_module.lower():
            # EKS-specific costs
            eks_cost = self._calculate_eks_costs(inputs, is_production)
            cost_breakdown.update(eks_cost)
        elif is_ecs or "ecs" in source_module.lower() or "fargate" in source_module.lower():
            # ECS/Fargate costs
            ecs_cost = self._calculate_ecs_costs(inputs, is_production)
            cost_breakdown.update(ecs_cost)
        else:
            # Default to ECS if not specified
            ecs_cost = self._calculate_ecs_costs(inputs, is_production)
            cost_breakdown.update(ecs_cost)

        # ECR Costs
        ecr_cost = self._calculate_ecr_costs(inputs)
        cost_breakdown.update(ecr_cost)

        # Additional services based on environment
        if is_production:
            # Production gets additional redundancy and monitoring
            rds_cost = self._calculate_rds_costs(inputs, multi_az=True)
            cost_breakdown.update(rds_cost)

            # CloudWatch enhanced monitoring
            cost_breakdown["CloudWatch Enhanced"] = 15.0

            # Backup and disaster recovery
            cost_breakdown["Backup Services"] = 25.0

        elif is_staging:
            # Staging gets some redundancy
            rds_cost = self._calculate_rds_costs(inputs, multi_az=False)
            cost_breakdown.update(rds_cost)

            cost_breakdown["CloudWatch Basic"] = 5.0

        else:  # Development, EKS, ECS
            # Development uses minimal resources
            cost_breakdown["CloudWatch Basic"] = 2.0

        # Resource estimates for reporting
        resource_estimates = {
            "environment_type": env_name,
            "region": inputs.get("aws_region", "eu-west-1"),
            "vpc_subnets": len(inputs.get("public_subnets", [])) + len(inputs.get("private_subnets", [])),
            "availability_zones": len(inputs.get("availability_zones", [])),
            "cluster_name": inputs.get("ecs_cluster_name", inputs.get("cluster_name", "unknown")),
            "estimated_scale": "High" if is_production else "Medium" if is_staging else "Low"
        }

        return cost_breakdown, resource_estimates

    def _calculate_vpc_costs(self, inputs: Dict[str, Any]) -> Dict[str, float]:
        """Calculate VPC-related costs"""
        costs = {}

        # NAT Gateways (one per AZ as configured)
        num_azs = len(inputs.get("availability_zones", ["eu-west-1a", "eu-west-1b"]))
        nat_gateway_cost = 32.85 * num_azs  # $32.85/month per NAT Gateway in eu-west-1
        costs[f"NAT Gateways ({num_azs}x)"] = nat_gateway_cost

        # Data processing costs for NAT Gateways (estimated)
        costs["NAT Gateway Data Processing"] = 15.0 * num_azs

        return costs

    def _calculate_load_balancer_costs(self, inputs: Dict[str, Any], is_production: bool) -> Dict[str, float]:
        """Calculate Application Load Balancer costs"""
        costs = {}

        # Application Load Balancer base cost
        alb_cost = self.pricing_data["load_balancer"]["alb_monthly"]
        costs["Application Load Balancer"] = alb_cost

        # LCU costs based on expected traffic
        if is_production:
            lcu_cost = self.pricing_data["load_balancer"]["lcu_monthly"] * 2  # Higher traffic
            costs["ALB LCUs (Production)"] = lcu_cost
        else:
            lcu_cost = self.pricing_data["load_balancer"]["lcu_monthly"] * 0.5  # Lower traffic
            costs["ALB LCUs (Dev/Staging)"] = lcu_cost

        return costs

    def _calculate_ecs_costs(self, inputs: Dict[str, Any], is_production: bool) -> Dict[str, float]:
        """Calculate ECS Fargate costs"""
        costs = {}

        fargate_pricing = self.pricing_data["fargate"]

        if is_production:
            # Production: Higher CPU/Memory, multiple tasks
            cpu_vcpus = 2.0  # 2 vCPUs per task
            memory_gb = 4.0  # 4 GB per task
            num_tasks = 3    # Multiple tasks for redundancy
        elif inputs.get("environment") == "staging":
            # Staging: Medium resources
            cpu_vcpus = 1.0
            memory_gb = 2.0
            num_tasks = 2
        else:
            # Development: Minimal resources
            cpu_vcpus = 0.5
            memory_gb = 1.0
            num_tasks = 1

        cpu_cost = cpu_vcpus * fargate_pricing["cpu_monthly_per_vcpu"] * num_tasks
        memory_cost = memory_gb * fargate_pricing["memory_monthly_per_gb"] * num_tasks

        costs[f"Fargate CPU ({cpu_vcpus * num_tasks} vCPUs)"] = cpu_cost
        costs[f"Fargate Memory ({memory_gb * num_tasks} GB)"] = memory_cost

        return costs

    def _calculate_eks_costs(self, inputs: Dict[str, Any], is_production: bool) -> Dict[str, float]:
        """Calculate EKS costs"""
        costs = {}

        # EKS Cluster cost
        eks_cluster_cost = self.pricing_data["eks"]["cluster_monthly"]
        costs["EKS Cluster Management"] = eks_cluster_cost

        # Worker node costs
        if is_production:
            node_instance = "t3.large"
            num_nodes = 3
        else:
            node_instance = "t3.medium"
            num_nodes = 2

        ec2_pricing = self.pricing_data["ec2"]
        node_cost = ec2_pricing.get(node_instance, {"monthly": 30.37})["monthly"]
        total_node_cost = node_cost * num_nodes

        costs[f"Worker Nodes ({num_nodes}x {node_instance})"] = total_node_cost

        return costs

    def _calculate_ecr_costs(self, inputs: Dict[str, Any]) -> Dict[str, float]:
        """Calculate ECR (Elastic Container Registry) costs"""
        costs = {}

        # ECR storage costs (estimated based on container image sizes)
        # Typical web app images: ~500MB-1GB
        storage_gb = 2.0  # Estimated storage
        ecr_storage_cost = storage_gb * 0.10  # $0.10/GB/month

        costs["ECR Storage"] = ecr_storage_cost

        return costs

    def _calculate_rds_costs(self, inputs: Dict[str, Any], multi_az: bool = False) -> Dict[str, float]:
        """Calculate RDS database costs"""
        costs = {}

        if multi_az:
            # Production RDS with Multi-AZ
            instance_type = "db.t3.small"
            base_cost = 30.0  # Approximate cost for db.t3.small
            multi_az_multiplier = 2.0
            total_cost = base_cost * multi_az_multiplier
            costs["RDS (Multi-AZ)"] = total_cost
        else:
            # Single-AZ RDS for staging
            instance_type = "db.t3.micro"
            total_cost = 15.0  # Approximate cost for db.t3.micro
            costs["RDS (Single-AZ)"] = total_cost

        # Storage costs
        storage_gb = 20 if multi_az else 10
        storage_cost = storage_gb * 0.115  # $0.115/GB/month for gp2
        costs["RDS Storage"] = storage_cost

        return costs

    def analyze_all_environments(self, terragrunt_root: str) -> List[TerragruntEnvironment]:
        """Analyze all environments in the Terragrunt directory"""

        environments = []
        terragrunt_path = Path(terragrunt_root)
        environments_path = terragrunt_path / "environments"

        if not environments_path.exists():
            raise FileNotFoundError(f"No environments directory found in {terragrunt_root}")

        print(f"🔍 Analyzing Terragrunt environments in: {environments_path}")

        # Find all environment directories
        env_dirs = [d for d in environments_path.iterdir() if d.is_dir()]

        print(f"📁 Found {len(env_dirs)} environments: {[d.name for d in env_dirs]}")

        for env_dir in env_dirs:
            try:
                print(f"  📊 Analyzing {env_dir.name}...")
                environment = self.analyze_terragrunt_environment(str(env_dir))
                environments.append(environment)
            except Exception as e:
                print(f"  ❌ Error analyzing {env_dir.name}: {e}")

        return environments

def main():
    """Test the Terragrunt analyzer"""
    import argparse

    parser = argparse.ArgumentParser(description="Analyze Terragrunt environments for cost estimation")
    parser.add_argument("terragrunt_root", nargs="?", default="../terragrunt", help="Path to Terragrunt root directory")
    parser.add_argument("--region", default="eu-west-1", help="AWS region")
    parser.add_argument("--environment", help="Analyze specific environment (development, staging, production)")
    parser.add_argument("--output", help="Output JSON file")

    args = parser.parse_args()

    try:
        analyzer = TerragruntCostAnalyzer(args.region)

        if args.environment:
            # Analyze specific environment
            env_path = Path(args.terragrunt_root) / "environments" / args.environment
            if not env_path.exists():
                print(f"❌ Environment {args.environment} not found")
                return 1

            environment = analyzer.analyze_terragrunt_environment(str(env_path))
            environments = [environment]
        else:
            # Analyze all environments
            environments = analyzer.analyze_all_environments(args.terragrunt_root)

        if not environments:
            print("❌ No environments found to analyze")
            return 1

        print(f"\n📊 Terragrunt Environment Analysis Results:")
        print(f"🌍 Region: {args.region}")

        total_cost_all_envs = 0

        for env in environments:
            print(f"\n🏗️ {env.name.upper()} Environment")
            print(f"   💰 Monthly Cost: ${env.estimated_monthly_cost:.2f}")
            print(f"   📁 Path: {env.path}")
            print(f"   🔧 Module: {env.source_module}")

            print(f"   💸 Cost Breakdown:")
            for service, cost in env.cost_breakdown.items():
                print(f"     • {service}: ${cost:.2f}")

            total_cost_all_envs += env.estimated_monthly_cost

        print(f"\n💰 Total Cost (All Environments): ${total_cost_all_envs:.2f}/month")

        if args.output:
            result = {
                "analysis_timestamp": datetime.now().isoformat(),
                "region": args.region,
                "total_cost_all_environments": total_cost_all_envs,
                "environments": [asdict(env) for env in environments]
            }

            with open(args.output, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"\n📄 Results saved to: {args.output}")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0

if __name__ == "__main__":
    exit(main())
