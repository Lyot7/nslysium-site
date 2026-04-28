import type { Metadata } from 'next'
import { Fraunces, DM_Sans } from 'next/font/google'
import './globals.css'
import Header from './_components/Header'
import Footer from './_components/Footer'
import GridBackground from './_components/GridBackground'


const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'NSLysium — Votre assistant de vie, enfin centralisé',
  description:
    'NSLysium centralise sport, nutrition, sommeil et organisation en une interface unifiée pilotée par voix. Reach Your Elysium.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col">
        <GridBackground />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
