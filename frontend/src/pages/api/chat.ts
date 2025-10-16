import type { NextApiRequest, NextApiResponse } from 'next';
import { mintStock, redeemStock, getBalances, getCurrentPrice } from '@/lib/stacksClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, context, history } = req.body;

  try {
    // Simple intent parsing without OpenAI (for demo purposes)
    const lowerMessage = message.toLowerCase();

    // Check balance intent
    if (lowerMessage.includes('balance') || lowerMessage.includes('how much')) {
      const balances = await getBalances(context.userAddress);
      return res.status(200).json({
        response: `💰 Your Balances:\n\n` +
                 `STX: ${balances.stx}\n` +
                 `sBTC: ${balances.sbtc}\n` +
                 `DSTOCK: ${balances.dstock}\n\n` +
                 `You can use STX to buy stocks!`
      });
    }

    // Check price intent
    const priceMatch = lowerMessage.match(/price of ([a-z]+)/i);
    if (priceMatch || lowerMessage.includes('price')) {
      const ticker = priceMatch ? priceMatch[1].toUpperCase() : 'AAPL';
      const price = await getCurrentPrice(ticker);
      return res.status(200).json({
        response: `💵 Current price of ${ticker}: $${price.toFixed(2)}\n\n` +
                 `Want to buy? Just say "buy 1 ${ticker} with STX"`
      });
    }

    // Buy intent
    const buyMatch = lowerMessage.match(/buy (\d+) ([a-z]+)/i);
    if (buyMatch) {
      const shares = parseInt(buyMatch[1]);
      const ticker = buyMatch[2].toUpperCase();
      const price = await getCurrentPrice(ticker);
      const maxPrice = Math.floor(price * 1000000 * 1.05); // 5% slippage in micro-STX

      try {
        const result = await mintStock({
          ticker,
          shares,
          maxUnitPrice: maxPrice,
          userAddress: context.userAddress
        });

        return res.status(200).json({
          response: `✅ Purchase order submitted!\n\n` +
                   `Ticker: ${ticker}\n` +
                   `Shares: ${shares}\n` +
                   `Price: ~$${price.toFixed(2)} per share\n` +
                   `Total: ~$${(shares * price).toFixed(2)}\n\n` +
                   `Transaction is being processed...`,
          txHash: result.txHash
        });
      } catch (error: any) {
        return res.status(200).json({
          response: `❌ Transaction failed: ${error.message}\n\n` +
                   `Please check your STX balance and try again.`
        });
      }
    }

    // Sell intent
    const sellMatch = lowerMessage.match(/sell (\d+) ([a-z]+)/i);
    if (sellMatch) {
      const shares = parseInt(sellMatch[1]);
      const ticker = sellMatch[2].toUpperCase();
      const price = await getCurrentPrice(ticker);
      const minPrice = Math.floor(price * 1000000 * 0.95); // 5% slippage in micro-STX

      try {
        const result = await redeemStock({
          ticker,
          shares,
          minUnitPrice: minPrice,
          userAddress: context.userAddress
        });

        return res.status(200).json({
          response: `✅ Sale order submitted!\n\n` +
                   `Ticker: ${ticker}\n` +
                   `Shares: ${shares}\n` +
                   `Price: ~$${price.toFixed(2)} per share\n` +
                   `Total: ~$${(shares * price).toFixed(2)}\n\n` +
                   `Transaction is being processed...`,
          txHash: result.txHash
        });
      } catch (error: any) {
        return res.status(200).json({
          response: `❌ Transaction failed: ${error.message}\n\n` +
                   `Please check that you own ${shares} shares of ${ticker}.`
        });
      }
    }

    // Holdings intent
    if (lowerMessage.includes('holding') || lowerMessage.includes('portfolio') || lowerMessage.includes('what do i own')) {
      return res.status(200).json({
        response: `📊 Check the "Your Stock Holdings" section to see your current positions!\n\n` +
                 `It shows all your stocks with live prices and profit/loss calculations.`
      });
    }

    // Default response
    return res.status(200).json({
      response: `I can help you with:\n\n` +
               `📊 "check balance" - See your STX balance\n` +
               `💰 "price of AAPL" - Get current stock price\n` +
               `📈 "buy 1 AAPL with STX" - Buy stocks\n` +
               `📉 "sell 2 TSLA" - Sell stocks\n` +
               `🎯 "show my holdings" - View portfolio\n\n` +
               `Available tickers: AAPL, TSLA, GOOGL, MSFT, AMZN, NVDA, META, BRK.B, SPY, QQQ`
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Sorry, I encountered an error processing your request.' 
    });
  }
}
