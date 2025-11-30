import type { Metadata } from 'next'
import { Inter, Orbitron, Space_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono'
})

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
      <body className={`${inter.variable} ${orbitron.variable} ${spaceMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
