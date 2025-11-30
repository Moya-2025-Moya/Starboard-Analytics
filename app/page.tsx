'use client'

import { useState, useEffect } from 'react'
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
    <main className="min-h-screen flex flex-col">
      <Header
        isSubscribed={isSubscribed}
        onAuthClick={() => setShowAuthModal(true)}
      />

      <div className={`container mx-auto px-4 py-8 transition-all duration-300 ${selectedProtocol ? 'max-w-full pr-0' : 'max-w-7xl'}`}>
        {/* Hero Section */}
        <div className="text-center mb-8 mt-6">
          <h1 className="text-4xl font-display font-bold mb-3 text-white tracking-wide">
            Starboard Analytics
          </h1>
          <p className="text-text-secondary text-sm mb-4">
            Primary market coverage for early-stage protocols
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border border-border/50">
            <span className="text-xs text-text-secondary font-mono uppercase tracking-wider">Last Update</span>
            <span className="text-sm font-mono font-bold text-white">
              {lastUpdate || 'Loading...'}
            </span>
          </div>
        </div>

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
