'use client';

import { useState, useEffect } from 'react';
import { signOut, getUserData } from '@/lib/stacksAuth';

export default function Header() {
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    try {
      const userData = getUserData();
      if (userData && userData.profile && userData.profile.stxAddress) {
        setUserAddress(userData.profile.stxAddress.testnet);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }, []);

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="bg-black border-b-2 border-yellow-400 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <h1 className="text-yellow-400 text-3xl font-bold">Stockify</h1>
          <span className="text-white text-xs bg-yellow-400/20 border border-yellow-400 px-3 py-1 rounded">
            TESTNET
          </span>
        </div>

        {/* Wallet Address & Logout */}
        <div className="flex items-center gap-4">
          <div className="text-white text-sm hidden md:block">
            <span className="text-yellow-400 mr-2">●</span>
            {userAddress ? `${userAddress.slice(0, 8)}...${userAddress.slice(-6)}` : 'Loading...'}
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
