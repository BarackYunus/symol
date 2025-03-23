'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useEffect } from 'react';
import { initTelegramApp } from '@/lib/telegram';

export default function Providers({ children }) {
  useEffect(() => {
    try {
      // Initialize Telegram Mini App
      initTelegramApp();
    } catch (error) {
      console.error('Failed to initialize Telegram app:', error);
    }
  }, []);

  return (
    <TonConnectUIProvider manifestUrl={process.env.NEXT_PUBLIC_TON_MANIFEST_URL || '/tonconnect-manifest.json'}>
      {children}
    </TonConnectUIProvider>
  );
} 