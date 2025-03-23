import Script from 'next/script';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: "Symol",
  description: "A cool app",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
