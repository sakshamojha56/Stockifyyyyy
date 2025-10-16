# 🚀 Stockify Quick Start Guide

This guide will help you get Stockify up and running in minutes!

## Prerequisites Checklist

Before you begin, make sure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **npm** or **yarn** package manager
- [ ] **Git** for cloning the repository
- [ ] **Hiro Wallet** or **Leather** browser extension ([Hiro](https://wallet.hiro.so) | [Leather](https://leather.io))
- [ ] **STX testnet tokens** from the [faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/sakshamojha56/Stockify.git
cd Stockify
```

### Step 2: Quick Setup (Automated)

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows (PowerShell):**
```powershell
cd frontend
npm install
copy .env.local.example .env.local
```

### Step 3: Configure Environment

Edit `frontend/.env.local`:

```env
# Optional: Add OpenAI API key for enhanced AI features
OPENAI_API_KEY=your_key_here

# Network settings (already configured for testnet)
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_HIRO_API=https://api.testnet.hiro.so

# Contract addresses (use defaults or update after deployment)
NEXT_PUBLIC_STOCKIFY_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stockify-core
NEXT_PUBLIC_DSTOCK_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stock-token
```

### Step 4: Start the Application

```bash
cd frontend
npm run dev
```

Visit **http://localhost:3000** 🎉

## First-Time User Guide

### 1. Connect Your Wallet

- Click **"Connect Wallet to Login"**
- Choose your wallet (Hiro, Leather, or Xverse)
- Approve the connection in your wallet extension
- You'll be redirected to the dashboard

### 2. Get Testnet STX

If you don't have testnet STX:

1. Copy your wallet address from the dashboard header
2. Visit the [Stacks Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
3. Paste your address and request tokens
4. Wait a few minutes for confirmation

### 3. Start Trading

Use the AI Trading Agent to interact with the platform:

**Check your balance:**
```
check balance
```

**Get a stock price:**
```
price of AAPL
```

**Buy stocks:**
```
buy 5 AAPL with STX
```

**Sell stocks:**
```
sell 2 AAPL
```

**View your holdings:**
```
show my holdings
```

## Available Stock Tickers

- **AAPL** - Apple Inc.
- **TSLA** - Tesla, Inc.
- **GOOGL** - Alphabet Inc.
- **MSFT** - Microsoft Corporation
- **AMZN** - Amazon.com, Inc.
- **NVDA** - NVIDIA Corporation
- **META** - Meta Platforms, Inc.
- **BRK.B** - Berkshire Hathaway Inc.
- **SPY** - SPDR S&P 500 ETF Trust
- **QQQ** - Invesco QQQ Trust

## Dashboard Overview

### 🤖 AI Trading Agent
- Natural language interface for trading
- Real-time transaction feedback
- Links to Stacks Explorer for verification

### 📊 Your Stock Holdings
- Live portfolio value
- Real-time profit/loss calculations
- Per-ticker breakdown

### 📜 Transaction History
- Complete trade history
- Transaction status tracking
- Direct links to blockchain explorer

## Troubleshooting

### Wallet Won't Connect
- Ensure wallet extension is installed and unlocked
- Check you're on the testnet network in your wallet
- Try refreshing the page

### Transaction Fails
- Verify you have sufficient STX balance
- Ensure the stock ticker is valid (uppercase)
- Check you own enough shares when selling

### "Loading..." Stuck
- Clear browser cache
- Check console for errors (F12)
- Verify `.env.local` is configured correctly

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Smart Contract Development (Optional)

If you want to develop or deploy smart contracts:

### Install Clarinet

**Linux/macOS:**
```bash
curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64-glibc.tar.gz | tar xz
sudo mv clarinet /usr/local/bin/
```

**Windows:**
Download from [Clarinet Releases](https://github.com/hirosystems/clarinet/releases)

### Test Contracts

```bash
# Check contracts
clarinet check

# Run tests
clarinet test

# Start local devnet
clarinet integrate
```

### Deploy to Testnet

```bash
# Generate deployment plan
clarinet deployments generate --testnet

# Apply deployment
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

After deployment, update contract addresses in `.env.local`.

## Next Steps

1. ✅ Connect your wallet
2. ✅ Get testnet STX tokens
3. ✅ Try buying a stock
4. ✅ Monitor your portfolio
5. ✅ Review transaction history

## Need Help?

- 📖 Read the full [README.md](README.md)
- 🐛 Report issues on [GitHub](https://github.com/sakshamojha56/Stockify/issues)
- 💬 Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines

## Important Reminders

⚠️ **This is a testnet demonstration platform**
- Not for real securities trading
- Uses testnet tokens with no real value
- For educational purposes only
- Always comply with applicable laws and regulations

---

**Happy Trading! 🚀**

Built with ❤️ on Stacks Blockchain
