# GDPR Hub Lite - Development Makefile
# Provides common development commands

.PHONY: help install dev test seed clean lint format

# Default target
help:
	@echo "GDPR Hub Lite - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  dev          Start development servers (backend + frontend)"
	@echo "  dev-backend  Start backend server only"
	@echo "  dev-frontend Start frontend server only"
	@echo "  dev-celery   Start Celery worker"
	@echo "  dev-all      Start all services (backend + frontend + celery)"
	@echo ""
	@echo "Testing:"
	@echo "  test         Run pytest test suite"
	@echo "  test-verbose Run tests with verbose output"
	@echo "  test-coverage Run tests with coverage report"
	@echo ""
	@echo "Database:"
	@echo "  seed         Run seed script to populate database"
	@echo "  db-reset     Reset database (drop and recreate)"
	@echo "  migrate      Run database migrations"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint         Run linting checks"
	@echo "  format       Format code with black"
	@echo "  clean        Clean up temporary files"
	@echo ""
	@echo "Utilities:"
	@echo "  install      Install dependencies"
	@echo "  health       Check system health"
	@echo "  smoke        Run smoke tests"

# Development servers
dev:
	@echo "🚀 Starting development servers..."
	@echo "Backend: http://localhost:9011"
	@echo "Frontend: http://localhost:3003"
	@echo ""
	@echo "Press Ctrl+C to stop all servers"
	@trap 'kill %1 %2' INT; \
	cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 9011 --reload & \
	cd frontend && npx next dev -p 3003 & \
	wait

dev-backend:
	@echo "🚀 Starting backend server..."
	@echo "Backend: http://localhost:9011"
	@echo "API Docs: http://localhost:9011/docs"
	@cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 9011 --reload

dev-celery:
	@echo "🚀 Starting Celery worker..."
	@cd backend && celery -A app.core.celery_app worker --loglevel=info

dev-all:
	@echo "🚀 Starting all development services..."
	@echo "Backend: http://localhost:9011"
	@echo "Frontend: http://localhost:3003"
	@echo "Celery: Processing background tasks"
	@echo ""
	@echo "Press Ctrl+C to stop all services"
	@trap 'kill %1 %2 %3' INT; \
	cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 9011 --reload & \
	cd frontend && npx next dev -p 3003 & \
	cd backend && celery -A app.core.celery_app worker --loglevel=info & \
	wait

# Testing
test:
	@echo "🧪 Running pytest test suite..."
	@cd backend && python -m pytest test_basic.py -v

test-verbose:
	@echo "🧪 Running pytest with verbose output..."
	@cd backend && python -m pytest test_basic.py -v -s

test-coverage:
	@echo "🧪 Running tests with coverage report..."
	@cd backend && python -m pytest test_basic.py --cov=app --cov-report=html --cov-report=term

# Database operations
seed:
	@echo "🌱 Running seed script..."
	@cd backend && python seed.py

db-reset:
	@echo "🗑️ Resetting database..."
	@rm -f backend/gdpr_hub_lite.db
	@echo "✅ Database reset complete"

migrate:
	@echo "📊 Running database migrations..."
	@cd backend && alembic upgrade head

# Code quality
lint:
	@echo "🔍 Running linting checks..."
	@cd backend && python -m flake8 app/ --max-line-length=100 --ignore=E203,W503
	@cd frontend && npx eslint . --ext .ts,.tsx --max-warnings 0

format:
	@echo "🎨 Formatting code..."
	@cd backend && python -m black app/ --line-length=100
	@cd frontend && npx prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}"

clean:
	@echo "🧹 Cleaning up temporary files..."
	@find . -type f -name "*.pyc" -delete
	@find . -type d -name "__pycache__" -delete
	@find . -type d -name ".pytest_cache" -delete
	@find . -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name ".DS_Store" -delete
	@echo "✅ Cleanup complete"

# Installation
install:
	@echo "📦 Installing dependencies..."
	@cd backend && pip install -r requirements.txt
	@cd frontend && npm install
	@echo "✅ Dependencies installed"

# Health checks
health:
	@echo "🏥 Checking system health..."
	@echo "Backend health:"
	@curl -s http://localhost:9011/healthz | python -m json.tool || echo "❌ Backend not running"
	@echo ""
	@echo "Frontend health:"
	@curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3003 || echo "❌ Frontend not running"

# Smoke tests
smoke:
	@echo "💨 Running smoke tests..."
	@echo "Testing backend endpoints..."
	@curl -s -o /dev/null -w "Root: %{http_code}\n" http://localhost:9011/
	@curl -s -o /dev/null -w "Health: %{http_code}\n" http://localhost:9011/healthz
	@curl -s -o /dev/null -w "API Health: %{http_code}\n" http://localhost:9011/api/v1/healthz
	@curl -s -o /dev/null -w "Breaches: %{http_code}\n" http://localhost:9011/api/v1/breaches
	@curl -s -o /dev/null -w "Consents: %{http_code}\n" http://localhost:9011/api/v1/consents
	@curl -s -o /dev/null -w "Exports: %{http_code}\n" http://localhost:9011/api/v1/exports/bundles
	@curl -s -o /dev/null -w "Compliance: %{http_code}\n" http://localhost:9011/api/v1/compliance/status
	@echo ""
	@echo "Testing frontend pages..."
	@curl -s -o /dev/null -w "Root: %{http_code}\n" http://localhost:3003/
	@curl -s -o /dev/null -w "Breaches: %{http_code}\n" http://localhost:3003/breaches
	@curl -s -o /dev/null -w "Consents: %{http_code}\n" http://localhost:3003/consents
	@curl -s -o /dev/null -w "DPIA: %{http_code}\n" http://localhost:3003/dpia
	@curl -s -o /dev/null -w "ROPA: %{http_code}\n" http://localhost:3003/ropa
	@echo "✅ Smoke tests completed"

# Quick setup for new developers
setup: install seed
	@echo "🎉 Setup complete!"
	@echo "Run 'make dev' to start development servers"
	@echo "Run 'make smoke' to test the setup"
