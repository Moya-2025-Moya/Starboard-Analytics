'use client'

import { Anchor, LogIn } from 'lucide-react'

interface HeaderProps {
  isSubscribed: boolean
  onAuthClick: () => void
}

export function Header({ isSubscribed, onAuthClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3">
          <img
            src="/logo-anchor-white.png"
            alt="Starboard Analytics"
            className="w-10 h-10"
          />
          <span className="font-bold text-xl tracking-wide" style={{ fontFamily: 'monospace' }}>
            STARBOARD
          </span>
        </div>

        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Research
          </a>
          {isSubscribed ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-medium">Premium</span>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium">Subscribe</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
