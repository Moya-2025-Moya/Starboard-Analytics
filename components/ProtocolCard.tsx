'use client'

import { TrendingUp, Shield, DollarSign, Calendar, ExternalLink, Twitter } from 'lucide-react'
import type { Protocol } from '@/types'

interface ProtocolCardProps {
  protocol: Protocol
  onClick: () => void
}

const riskColors = {
  low: 'text-gray-400',
  medium: 'text-gray-300',
  high: 'text-white',
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
      className="glass rounded-xl p-5 cursor-pointer border border-border hover:border-white/30 transition-all duration-300 hover:scale-[1.01]"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-bold tracking-wide mb-1">{protocol.name}</h3>
          <span className="text-xs text-text-secondary uppercase tracking-widest font-mono">
            {protocol.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">
        {protocol.short_description}
      </p>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-gray-500" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-text-secondary font-mono">Raised</span>
            <span className="font-bold font-mono">${(protocol.total_raised_usd / 1000000).toFixed(1)}M</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-gray-500" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-text-secondary font-mono">Stage</span>
            <span className="font-bold font-mono text-xs">{stageBadges[protocol.stage]}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-text-secondary font-mono">Score</span>
            <span className="font-bold font-mono">{protocol.ranking_score}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Shield className={`w-3.5 h-3.5 ${riskColors[protocol.risk_level]}`} />
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-text-secondary font-mono">Risk</span>
            <span className={`font-bold font-mono text-xs capitalize ${riskColors[protocol.risk_level]}`}>
              {protocol.risk_level}
            </span>
          </div>
        </div>
      </div>

      {/* Airdrop Probability */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary font-mono">Airdrop Probability</span>
          <span className="font-bold font-mono">{protocol.airdrop_probability}%</span>
        </div>
        <div className="w-full h-1.5 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gray-500 to-white transition-all duration-500"
            style={{ width: `${protocol.airdrop_probability}%` }}
          />
        </div>
      </div>

      {/* Lead Investors */}
      {protocol.lead_investors.length > 0 && (
        <div className="pt-3 border-t border-border/30">
          <div className="text-xs text-text-secondary mb-2 font-mono">Lead Investors</div>
          <div className="flex flex-wrap gap-1.5">
            {protocol.lead_investors.slice(0, 2).map((investor) => (
              <span
                key={investor}
                className="px-2 py-0.5 rounded bg-surface-light text-xs font-mono"
              >
                {investor}
              </span>
            ))}
            {protocol.lead_investors.length > 2 && (
              <span className="px-2 py-0.5 rounded bg-surface-light text-xs text-text-secondary font-mono">
                +{protocol.lead_investors.length - 2}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
