import type { Metadata } from 'next';
import './globals.css';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'Instagram',
  description: 'Instagram Clone - Share photos and videos with friends',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="ltr">
      <body className="bg-white text-gray-900 min-h-screen pb-20">
        <main className="max-w-[430px] mx-auto min-h-screen bg-white">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}

