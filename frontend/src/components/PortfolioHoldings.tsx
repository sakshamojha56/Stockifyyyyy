'use client';

import { useState, useEffect } from 'react';
import { getAccountHoldings } from '@/lib/stacksClient';

interface Holding {
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

interface PortfolioHoldingsProps {
  userAddress: string;
}

export default function PortfolioHoldings({ userAddress }: PortfolioHoldingsProps) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHoldings();
  }, [userAddress]);

  const loadHoldings = async () => {
    setIsLoading(true);
    try {
      const data = await getAccountHoldings(userAddress);
      setHoldings(data);
    } catch (error) {
      console.error('Failed to load holdings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.totalValue, 0);
  const totalProfitLoss = holdings.reduce((sum, h) => sum + h.profitLoss, 0);

  return (
    <div className="bg-zinc-900 border-2 border-yellow-400 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-yellow-400 text-2xl font-bold">📊 Your Stock Holdings</h2>
        <button
          onClick={loadHoldings}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all"
        >
          Refresh
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-800 border border-yellow-400 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Value</p>
          <p className="text-white text-2xl font-bold">${totalPortfolioValue.toFixed(2)}</p>
        </div>
        <div className="bg-zinc-800 border border-yellow-400 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total P/L</p>
          <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toFixed(2)}
          </p>
        </div>
        <div className="bg-zinc-800 border border-yellow-400 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Positions</p>
          <p className="text-white text-2xl font-bold">{holdings.length}</p>
        </div>
      </div>

      {/* Holdings Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading holdings...</div>
      ) : holdings.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl mb-2">No holdings yet</p>
          <p className="text-sm">Use the AI agent to buy your first stock!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead className="border-b-2 border-yellow-400">
              <tr>
                <th className="text-left py-3 px-4 text-yellow-400 font-bold">Ticker</th>
                <th className="text-right py-3 px-4 text-yellow-400 font-bold">Shares</th>
                <th className="text-right py-3 px-4 text-yellow-400 font-bold">Avg Cost</th>
                <th className="text-right py-3 px-4 text-yellow-400 font-bold">Current Price</th>
                <th className="text-right py-3 px-4 text-yellow-400 font-bold">Total Value</th>
                <th className="text-right py-3 px-4 text-yellow-400 font-bold">P/L</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, idx) => (
                <tr key={idx} className="border-b border-zinc-800 hover:bg-zinc-800 transition">
                  <td className="py-4 px-4 font-bold text-yellow-400 text-lg">{holding.ticker}</td>
                  <td className="text-right py-4 px-4">{holding.shares}</td>
                  <td className="text-right py-4 px-4">${holding.avgCost.toFixed(2)}</td>
                  <td className="text-right py-4 px-4">${holding.currentPrice.toFixed(2)}</td>
                  <td className="text-right py-4 px-4 font-semibold">${holding.totalValue.toFixed(2)}</td>
                  <td className={`text-right py-4 px-4 font-bold ${
                    holding.profitLossPercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {holding.profitLossPercent >= 0 ? '+' : ''}{holding.profitLossPercent.toFixed(2)}%
                    <div className="text-sm opacity-75">
                      {holding.profitLoss >= 0 ? '+' : ''}${holding.profitLoss.toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
