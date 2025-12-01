'use client'

import { useState, useEffect } from 'react'
import { Filter, Settings, UserCircle, LogOut } from 'lucide-react'
import Image from 'next/image'
import { ProtocolCard } from '@/components/ProtocolCard'
import { DetailPanel } from '@/components/DetailPanel'
import { AuthModal } from '@/components/AuthModal'
import { useProtocols } from '@/lib/hooks/useProtocols'
import { useAuth } from '@/lib/hooks/useAuth'
import type { Protocol } from '@/types'

export const dynamic = 'force-dynamic'

export default function Home() {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const { protocols, loading } = useProtocols()
  const { user, isSubscribed: userIsSubscribed, signOut } = useAuth()

  // Calculate the most recent update date from all protocols
  useEffect(() => {
    if (protocols.length > 0) {
      const mostRecent = protocols.reduce((latest, protocol) => {
        const protocolDate = new Date(protocol.last_updated)
        return protocolDate > latest ? protocolDate : latest
      }, new Date(protocols[0].last_updated))

      setLastUpdate(mostRecent.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }))
    } else {
      setLastUpdate(new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }))
    }
  }, [protocols])

  const handleProtocolClick = (protocol: Protocol) => {
    if (!isSubscribed) {
      setShowAuthModal(true)
      return
    }
    setSelectedProtocol(protocol)
  }

  const handleClosePanel = () => {
    setSelectedProtocol(null)
  }

  // Mask email with asterisks (show first 2 chars and last 2 chars)
  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@')
    if (name.length <= 4) {
      return name.charAt(0) + '*'.repeat(Math.max(1, name.length - 2)) + name.charAt(name.length - 1) + '@' + domain
    }
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1) + '@' + domain
  }

  const handleLogout = async () => {
    await signOut()
    setIsSubscribed(false)
  }

  return (
    <main className="min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Info */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo-anchor-white.png"
                alt="Starboard Analytics"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-xl font-display font-bold text-white tracking-wide">
                  Starboard Analytics
                </h1>
                <p className="text-[10px] text-text-secondary">
                  Primary market coverage for early-stage protocols
                </p>
              </div>
              {/* Flip Calendar Style Last Update */}
              <div className="ml-4 flex items-center gap-2">
                <span className="text-[10px] text-text-secondary uppercase tracking-wider">Last Update:</span>
                <div className="flex gap-1">
                  {lastUpdate.split('/').map((segment: string, index: number) => (
                    <div
                      key={index}
                      className="bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded px-2 py-1 shadow-lg"
                    >
                      <span className="text-sm font-bold text-white tracking-wider">
                        {segment}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              {/* User Profile or Login Button */}
              {user ? (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px]">
                  <span className="text-gray-500 font-mono">{maskEmail(user.email || '')}</span>
                  <button
                    onClick={handleLogout}
                    className="p-0.5 hover:bg-red-500/20 rounded transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3 h-3 text-gray-500 hover:text-red-400 transition-colors" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="p-2 hover:bg-surface-light rounded-lg transition-colors"
                  title="Sign In / Subscribe"
                >
                  <UserCircle className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                </button>
              )}

              {/* Filter Button */}
              <button
                className="p-2 hover:bg-surface-light rounded-lg transition-colors"
                title="Filter"
              >
                <Filter className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </button>

              {/* Settings Button */}
              <button
                className="p-2 hover:bg-surface-light rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-300 ${selectedProtocol ? 'mr-[50%]' : ''}`}>
        <div className="container mx-auto px-6 py-6">
          {/* Protocol Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading protocols...</div>
            </div>
          ) : (
            <div className={`grid gap-6 transition-all duration-300 ${
              selectedProtocol
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
            {protocols.map((protocol) => (
              <ProtocolCard
                key={protocol.id}
                protocol={protocol}
                onClick={() => handleProtocolClick(protocol)}
              />
            ))}
          </div>
        )}

          {protocols.length === 0 && !loading && (
            <div className="text-center py-12 text-text-secondary">
              No protocols found. Check back soon!
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <DetailPanel
        protocol={selectedProtocol}
        onClose={handleClosePanel}
        isOpen={!!selectedProtocol}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setIsSubscribed(true)
            setShowAuthModal(false)
          }}
        />
      )}
    </main>
  )
}
