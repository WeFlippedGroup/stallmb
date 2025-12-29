import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StallMB - Connemara Uppfödning & Utbildning',
  description: 'StallMB i Töreboda bedriver uppfödning av den fantastiska rasen Connemara. Kvalitet, passion och tradition.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
