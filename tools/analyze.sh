#!/bin/bash

# Infrastructure Analysis Script - EKS vs ECS Comparison
# Analyzes Terragrunt environments based on YAML configuration

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/analyzer-config.yaml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️ $1${NC}"
}

# Function to show usage
usage() {
    echo "🏗️ Infrastructure Analysis Tool - EKS vs ECS"
    echo "============================================="
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  compare-medium     Compare EKS vs ECS for medium application (500 users)"
    echo "  compare-large      Compare EKS vs ECS for large application (2000 users)"
    echo "  setup             Setup analysis environment"
    echo "  validate          Validate configuration files"
    echo ""
    echo "Options:"
    echo "  --region REGION   AWS region (default: eu-west-1)"
    echo "  --output FILE     Save results to JSON file"
    echo "  --config FILE     Use custom config file (default: analyzer-config.yaml)"
    echo ""
    echo "Examples:"
    echo "  $0 compare-medium                    # Compare for 500 users"
    echo "  $0 compare-large --region us-east-1  # Compare for 2000 users in US"
    echo "  $0 setup                             # Setup analysis environment"
    echo ""
    exit 1
}

# Function to check prerequisites
check_prerequisites() {
    print_header "🔍 Checking Prerequisites..."

    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is required but not installed"
        return 1
    fi
    print_success "Python 3 found"

    # Check if analyzer exists
    if [[ ! -f "$SCRIPT_DIR/yaml_terragrunt_analyzer.py" ]]; then
        print_error "Analyzer script not found"
        return 1
    fi
    print_success "Analyzer script found"

    return 0
}

# Function to setup environment
setup_environment() {
    print_header "🔧 Setting up Analysis Environment..."

    # Create necessary directories
    mkdir -p "$SCRIPT_DIR/reports"
    mkdir -p "$SCRIPT_DIR/cache"

    print_success "Directories created"
    print_info "Analysis tool is ready to use"
    print_success "Environment setup complete"
}

# Function to validate configuration
validate_config() {
    print_header "📋 Validating Configuration..."

    if python3 -c "
import sys
import os
script_dir = '$SCRIPT_DIR'
sys.path.insert(0, script_dir)

try:
    # Test if the analyzer can be imported and run
    from yaml_terragrunt_analyzer import YAMLBasedAnalyzer

    analyzer = YAMLBasedAnalyzer('$CONFIG_FILE', 'eu-west-1')

    print('✅ Analyzer can be initialized')
    print('✅ Configuration is valid')

except Exception as e:
    print(f'❌ Configuration validation error: {e}')
    sys.exit(1)
"; then
        print_success "Configuration validated"
    else
        print_error "Configuration validation failed"
        return 1
    fi
}

# Function to run comparison analysis
run_analysis() {
    local scenario="$1"
    local region="$2"
    local output_file="$3"

    print_header "🚀 Running Infrastructure Analysis..."
    print_info "Scenario: $scenario"
    print_info "Region: $region"

    # Build command
    local cmd="python3 $SCRIPT_DIR/yaml_terragrunt_analyzer.py --scenario $scenario --region $region"

    if [[ -n "$output_file" ]]; then
        cmd="$cmd --output $output_file"
        print_info "Output file: $output_file"
    fi

    # Run analysis
    echo ""
    if eval "$cmd"; then
        print_success "Analysis completed successfully"

        if [[ -n "$output_file" ]]; then
            print_info "Results saved to: $output_file"
        fi
    else
        print_error "Analysis failed"
        return 1
    fi
}

# Function to show environment status
show_status() {
    print_header "📊 Terragrunt Environment Status"
    echo ""

    local terragrunt_root="$(dirname "$SCRIPT_DIR")/terragrunt"

    if [[ -d "$terragrunt_root/environments/eks" ]]; then
        print_success "EKS environment: $terragrunt_root/environments/eks"
    else
        print_warning "EKS environment not found"
    fi

    if [[ -d "$terragrunt_root/environments/ecs" ]]; then
        print_success "ECS environment: $terragrunt_root/environments/ecs"
    else
        print_warning "ECS environment not found"
    fi

    echo ""
    print_info "Use 'terragrunt plan' in each environment directory to preview infrastructure"
    print_info "Use 'terragrunt apply' to deploy infrastructure"
}

# Main script logic
main() {
    local command="$1"
    local region="eu-west-1"
    local output_file=""
    local config_file="$CONFIG_FILE"

    # Parse arguments
    shift
    while [[ $# -gt 0 ]]; do
        case $1 in
            --region)
                region="$2"
                shift 2
                ;;
            --output)
                output_file="$2"
                shift 2
                ;;
            --config)
                config_file="$2"
                CONFIG_FILE="$config_file"
                shift 2
                ;;
            --help|-h)
                usage
                ;;
            *)
                print_error "Unknown option: $1"
                usage
                ;;
        esac
    done

    # Change to script directory
    cd "$SCRIPT_DIR"

    case $command in
        compare-medium)
            check_prerequisites || exit 1
            validate_config || exit 1
            run_analysis "medium_app" "$region" "$output_file"
            ;;
        compare-large)
            check_prerequisites || exit 1
            validate_config || exit 1
            run_analysis "large_app" "$region" "$output_file"
            ;;
        setup)
            setup_environment
            ;;
        validate)
            check_prerequisites || exit 1
            validate_config
            ;;
        status)
            show_status
            ;;
        "")
            print_error "No command specified"
            usage
            ;;
        *)
            print_error "Unknown command: $command"
            usage
            ;;
    esac
}

# Run main function with all arguments
main "$@"
