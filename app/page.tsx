'use client'

import { useState, useEffect } from 'react'
import { Filter, Settings, Anchor } from 'lucide-react'
import { ProtocolCard } from '@/components/ProtocolCard'
import { DetailPanel } from '@/components/DetailPanel'
import { AuthModal } from '@/components/AuthModal'
import { useProtocols } from '@/lib/hooks/useProtocols'
import type { Protocol } from '@/types'

export const dynamic = 'force-dynamic'

export default function Home() {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const { protocols, loading } = useProtocols()

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

  return (
    <main className="min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Info */}
            <div className="flex items-center gap-3">
              <Anchor className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-xl font-display font-bold text-white tracking-wide">
                  Starboard Analytics
                </h1>
                <p className="text-xs text-text-secondary">
                  Primary market coverage for early-stage protocols
                </p>
              </div>
              <div className="ml-4 px-3 py-1 rounded-lg glass border border-border/50">
                <span className="text-xs text-text-secondary font-mono">Last Update: </span>
                <span className="text-xs font-mono font-bold text-white">
                  {lastUpdate || 'Loading...'}
                </span>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Logo/Subscribe Button */}
              <button
                onClick={() => setShowAuthModal(true)}
                className="p-2 hover:bg-surface-light rounded-lg transition-colors"
                title="Subscribe"
              >
                <Anchor className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </button>

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

      <div className={`container mx-auto px-6 py-6 transition-all duration-300 ${selectedProtocol ? 'max-w-full pr-0' : 'max-w-7xl'}`}>

        {/* Protocol Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-text-secondary">Loading protocols...</div>
          </div>
        ) : (
          <div className={`grid gap-6 transition-all duration-300 ${
            selectedProtocol
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
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
