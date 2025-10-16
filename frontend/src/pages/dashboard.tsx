import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import AgentChat from '@/components/AgentChat';
import PortfolioHoldings from '@/components/PortfolioHoldings';
import TransactionHistory from '@/components/TransactionHistory';
import { isSignedIn, getUserData } from '@/lib/stacksAuth';

export default function Dashboard() {
  const router = useRouter();
  const [userAddress, setUserAddress] = useState('');
  const [context, setContext] = useState({});

  useEffect(() => {
    if (!isSignedIn()) {
      router.push('/');
      return;
    }

    try {
      const userData = getUserData();
      if (userData && userData.profile && userData.profile.stxAddress) {
        const address = userData.profile.stxAddress.testnet;
        setUserAddress(address);
        setContext({ userAddress: address });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      router.push('/');
    }
  }, [router]);

  if (!userAddress) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI Trading Agent */}
          <div>
            <AgentChat userAddress={userAddress} context={context} />
          </div>

          {/* Portfolio Holdings */}
          <div>
            <PortfolioHoldings userAddress={userAddress} />
          </div>
        </div>

        {/* Transaction History */}
        <div className="mb-8">
          <TransactionHistory userAddress={userAddress} />
        </div>
      </main>
    </div>
  );
}
