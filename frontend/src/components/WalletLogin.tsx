'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authenticate, isSignedIn } from '@/lib/stacksAuth';

export default function WalletLogin() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isSignedIn()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleConnect = () => {
    setIsConnecting(true);
    authenticate();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-4xl w-full">
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-7xl md:text-8xl font-bold text-yellow-400 mb-6 tracking-tight">
            Stockify
          </h1>
          <p className="text-white text-xl md:text-2xl font-light">
            Bitcoin-Native Tokenized US Stocks on Stacks
          </p>
        </div>

        {/* Login Button */}
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xl px-16 py-6 rounded-lg transition-all shadow-lg hover:shadow-yellow-400/50 disabled:opacity-50 disabled:cursor-not-allowed mb-12"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet to Login'}
        </button>

        {/* Supported Wallets */}
        <div className="mt-12 text-white">
          <p className="text-sm opacity-70 mb-4">Supported Wallets:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="border-2 border-yellow-400 rounded-lg px-6 py-3">
              <span className="text-yellow-400 font-semibold">Hiro Wallet</span>
            </div>
            <div className="border-2 border-yellow-400 rounded-lg px-6 py-3">
              <span className="text-yellow-400 font-semibold">Leather</span>
            </div>
            <div className="border-2 border-yellow-400 rounded-lg px-6 py-3">
              <span className="text-yellow-400 font-semibold">Xverse</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 max-w-3xl mx-auto bg-yellow-400/10 border-2 border-yellow-400 rounded-lg p-8">
          <p className="text-yellow-400 text-base font-semibold mb-3">
            ⚠️ TESTNET ONLY
          </p>
          <p className="text-white text-sm leading-relaxed">
            This is a demonstration platform on Stacks testnet. Not for real securities trading.
            Tokenized securities are subject to applicable laws and regulations.
          </p>
        </div>
      </div>
    </div>
  );
}
