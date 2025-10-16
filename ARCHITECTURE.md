# Stockify Architecture & Design Document

## System Overview

Stockify is a decentralized application (dApp) that enables tokenized stock trading on the Stacks blockchain. The platform consists of three main components:

1. **Smart Contracts** (Clarity on Stacks)
2. **Frontend Application** (Next.js + React)
3. **AI Trading Agent** (Natural Language Processing)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (Next.js 14 + React)                         │
├─────────────────────────────────────────────────────────────────┤
│  Login Page  │  Dashboard  │  AI Agent  │  Portfolio  │  Txns  │
└────────┬────────────────────────────────────────────────┬───────┘
         │                                                  │
         │              Stacks Connect                      │
         │              (Wallet Auth)                       │
         ▼                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STACKS.JS LIBRARY                          │
│              (@stacks/connect, @stacks/transactions)            │
└────────┬────────────────────────────────────────────────────────┘
         │
         │              RPC Calls
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STACKS BLOCKCHAIN                            │
│                        (Testnet)                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ stockify-core    │  │  stock-token     │                    │
│  │   (Trading)      │  │   (SIP-010)      │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Smart Contracts Layer

#### stockify-core.clar
**Purpose:** Main trading logic and state management

**Key Functions:**
- `mint-stock(ticker, shares, max-price)` - Buy stocks with STX
- `redeem-stock(ticker, shares, min-price)` - Sell stocks for STX
- `get-shares(user, ticker)` - Query holdings
- `get-transaction(user, tx-id)` - Get transaction details
- `set-price(ticker, price)` - Update prices (admin only)

**Data Structures:**
```clarity
;; User positions
(define-map positions 
  { user: principal, ticker: (string-ascii 10) }
  { shares: uint, avg-cost: uint }
)

;; Transaction history
(define-map transactions
  { user: principal, tx-id: uint }
  { ticker, shares, price, action, asset, timestamp, block }
)

;; Price oracle
(define-map price-registry
  (string-ascii 10)
  uint
)
```

**Security Features:**
- Pause mechanism for emergencies
- Owner-only admin functions
- Input validation on all public functions
- Balance checks before transfers

#### stock-token.clar
**Purpose:** SIP-010 fungible token representing stock ownership

**Features:**
- Standard SIP-010 interface
- 6 decimal precision
- Mint/burn controlled by contract owner
- Transfer with optional memo

### 2. Frontend Application Layer

#### Technology Stack
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (black/white/yellow theme)
- **State Management:** React hooks (useState, useEffect)
- **Routing:** Next.js file-based routing

#### Page Structure
```
/                   → Login (WalletLogin component)
/dashboard          → Main dashboard (requires auth)
/api/chat           → AI agent API endpoint
```

#### Component Hierarchy
```
App
├── _app.tsx (Global wrapper)
├── _document.tsx (HTML structure)
│
├── pages/
│   ├── index.tsx (Login page)
│   │   └── WalletLogin
│   │       └── Stacks Connect authentication
│   │
│   ├── dashboard.tsx (Main interface)
│   │   ├── Header (logout, address display)
│   │   ├── AgentChat (AI trading interface)
│   │   ├── PortfolioHoldings (live portfolio)
│   │   └── TransactionHistory (trade log)
│   │
│   └── api/
│       └── chat.ts (AI agent backend)
```

#### State Management Flow
```
User Action
    ↓
Component State Update (useState)
    ↓
API Call / Blockchain Transaction
    ↓
Stacks.js Library
    ↓
Blockchain State Change
    ↓
UI Update (re-render)
```

### 3. Library Layer

#### stacksAuth.ts
**Purpose:** Wallet authentication and session management

**Key Functions:**
```typescript
authenticate()     // Show wallet connection modal
getUserData()      // Get authenticated user info
isSignedIn()       // Check authentication status
signOut()          // Disconnect wallet
```

**Authentication Flow:**
1. User clicks "Connect Wallet"
2. Stacks Connect modal appears
3. User selects wallet (Hiro/Leather/Xverse)
4. Wallet prompts for approval
5. Session created with appPrivateKey
6. Redirect to dashboard

#### stacksClient.ts
**Purpose:** Blockchain interaction layer

**Key Functions:**
```typescript
mintStock(params)              // Execute buy transaction
redeemStock(params)            // Execute sell transaction
getAccountHoldings(address)    // Query user positions
getTransactionHistory(address) // Fetch trade history
getBalances(address)           // Get STX/sBTC/DSTOCK balances
getCurrentPrice(ticker)        // Get stock price
```

**Transaction Flow:**
1. Frontend calls stacksClient function
2. Parameters converted to Clarity values
3. Transaction constructed with makeContractCall
4. Post-conditions added for security
5. Transaction signed with user's key
6. Broadcast to network
7. Transaction hash returned
8. UI updated with pending status

### 4. AI Trading Agent

#### Architecture
```
User Message
    ↓
Intent Parsing (Pattern Matching)
    ↓
Action Classification
    ├── Balance Check → Query Blockchain
    ├── Price Check → Get Current Price
    ├── Buy Order → Execute mint-stock
    ├── Sell Order → Execute redeem-stock
    └── Help → Return Guidance
    ↓
Response Generation
    ↓
UI Display (with tx hash if applicable)
```

#### Supported Intents
- **Balance queries:** "check balance", "how much STX"
- **Price queries:** "price of AAPL", "what's TSLA worth"
- **Buy orders:** "buy 5 AAPL with STX"
- **Sell orders:** "sell 2 TSLA"
- **Portfolio:** "show my holdings", "what do I own"

#### Enhancement Options
For production, can integrate OpenAI GPT-4:
- More natural language understanding
- Context-aware responses
- Multi-turn conversations
- Complex query handling

---

## Data Flow Examples

### Buy Stock Flow

```
1. USER: "buy 5 AAPL with STX"
   ↓
2. AI Agent parses intent
   ↓
3. Extracts: ticker=AAPL, shares=5, asset=STX
   ↓
4. Calls getCurrentPrice(AAPL) → $175.50
   ↓
5. Calculates: maxPrice = 175.50 * 1.05 * 1e6 (micro-STX)
   ↓
6. Calls mintStock({ticker, shares, maxPrice, userAddress})
   ↓
7. Constructs Clarity transaction:
   (contract-call? .stockify-core mint-stock "AAPL" u5 u184275000)
   ↓
8. User signs transaction in wallet
   ↓
9. Transaction broadcast to network
   ↓
10. Returns txHash: 0xabc123...
   ↓
11. UI displays success + Explorer link
   ↓
12. Portfolio updates on next refresh
```

### Portfolio Update Flow

```
1. Component mounts / Refresh button clicked
   ↓
2. Call getAccountHoldings(userAddress)
   ↓
3. For each ticker [AAPL, TSLA, GOOGL, ...]:
   ├── Query: (get-position user ticker)
   ├── Parse: { shares: 5, avg-cost: 175000000 }
   └── Get current price: $180.00
   ↓
4. Calculate for each position:
   ├── totalValue = shares * currentPrice
   ├── profitLoss = shares * (currentPrice - avgCost)
   └── profitLossPercent = (currentPrice - avgCost) / avgCost * 100
   ↓
5. Aggregate:
   ├── totalPortfolioValue = Σ totalValue
   └── totalProfitLoss = Σ profitLoss
   ↓
6. Render table with all positions
```

---

## Security Considerations

### Smart Contract Security

1. **Access Control**
   - Admin functions restricted to contract owner
   - User can only modify their own positions

2. **Input Validation**
   - Shares must be > 0
   - Price must be within acceptable range
   - Ticker must exist in registry

3. **State Protection**
   - Pause mechanism for emergencies
   - Atomic transactions (all-or-nothing)
   - No re-entrancy vulnerabilities

4. **Economic Security**
   - Price slippage protection (max/min price)
   - Balance checks before transfers
   - Post-conditions on transactions

### Frontend Security

1. **Authentication**
   - Wallet-based authentication (cryptographic)
   - Session management via Stacks Connect
   - No passwords stored

2. **Transaction Safety**
   - User must approve every transaction
   - Clear transaction details displayed
   - Post-conditions prevent unexpected losses

3. **Data Validation**
   - Input sanitization on all forms
   - Type checking with TypeScript
   - API response validation

---

## Performance Considerations

### Blockchain Layer
- **Transaction Time:** ~10 minutes per block on Stacks
- **Gas Costs:** Paid in STX (testnet: free)
- **Throughput:** Limited by block time

### Frontend Layer
- **Initial Load:** < 3 seconds
- **Component Rendering:** Optimized with React hooks
- **API Responses:** < 1 second for most operations

### Optimization Strategies
1. **Caching:** Store portfolio data in localStorage
2. **Lazy Loading:** Load transaction history on demand
3. **Debouncing:** Rate-limit price updates
4. **Memoization:** Cache expensive calculations

---

## Design System

### Color Palette
```css
Primary Black:  #000000
Primary White:  #FFFFFF
Accent Yellow:  #FFEB3B
Yellow Hover:   #FDD835
```

### Typography
- **Headings:** Bold, 2xl-8xl sizes
- **Body:** Regular, sm-base sizes
- **Code/Addresses:** Monospace font

### Component Patterns
- **Cards:** Dark background, yellow border
- **Buttons:** Yellow background, black text, hover effect
- **Tables:** Alternating rows, yellow headers
- **Status Badges:** Color-coded (green=confirmed, yellow=pending)

---

## Deployment Architecture

### Development
```
Local Machine
├── Clarinet (smart contract testing)
├── Next.js Dev Server (port 3000)
└── Hot Reload enabled
```

### Production
```
Smart Contracts → Stacks Testnet
Frontend → Vercel/Netlify
├── CDN for static assets
├── Edge functions for API
└── SSL/TLS encryption
```

---

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic trading functionality
- ✅ Wallet authentication
- ✅ AI agent with pattern matching
- ✅ Portfolio tracking
- ✅ Transaction history

### Phase 2 (Planned)
- [ ] OpenAI GPT-4 integration
- [ ] Pyth Network price oracle
- [ ] sBTC support (in addition to STX)
- [ ] Advanced charting
- [ ] Price alerts

### Phase 3 (Future)
- [ ] Limit orders
- [ ] Stop-loss orders
- [ ] Dividend tracking
- [ ] Multi-user portfolios
- [ ] Mobile app

---

## Testing Strategy

### Smart Contracts
- Unit tests with Clarinet
- Integration tests on devnet
- Testnet deployment before mainnet

### Frontend
- TypeScript compile-time checks
- Manual testing in multiple browsers
- Wallet integration testing

### End-to-End
- Complete user flows
- Transaction verification
- Error handling scenarios

---

## Maintenance & Monitoring

### Smart Contracts
- Monitor for unusual activity
- Check price accuracy
- Review admin actions

### Frontend
- Monitor API errors
- Track user sessions
- Performance metrics

### Infrastructure
- Uptime monitoring
- Error logging
- Analytics

---

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Maintainer:** Stockify Team
