import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Starboard Analytics - Primary Market Coverage for Crypto',
  description: 'Discretionary research on early-stage protocols. Track projects from seed fundraising through TGE for maximum airdrop returns.',
  keywords: 'crypto, airdrop, analytics, primary market, TGE, protocol research',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
