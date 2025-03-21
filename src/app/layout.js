'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { initTelegramApp } from '@/lib/telegram';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export const metadata = {
  title: "Symol",
  description: "A cool app",
  icons: "/favicon.ico",
};

export default function RootLayout({ children }) {
  useEffect(() => {
    // Initialize Telegram Mini App
    initTelegramApp();
  }, []);

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href= "favicon.png"/>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body>
        <TonConnectUIProvider manifestUrl="https://your-app-domain.com/tonconnect-manifest.json">
          {children}
        </TonConnectUIProvider>
      </body>
    </html>
  );
}
