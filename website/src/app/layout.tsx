import type { Metadata } from 'next';
import './globals.css';
import type { ReactNode } from 'react';
import { Providers } from '@components/Providers';

export const metadata: Metadata = {
  title: 'ServeToSpark — Book Services On Demand',
  description: 'Browse and book services from trusted providers.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
