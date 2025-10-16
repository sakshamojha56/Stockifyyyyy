# Stockify Frontend

Bitcoin-Native Tokenized US Stocks trading platform on Stacks Blockchain.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.local.example .env.local
# Edit .env.local with your settings
```

3. Run development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint code

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (black/white/yellow theme)
- **@stacks/connect** - Wallet authentication
- **@stacks/transactions** - Blockchain interactions

## Features

- ✅ Wallet login (Hiro/Leather/Xverse)
- 🤖 AI trading agent
- 📊 Portfolio dashboard
- 📜 Transaction history
- 🎨 Black/white/yellow design

## Requirements

- Node.js 18+
- Hiro Wallet or Leather browser extension
- STX testnet tokens

## Configuration

Edit `.env.local`:
- `NEXT_PUBLIC_STOCKIFY_CONTRACT` - Deployed contract address
- `NEXT_PUBLIC_STACKS_NETWORK` - Network (testnet/mainnet)
- `OPENAI_API_KEY` - Optional for enhanced AI features

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Stacks Documentation](https://docs.stacks.co)
- [Stacks.js](https://stacks.js.org)
