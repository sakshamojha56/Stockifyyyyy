# Stockify 🚀

**Bitcoin-Native Tokenized US Stocks on Stacks Blockchain**

Stockify is a production-grade tokenized stock trading platform built on Stacks blockchain that allows users to buy/sell US stocks using **STX tokens** on testnet. The platform features wallet-based authentication, an AI conversational agent for trading, real-time portfolio tracking, and complete transaction history.

![Stockify Banner](https://img.shields.io/badge/Stacks-Testnet-purple?style=for-the-badge) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) ![Clarity](https://img.shields.io/badge/Clarity-5546FF?style=for-the-badge)

---

## 🚀 QUICK START

**New here? Start with [START_HERE.md](START_HERE.md) for the fastest setup!**

```bash
# Install and run (3 commands)
cd /workspaces/Stockify
./install-and-setup.sh
cd frontend && npm run dev
```

Then open **http://localhost:3000** and connect your wallet!

---

## 🎯 Features

### ✅ **Wallet Authentication**
- Connect with Hiro Wallet, Leather, or Xverse
- Secure authentication via Stacks Connect
- Automatic redirect to dashboard after login

### 🤖 **AI Trading Agent**
- Natural language interface for stock trading
- Commands: "buy 1 AAPL with STX", "check balance", "show holdings"
- Real-time transaction feedback with Explorer links

### 📊 **Portfolio Dashboard**
- Live stock holdings with P/L calculations
- Real-time price updates
- Total portfolio value tracking

### 📜 **Transaction History**
- Complete trade history with timestamps
- Direct links to Stacks Explorer for each transaction
- Status tracking (confirmed/pending)

### 🎨 **Modern UI/UX**
- Strict black, white, and yellow color scheme
- Responsive design for desktop and mobile
- Clean, professional interface

---

## 🏗️ Project Structure

```
Stockify/
├── contracts/                      # Clarity smart contracts
│   ├── stockify-core.clar         # Main trading logic
│   ├── stock-token.clar           # SIP-010 DSTOCK token
│   └── traits/
│       └── sip-010-trait.clar     # Fungible token trait
├── frontend/                       # Next.js application
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── WalletLogin.tsx    # Wallet connection page
│   │   │   ├── Header.tsx         # Header with logout
│   │   │   ├── AgentChat.tsx      # AI trading interface
│   │   │   ├── PortfolioHoldings.tsx
│   │   │   └── TransactionHistory.tsx
│   │   ├── pages/
│   │   │   ├── index.tsx          # Login page
│   │   │   ├── dashboard.tsx      # Main dashboard
│   │   │   └── api/
│   │   │       └── chat.ts        # AI agent API endpoint
│   │   ├── lib/                   # Utility libraries
│   │   │   ├── stacksAuth.ts      # Wallet authentication
│   │   │   └── stacksClient.ts    # Blockchain interactions
│   │   └── styles/
│   │       └── globals.css        # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.mjs
├── Clarinet.toml                   # Clarinet configuration
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Clarinet** (for smart contract development)
- **Hiro Wallet** or **Leather Wallet** browser extension
- **STX testnet tokens** (get from [faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet))

### 1. Clone the Repository

```bash
git clone https://github.com/sakshamojha56/Stockify.git
cd Stockify
```

### 2. Install Smart Contract Tools

```bash
# Install Clarinet
curl -L https://github.com/hirosystems/clarinet/releases/download/v2.0.0/clarinet-linux-x64-glibc.tar.gz | tar xz
sudo mv clarinet /usr/local/bin/

# Verify installation
clarinet --version
```

### 3. Test Smart Contracts

```bash
# Run Clarinet checks
clarinet check

# Run contract tests
clarinet test

# Deploy to testnet (optional)
clarinet deployments generate --testnet
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

### 4. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local with your configuration
# OPENAI_API_KEY=your_key_here (optional - for enhanced AI features)
# Update contract addresses after deployment
```

### 5. Run Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## 🔧 Configuration

### Environment Variables

Create `frontend/.env.local`:

```env
# OpenAI API (optional - for enhanced AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Stacks Network
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_HIRO_API=https://api.testnet.hiro.so

# Contracts (update with your deployed addresses)
NEXT_PUBLIC_STOCKIFY_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stockify-core
NEXT_PUBLIC_DSTOCK_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stock-token
```

### Supported Stock Tickers

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

---

## 📖 Usage Guide

### 1. Connect Your Wallet

- Click "Connect Wallet to Login" on the landing page
- Choose Hiro Wallet, Leather, or Xverse
- Approve the connection request
- Get redirected to the dashboard

### 2. Using the AI Trading Agent

**Check your balance:**
```
check balance
```

**Get stock price:**
```
price of AAPL
```

**Buy stocks:**
```
buy 5 AAPL with STX
```

**Sell stocks:**
```
sell 2 TSLA
```

**View holdings:**
```
show my holdings
```

### 3. Monitor Your Portfolio

- View all holdings in the "Your Stock Holdings" section
- See real-time P/L calculations
- Track total portfolio value

### 4. Review Transactions

- All trades appear in "Transaction History"
- Click transaction hashes to view on Stacks Explorer
- Monitor confirmation status

---

## 🛠️ Development

### Smart Contract Development

```bash
# Check contracts for errors
clarinet check

# Run tests
clarinet test

# Start local devnet
clarinet integrate

# Deploy to testnet
clarinet deployments generate --testnet
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

### Frontend Development

```bash
cd frontend

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Adding New Stock Tickers

1. Update contract price registry:
```clarity
(map-set price-registry "NEWSTOCK" u100000000) ;; Price in micro-STX
```

2. Add to `getCurrentPrice()` in `stacksClient.ts`:
```typescript
'NEWSTOCK': 100.00
```

3. Update the AI agent in `api/chat.ts` to recognize the new ticker

---

## 🔐 Security Considerations

### ⚠️ **TESTNET ONLY**

This is a **demonstration platform** on Stacks testnet:
- **NOT for real securities trading**
- Uses testnet STX tokens (no real value)
- Smart contracts are unaudited
- For educational purposes only

### Best Practices

- Never share your wallet seed phrase
- Always verify transaction details before signing
- Use testnet tokens only
- Review smart contract code before deployment

---

## 📊 Smart Contract Details

### stockify-core.clar

**Main Functions:**
- `mint-stock` - Buy stocks with STX
- `redeem-stock` - Sell stocks for STX
- `get-shares` - Get user's holdings for a ticker
- `get-transaction` - Retrieve transaction details
- `set-price` - Update stock prices (admin only)

**Data Structures:**
- `positions` - User holdings by ticker
- `transactions` - Complete transaction history
- `price-registry` - Current stock prices
- `user-nonces` - Transaction ID tracking

### stock-token.clar

**SIP-010 Compliant Token:**
- Token Name: "Digital Stock Token"
- Symbol: "DSTOCK"
- Decimals: 6
- Fungible token representing stock ownership

---

## 🧪 Testing

### Smart Contract Tests

```bash
clarinet test
```

Tests cover:
- Buying stocks with STX
- Selling stocks
- Balance tracking
- Access control
- Error handling

### Frontend Testing

```bash
cd frontend

# Run type checking
npx tsc --noEmit

# Test build
npm run build
```

---

## 🚢 Deployment

### Deploy Smart Contracts to Testnet

1. **Generate deployment plan:**
```bash
clarinet deployments generate --testnet
```

2. **Review and edit** `deployments/default.testnet-plan.yaml`

3. **Apply deployment:**
```bash
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

4. **Copy deployed contract addresses** and update `.env.local`

### Deploy Frontend to Vercel

1. **Push to GitHub:**
```bash
git add .
git commit -m "Deploy Stockify"
git push origin main
```

2. **Import to Vercel:**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Set root directory to `frontend`
- Add environment variables
- Deploy

---

## 🎨 Design System

### Color Palette

```css
Black:  #000000
White:  #FFFFFF
Yellow: #FFEB3B
```

### Typography

- **Headings:** Bold, large sizes
- **Body:** -apple-system, sans-serif
- **Monospace:** For addresses and hashes

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📄 License

This project is for educational purposes. Tokenized securities are subject to applicable laws and regulations.

---

## 🔗 Links

- **Stacks Explorer:** https://explorer.hiro.so/?chain=testnet
- **Hiro Wallet:** https://wallet.hiro.so
- **Stacks Documentation:** https://docs.stacks.co
- **Clarity Language:** https://docs.stacks.co/clarity

---

## ⚡ Troubleshooting

### Wallet won't connect
- Ensure you have Hiro Wallet or Leather installed
- Check that you're on the testnet network
- Try refreshing the page

### Transaction fails
- Verify you have sufficient STX balance
- Check the stock ticker is valid
- Ensure you own enough shares when selling

### Contract read errors
- Confirm contract addresses in `.env.local`
- Verify contracts are deployed to testnet
- Check Hiro API is accessible

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

---

**Built with ❤️ on Stacks Blockchain**

*Disclaimer: This is a demonstration platform. Not for real securities trading. Always comply with applicable laws and regulations.*
