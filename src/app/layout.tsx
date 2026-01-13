import type { Metadata } from 'next';
import './globals.css';
import JsonLd from '@/components/JsonLd';

import VisitorTracker from '@/components/VisitorTracker';
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL('https://stallmb.com'),
  title: {
    default: 'StallMB - Connemara Uppfödning & Utbildning',
    template: '%s | StallMB',
  },
  description: 'StallMB i Töreboda bedriver uppfödning av den fantastiska rasen Connemara. Kvalitet, passion och tradition. Vi har avelsston, unghästar och hästar till salu.',
  keywords: ['Connemara', 'Uppfödning', 'Hästar till salu', 'Ponny', 'Töreboda', 'Avel', 'Unghästar', 'StallMB', 'Hästutbildning'],
  authors: [{ name: 'StallMB' }],
  creator: 'StallMB',
  publisher: 'StallMB',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'StallMB - Connemara Uppfödning & Utbildning',
    description: 'Kvalitetsuppfödning av Connemarahästar i Töreboda. Vi föder upp hållbara och trevliga individer för både tävling och fritid.',
    url: 'https://stallmb.com',
    siteName: 'StallMB',
    locale: 'sv_SE',
    type: 'website',
    images: [
      {
        url: '/assets/logo-round.png', // Fallback image
        width: 800,
        height: 600,
        alt: 'StallMB Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StallMB - Connemara Uppfödning',
    description: 'Uppfödning av Connemarahästar med fokus på prestation och temperament.',
    images: ['/assets/logo-round.png'], // Fallback image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>
        <JsonLd />
        <VisitorTracker />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
