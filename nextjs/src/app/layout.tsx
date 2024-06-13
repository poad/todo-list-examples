'use client';

import { Inter } from 'next/font/google';
import { isMobile } from 'react-device-detect';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DndProvider
          backend={isMobile ? TouchBackend : HTML5Backend}
          options={isMobile ? {
            scrollAngleRanges: [
              { start: 60, end: 120 },
              { start: 240, end: 300 },
            ],
          } : undefined}
        >{children}</DndProvider>
      </body>
    </html>
  );
}
