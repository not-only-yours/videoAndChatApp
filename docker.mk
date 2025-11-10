# 📋 Make Commands for Docker Testing

# Docker development environment
dev-docker: ## Start Docker development environment
	@echo "🐳 Starting Docker development environment..."
	docker-compose -f docker-compose.dev.yml up --build

dev-docker-detached: ## Start Docker development environment in background
	@echo "🐳 Starting Docker development environment in background..."
	docker-compose -f docker-compose.dev.yml up --build -d

# Docker testing environment
test-docker: ## Run all tests in Docker
	@echo "🧪 Running all tests in Docker environment..."
	docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

test-docker-unit: ## Run unit tests in Docker
	@echo "🔬 Running unit tests in Docker..."
	docker-compose -f docker-compose.test.yml run --rm test-runner

test-docker-e2e: ## Run E2E tests in Docker
	@echo "🌐 Running E2E tests in Docker..."
	docker-compose -f docker-compose.test.yml run --rm cypress

test-docker-performance: ## Run performance tests in Docker
	@echo "⚡ Running performance tests in Docker..."
	docker-compose -f docker-compose.test.yml run --rm lighthouse

# Docker cleanup
docker-clean: ## Clean up Docker resources
	@echo "🧹 Cleaning up Docker resources..."
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose -f docker-compose.test.yml down -v
	docker system prune -f

docker-rebuild: ## Rebuild Docker containers without cache
	@echo "🔄 Rebuilding Docker containers..."
	docker-compose -f docker-compose.test.yml build --no-cache
	docker-compose -f docker-compose.dev.yml build --no-cache

# Docker debugging
docker-logs: ## View Docker container logs
	@echo "📋 Viewing Docker logs..."
	docker-compose -f docker-compose.test.yml logs -f

docker-shell: ## Access shell in running container
	@echo "🐚 Accessing container shell..."
	docker-compose -f docker-compose.dev.yml exec app sh

# Firebase emulator management
firebase-reset: ## Reset Firebase emulator data
	@echo "🔥 Resetting Firebase emulator data..."
	docker-compose -f docker-compose.dev.yml down -v
	docker volume rm videochat_firebase-dev-data 2>/dev/null || true
	docker-compose -f docker-compose.dev.yml up firebase -d

# Test result management
test-results-open: ## Open test results in browser
	@echo "📊 Opening test results..."
	@if [ -f "./test-results/lcov-report/index.html" ]; then \
		open ./test-results/lcov-report/index.html; \
	fi
	@if [ -f "./lighthouse-reports/report.html" ]; then \
		open ./lighthouse-reports/report.html; \
	fi

test-results-clean: ## Clean test result directories
	@echo "🗑️ Cleaning test results..."
	rm -rf test-results cypress-results lighthouse-reports

.PHONY: dev-docker dev-docker-detached test-docker test-docker-unit test-docker-e2e test-docker-performance docker-clean docker-rebuild docker-logs docker-shell firebase-reset test-results-open test-results-clean
