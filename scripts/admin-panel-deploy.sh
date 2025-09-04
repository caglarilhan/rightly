#!/bin/bash
# admin-panel-deploy.sh
# Admin Panel v0 Production Deployment

set -e

echo "🚀 Admin Panel v0 Production Deployment"
echo "======================================="

# Environment variables
export DATABASE_URL="${DATABASE_URL:-postgresql://user:pass@localhost:5432/rightly}"
export BACKEND_URL="${BACKEND_URL:-http://127.0.0.1:9011}"
export FRONTEND_URL="${FRONTEND_URL:-http://localhost:3002}"

echo "📋 1. Database Migration"
echo "----------------------"

if command -v psql &> /dev/null; then
    echo "Applying database migration..."
    psql "$DATABASE_URL" -f migrations/001_admin_panel_schema.sql
    echo "✅ Database migration completed"
else
    echo "⚠️ psql not found, skipping migration"
    echo "Please run manually: psql \$DATABASE_URL -f migrations/001_admin_panel_schema.sql"
fi

echo ""
echo "📋 2. Backend Deployment"
echo "----------------------"

cd backend

# Check if Python dependencies are installed
if [ ! -d "venv" ] && [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    echo "Using existing virtual environment..."
    source venv/bin/activate 2>/dev/null || source .venv/bin/activate
fi

echo "Starting backend server..."
echo "Backend will be available at: $BACKEND_URL"
echo "Press Ctrl+C to stop the server"

# Start backend in background
nohup uvicorn app.main:app --host 0.0.0.0 --port 9011 --proxy-headers > backend.log 2>&1 &
BACKEND_PID=$!

echo "✅ Backend started (PID: $BACKEND_PID)"

echo ""
echo "📋 3. Frontend Deployment"
echo "----------------------"

cd ../frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo "Building frontend..."
npm run build

echo "Starting frontend server..."
echo "Frontend will be available at: $FRONTEND_URL"
echo "Press Ctrl+C to stop the server"

# Start frontend in background
nohup npm run start > frontend.log 2>&1 &
FRONTEND_PID=$!

echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "📋 4. Health Check"
echo "----------------"

# Wait for services to start
echo "Waiting for services to start..."
sleep 10

# Health checks
echo "Checking backend health..."
if curl -s "$BACKEND_URL/healthz" > /dev/null; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
fi

echo "Checking frontend health..."
if curl -s "$FRONTEND_URL" > /dev/null; then
    echo "✅ Frontend health check passed"
else
    echo "❌ Frontend health check failed"
fi

echo ""
echo "📋 5. Admin Panel Smoke Test"
echo "---------------------------"

# Run smoke test
cd ..
if [ -f "scripts/admin-panel-smoke-test.sh" ]; then
    echo "Running admin panel smoke test..."
    ./scripts/admin-panel-smoke-test.sh
else
    echo "⚠️ Smoke test script not found"
fi

echo ""
echo "🎉 Deployment Completed!"
echo "======================="
echo "Backend: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
echo "Admin Panel: $FRONTEND_URL/admin"
echo ""
echo "📊 Monitoring:"
echo "- Backend logs: tail -f backend/backend.log"
echo "- Frontend logs: tail -f frontend/frontend.log"
echo ""
echo "🛑 To stop services:"
echo "kill $BACKEND_PID $FRONTEND_PID"
