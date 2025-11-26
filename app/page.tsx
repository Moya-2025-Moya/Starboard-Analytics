'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
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
  const { protocols, loading } = useProtocols()

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
      <Header
        isSubscribed={isSubscribed}
        onAuthClick={() => setShowAuthModal(true)}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8 mt-4">
          <h1 className="text-3xl font-bold mb-2 text-white">
            Starboard Analytics
          </h1>
          <p className="text-text-secondary text-sm">
            Primary market coverage for early-stage protocols
          </p>
        </div>

        {/* Protocol Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-text-secondary">Loading protocols...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Stats Footer */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{protocols.length}</div>
              <div className="text-xs text-text-secondary">Active Protocols</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-xs text-text-secondary">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">Early</div>
              <div className="text-xs text-text-secondary">Entry Focus</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedProtocol && (
        <DetailPanel
          protocol={selectedProtocol}
          onClose={handleClosePanel}
        />
      )}

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
