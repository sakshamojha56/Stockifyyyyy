#!/bin/bash

# Stockify Quick Setup Script
# This script helps you get started with Stockify quickly

set -e

echo "🚀 Welcome to Stockify Setup!"
echo "================================"
echo ""

# Check Node.js
echo "📦 Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check npm
echo "📦 Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✅ npm $(npm -v) detected"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"
echo ""

# Setup environment file
echo "🔧 Setting up environment configuration..."
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo "✅ Created .env.local file"
    echo "⚠️  Remember to update .env.local with your configuration!"
else
    echo "✅ .env.local already exists"
fi
echo ""

# Check Clarinet (optional)
echo "🔍 Checking for Clarinet (optional for smart contract development)..."
if command -v clarinet &> /dev/null; then
    echo "✅ Clarinet $(clarinet --version) detected"
else
    echo "⚠️  Clarinet not found. Install it if you want to develop smart contracts."
    echo "   Visit: https://github.com/hirosystems/clarinet"
fi
echo ""

echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Install a Stacks wallet:"
echo "   - Hiro Wallet: https://wallet.hiro.so"
echo "   - Leather: https://leather.io"
echo ""
echo "2. Get testnet STX tokens:"
echo "   - Visit: https://explorer.hiro.so/sandbox/faucet?chain=testnet"
echo ""
echo "3. Update frontend/.env.local with your settings"
echo ""
echo "4. Start the development server:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "📖 For more information, see README.md"
echo ""
echo "Happy trading! 🎉"
