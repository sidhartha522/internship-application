#!/bin/bash

echo "🚀 Starting Unified Internship Application..."
echo ""

# Check if frontend/dist exists
if [ ! -d "frontend/dist" ]; then
    echo "📦 Building React frontend..."
    cd frontend && npm run build && cd ..
    echo "✅ Build complete!"
    echo ""
fi

# Start the server
echo "🌐 Starting server on port 3001..."
npm start
