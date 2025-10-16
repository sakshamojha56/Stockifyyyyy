import { useEffect } from 'react';
import { useRouter } from 'next/router';
import WalletLogin from '@/components/WalletLogin';
import { isSignedIn } from '@/lib/stacksAuth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn()) {
      router.push('/dashboard');
    }
  }, [router]);

  return <WalletLogin />;
}
