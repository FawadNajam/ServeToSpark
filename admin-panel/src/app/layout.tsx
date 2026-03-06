import type { Metadata } from 'next';
import './globals.css';
import type { ReactNode } from 'react';
import { Providers } from '@components/Providers';

export const metadata: Metadata = {
  title: 'On-Demand Service Admin',
  description: 'Admin dashboard for the on-demand service platform'
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

