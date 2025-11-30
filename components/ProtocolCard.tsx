'use client'

import { TrendingUp, Layers, Wallet, Clock, ExternalLink, Twitter, X } from 'lucide-react'
import type { Protocol } from '@/types'

interface ProtocolCardProps {
  protocol: Protocol
  onClick: () => void
}

const stageBadges = {
  seed: 'Seed',
  'series-a': 'Series A',
  'series-b': 'Series B',
  'pre-tge': 'Pre-TGE',
  tge: 'TGE',
}

export function ProtocolCard({ protocol, onClick }: ProtocolCardProps) {
  const handleLinkClick = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation()
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      onClick={onClick}
      className="glass rounded-xl p-6 cursor-pointer border border-border hover:border-white/30 transition-all duration-300 hover:scale-[1.01] relative"
    >
      {/* Header - No Logo, just text */}
      <div className="flex items-start justify-between mb-4">
        {/* Name and Category */}
        <div className="flex-1">
          <h3 className="font-display text-base font-bold tracking-wide leading-tight mb-1">
            {protocol.name}
          </h3>
          <span className="text-xs text-text-secondary uppercase tracking-widest">
            {protocol.category}
          </span>
        </div>

        {/* Link Icons - X and Website */}
        <div className="flex items-center gap-1">
          {protocol.website_url && (
            <button
              onClick={(e) => handleLinkClick(e, protocol.website_url)}
              className="p-1.5 hover:bg-surface-light rounded-lg transition-colors"
              title="Official Website"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
            </button>
          )}
          {protocol.twitter_url && (
            <button
              onClick={(e) => handleLinkClick(e, protocol.twitter_url)}
              className="p-1.5 hover:bg-surface-light rounded-lg transition-colors"
              title="Twitter"
            >
              <Twitter className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
            className="p-1.5 hover:bg-surface-light rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">
        {protocol.short_description}
      </p>

      {/* Metrics - Clean 2x2 Grid Layout */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-4">
        {/* Raised */}
        <div className="flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div>
            <div className="text-xs text-text-secondary">Raised</div>
            <div className="text-sm font-mono text-white">${(protocol.total_raised_usd / 1000000).toFixed(1)}M</div>
          </div>
        </div>

        {/* Stage */}
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <div>
            <div className="text-xs text-text-secondary">Stage</div>
            <div className="text-sm font-mono text-white">{stageBadges[protocol.stage]}</div>
          </div>
        </div>

        {/* Expected Costs */}
        <div className="flex items-center gap-3">
          <Wallet className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <div>
            <div className="text-xs text-text-secondary">Expected</div>
            <div className="text-sm font-mono text-white">${protocol.expected_costs || 30}</div>
          </div>
        </div>

        {/* Listed For */}
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <div>
            <div className="text-xs text-text-secondary">Listed</div>
            <div className="text-sm font-mono text-white">{protocol.listed_days || 3} Days</div>
          </div>
        </div>
      </div>

      {/* What to do */}
      <div className="mb-4 pt-4 border-t border-border/30">
        <div className="text-xs text-text-secondary mb-2">What to do</div>
        <div className="flex flex-wrap gap-2">
          {(protocol.tasks || ['Daily Check-in', 'Staking', 'Social Tasks']).map((task, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded bg-surface-light text-xs"
            >
              {task}
            </span>
          ))}
        </div>
      </div>

      {/* Lead Investors */}
      {protocol.lead_investors.length > 0 && (
        <div className="mb-4 pt-4 border-t border-border/30">
          <div className="text-xs text-text-secondary mb-2">Lead Investors</div>
          <div className="flex flex-wrap gap-2">
            {protocol.lead_investors.map((investor) => (
              <span
                key={investor}
                className="px-3 py-1 rounded bg-surface-light text-xs"
              >
                {investor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Chains */}
      {protocol.chains && protocol.chains.length > 0 && (
        <div className="pt-4 border-t border-border/30">
          <div className="text-xs text-text-secondary mb-2">Chains</div>
          <div className="flex flex-wrap gap-2">
            {protocol.chains.map((chain) => (
              <span
                key={chain}
                className="px-3 py-1 rounded bg-surface-light text-xs"
              >
                {chain}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
