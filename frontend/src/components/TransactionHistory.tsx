'use client';

import { useState, useEffect } from 'react';
import { getTransactionHistory } from '@/lib/stacksClient';

interface Transaction {
  txId: string;
  txHash: string;
  ticker: string;
  shares: number;
  price: number;
  total: number;
  action: 'BUY' | 'SELL';
  asset: 'STX' | 'sBTC';
  timestamp: number;
  status: 'confirmed' | 'pending';
}

interface TransactionHistoryProps {
  userAddress: string;
}

export default function TransactionHistory({ userAddress }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadTransactions, 30000);
    return () => clearInterval(interval);
  }, [userAddress]);

  const loadTransactions = async () => {
    try {
      const data = await getTransactionHistory(userAddress);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border-2 border-yellow-400 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-yellow-400 text-2xl font-bold">📜 Transaction History</h2>
        <button
          onClick={loadTransactions}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl mb-2">No transactions yet</p>
          <p className="text-sm">Your trading history will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, idx) => (
            <div key={idx} className="bg-zinc-800 border border-yellow-400 rounded-lg p-4 hover:bg-zinc-700 transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Transaction Details */}
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded font-bold text-sm ${
                    tx.action === 'BUY' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                  }`}>
                    {tx.action}
                  </div>
                  
                  <div>
                    <p className="text-white font-bold text-lg">
                      {tx.ticker} - {tx.shares} shares @ ${tx.price.toFixed(2)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Total: {tx.total.toFixed(6)} {tx.asset}
                    </p>
                  </div>
                </div>

                {/* Right: Hash & Status */}
                <div className="text-left md:text-right">
                  <div className="flex items-center justify-start md:justify-end gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      tx.status === 'confirmed' 
                        ? 'bg-green-500 text-black' 
                        : 'bg-yellow-400 text-black'
                    }`}>
                      {tx.status === 'confirmed' ? '✓ CONFIRMED' : '⏳ PENDING'}
                    </span>
                  </div>
                  
                  {/* Transaction hash with Explorer link */}
                  <a
                    href={`https://explorer.hiro.so/txid/${tx.txHash}?chain=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:text-yellow-300 text-sm underline break-all"
                  >
                    {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-6)}
                  </a>
                  
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(tx.timestamp * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
