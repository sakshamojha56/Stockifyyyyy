#!/bin/bash

# Stockify - Install and Run Script
# This script installs dependencies and starts the development server

set -e

echo "🚀 Stockify - Frontend Setup"
echo "=============================="
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

echo "📂 Current directory: $(pwd)"
echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies already installed"
    echo "   To reinstall, delete node_modules folder"
    echo ""
else
    echo "📦 Installing dependencies..."
    echo "   This may take a few minutes..."
    echo ""
    npm install
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found, copying from example..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local"
    echo ""
fi

echo "=============================="
echo "✅ Setup Complete!"
echo "=============================="
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "3. Connect your wallet:"
echo "   - Hiro Wallet"
echo "   - Leather"
echo "   - Xverse"
echo ""
echo "4. Get testnet STX tokens:"
echo "   https://explorer.hiro.so/sandbox/faucet?chain=testnet"
echo ""
echo "5. Start trading! 🎉"
echo ""
echo "=============================="
echo ""
echo "To start now, run:"
echo "  cd frontend && npm run dev"
echo ""
