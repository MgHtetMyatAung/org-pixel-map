import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Silkscreen, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const silkscreen = Silkscreen({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pixel',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'PixelHQ — Pixel Art Virtual Company',
  description:
    'Explore a living 2D pixel-art company headquarters, visit department rooms, browse the visual org chart, and talk with teammates in a retro RPG office.',
  openGraph: {
    title: 'PixelHQ — Pixel Art Virtual Company',
    description:
      'Explore a living 2D pixel-art company headquarters, visit department rooms, browse the visual org chart, and talk with teammates in a retro RPG office.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PixelHQ — Pixel Art Virtual Company',
    description:
      'Explore a living 2D pixel-art company headquarters, visit department rooms, browse the visual org chart, and talk with teammates in a retro RPG office.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${silkscreen.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#14171F] text-[#F1F5F9] font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200"
      >
        {children}
      </body>
    </html>
  );
}
