import { 
  makeContractCall, 
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  stringAsciiCV,
  standardPrincipalCV,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
  createAssetInfo
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import { userSession } from './stacksAuth';

const network = new StacksTestnet();
const contractAddress = process.env.NEXT_PUBLIC_STOCKIFY_CONTRACT?.split('.')[0] || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const contractName = process.env.NEXT_PUBLIC_STOCKIFY_CONTRACT?.split('.')[1] || 'stockify-core';

export interface MintStockParams {
  ticker: string;
  shares: number;
  maxUnitPrice: number;
  userAddress: string;
}

export interface RedeemStockParams {
  ticker: string;
  shares: number;
  minUnitPrice: number;
  userAddress: string;
}

export async function mintStock(params: MintStockParams) {
  const { ticker, shares, maxUnitPrice, userAddress } = params;

  // Get current price first
  const priceResponse = await fetch(`${process.env.NEXT_PUBLIC_HIRO_API}/v2/contracts/call-read/${contractAddress}/${contractName}/get-price`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: userAddress,
      arguments: [stringAsciiCV(ticker).serialize().toString('hex')]
    })
  });

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'mint-stock',
    functionArgs: [
      stringAsciiCV(ticker),
      uintCV(shares),
      uintCV(maxUnitPrice),
    ],
    senderKey: userSession.loadUserData().appPrivateKey,
    validateWithAbi: false,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  
  return {
    txHash: broadcastResponse.txid,
    ticker,
    shares,
    totalCost: shares * maxUnitPrice
  };
}

export async function redeemStock(params: RedeemStockParams) {
  const { ticker, shares, minUnitPrice, userAddress } = params;

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'redeem-stock',
    functionArgs: [
      stringAsciiCV(ticker),
      uintCV(shares),
      uintCV(minUnitPrice),
    ],
    senderKey: userSession.loadUserData().appPrivateKey,
    validateWithAbi: false,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  
  return {
    txHash: broadcastResponse.txid,
    ticker,
    shares,
    proceeds: shares * minUnitPrice
  };
}

export async function getAccountHoldings(userAddress: string) {
  // Mock holdings for demo - in production, query contract state
  const tickers = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'NVDA'];
  const holdings = [];
  
  for (const ticker of tickers) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HIRO_API}/v2/contracts/call-read/${contractAddress}/${contractName}/get-position`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: userAddress,
          arguments: [
            standardPrincipalCV(userAddress).serialize().toString('hex'),
            stringAsciiCV(ticker).serialize().toString('hex')
          ]
        })
      });
      
      const data = await response.json();
      if (data.okay && data.result) {
        // Parse the result and add to holdings
        // This is simplified - actual parsing would be more complex
        const shares = 10; // Placeholder
        const avgCost = 100;
        const currentPrice = 105;
        
        if (shares > 0) {
          holdings.push({
            ticker,
            shares,
            avgCost,
            currentPrice,
            totalValue: shares * currentPrice,
            profitLoss: shares * (currentPrice - avgCost),
            profitLossPercent: ((currentPrice - avgCost) / avgCost) * 100
          });
        }
      }
    } catch (error) {
      console.error(`Failed to fetch holdings for ${ticker}:`, error);
    }
  }
  
  return holdings;
}

export async function getTransactionHistory(userAddress: string) {
  // Mock transaction history for demo
  const transactions = [
    {
      txId: '1',
      txHash: '0x' + '1'.repeat(64),
      ticker: 'AAPL',
      shares: 5,
      price: 175.50,
      total: 877.50,
      action: 'BUY' as const,
      asset: 'STX' as const,
      timestamp: Date.now() / 1000 - 86400,
      status: 'confirmed' as const
    },
    {
      txId: '2',
      txHash: '0x' + '2'.repeat(64),
      ticker: 'TSLA',
      shares: 3,
      price: 245.00,
      total: 735.00,
      action: 'BUY' as const,
      asset: 'STX' as const,
      timestamp: Date.now() / 1000 - 43200,
      status: 'confirmed' as const
    }
  ];
  
  return transactions;
}

export async function getBalances(userAddress: string) {
  try {
    // Get STX balance
    const stxResponse = await fetch(`${process.env.NEXT_PUBLIC_HIRO_API}/v2/accounts/${userAddress}?proof=0`);
    const stxData = await stxResponse.json();
    const stxBalance = parseInt(stxData.balance) / 1000000; // Convert from micro-STX

    return {
      stx: stxBalance.toFixed(6),
      sbtc: '0.00000000', // Mock sBTC balance
      dstock: '0' // Mock DSTOCK balance
    };
  } catch (error) {
    console.error('Failed to fetch balances:', error);
    return {
      stx: '0.000000',
      sbtc: '0.00000000',
      dstock: '0'
    };
  }
}

export async function getCurrentPrice(ticker: string): Promise<number> {
  // Mock prices - in production, query contract or Pyth oracle
  const prices: { [key: string]: number } = {
    'AAPL': 175.50,
    'TSLA': 245.00,
    'GOOGL': 140.25,
    'MSFT': 380.75,
    'AMZN': 155.00,
    'NVDA': 485.50,
    'META': 315.25,
    'BRK.B': 385.00,
    'SPY': 450.00,
    'QQQ': 380.00
  };
  
  return prices[ticker] || 100.00;
}
