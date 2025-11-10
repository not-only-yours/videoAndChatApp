provider "aws" {
  region = var.aws_region
}


#######
#  VPC
#######

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "main-vpc"
  cidr = var.vpc_CIDR

  azs             = var.availability_zones
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  #One NAT Gateway per availability zone
  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true


  tags = {
    Terraform   = "true"
    Environment = var.environment
  }
}




#######
#  Application Load Balancers
#######


module "frontend-alb" {
  source           = "../application-load-balancer"
  name             = "frontend-alb"
  is_internal      = false
  subnets          = module.vpc.public_subnets
  certificate_arn  = var.arn_certificate_for_HTTPS_connection_to_frontend_ALB
  target_group_arn = module.fargate.target_group_arn[0]
  vpc_id           = module.vpc.vpc_id
  environment      = var.environment
}


#######
#  ECR repo
#######

module "ecr" {
  source             = "../ecr"
  name               = var.ecr_name
  environment        = var.environment
  max_images_in_repo = 5
}

#######
#  ECS cluster
#######

module "ecs-cluster" {
  source      = "../ecs"
  name        = var.ecs_cluster_name
  environment = var.environment
}

#######
#  Frontend task
#######

#that file creates autoscaling frontend task with cloudwatch metrics

module "fargate" {
  ecs_cluster_name    = module.ecs-cluster.name
  environment         = var.environment
  source              = "../fargate-cluster"
  autoscaling_enabled = true

  name                     = "ecs-fargate"
  vpc_id                   = module.vpc.vpc_id
  private_subnet_ids       = module.vpc.private_subnets
  cluster_id               = module.ecs-cluster.id
  secrets_arns             = [aws_secretsmanager_secret.dns-secrets.arn]
  source_security_group_id = module.frontend-alb.sg_id
  platform_version         = "1.4.0"

  task_container_secrets = [
    {
      "valueFrom" : aws_secretsmanager_secret.dns-secrets.arn,
      "name" : var.dns_secret_name
    }
  ]

  ecr_repository_arn     = module.ecr.arn
  task_container_image   = "${module.ecr.repository_url}:${var.container_image}"
  task_definition_cpu    = 512
  task_definition_memory = 4096

  container_port                  = var.container_port
  task_container_assign_public_ip = false


  target_groups = [
    {
      target_group_name = "efs"
      container_port    = var.container_port
    }
  ]

  health_check = {
    port = "traffic-port"
    path = var.healthcheck_path
  }

  capacity_provider_strategy = [
    {
      capacity_provider = "FARGATE_SPOT",
      weight            = 100
    }
  ]

  task_stop_timeout = 90
}

#######
#  Route53
#######


#Create a new Hosted Zone

resource "aws_route53_zone" "test" {
  name = var.DNS
}

#Standard route53 DNS record for "test" pointing to an front-end ALB

resource "aws_route53_record" "test" {
  zone_id = aws_route53_zone.test.zone_id
  name    = aws_route53_zone.test.name
  type    = "A"
  alias {
    name                   = module.frontend-alb.dns_name
    zone_id                = module.frontend-alb.zone_id
    evaluate_target_health = false
  }
}



#######
#  Secrets Manager
#######
#That code configures secret in secrets manager


resource "random_id" "id" {
  byte_length = 5
}

resource "aws_secretsmanager_secret" "dns-secrets" {
  name = "${var.environment}/${var.dns_secret_name}-${random_id.id.hex}"
}

resource "aws_secretsmanager_secret_version" "sversion" {
  secret_id     = aws_secretsmanager_secret.dns-secrets.id
  secret_string = <<EOF
   {
    "environment":"${var.environment}",
    "apiKey": "${var.apiKey}",
    "authDomain": "${var.authDomain}",
    "projectId": "${var.projectId}",
    "storageBucket": "${var.storageBucket}",
    "messagingSenderId": "${var.messagingSenderId}",
    "appId": "${var.appId}",
    "measurementId": "${var.measurementId}",
    "databaseURL": "${var.databaseURL}"
   }
EOF
}
