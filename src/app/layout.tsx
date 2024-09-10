import '@/styles/globals.css';
import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';

import { TRPCReactProvider } from '@/trpc/react';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';

import { ThemeProvider } from './_components/ThemeProvider';

// TODO: Create custom error page

export const metadata: Metadata = {
  title: 'ShopShare',
  description: 'Shopping list sharing app',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang='en'
      className={cn(GeistSans.variable, GeistMono.variable, 'bg-background')}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
