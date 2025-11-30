'use client'

import { DollarSign, Calendar, ExternalLink, Twitter, X } from 'lucide-react'
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
      {/* Header with Logo */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {/* Logo */}
          {protocol.logo_url ? (
            <img
              src={protocol.logo_url}
              alt={protocol.name}
              className="w-12 h-12 rounded-lg flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-surface-light flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white font-display">
                {protocol.name[0]}
              </span>
            </div>
          )}

          {/* Name and Category */}
          <div className="flex-1">
            <h3 className="font-display text-base font-bold tracking-wide leading-tight mb-1">
              {protocol.name}
            </h3>
            <span className="text-xs text-text-secondary uppercase tracking-widest">
              {protocol.category}
            </span>
          </div>
        </div>

        {/* Link Icons */}
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
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">
        {protocol.short_description}
      </p>

      {/* Metrics - Matching your design */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Raised */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-text-secondary">Raised</span>
          </div>
          <div className="text-base font-bold">${(protocol.total_raised_usd / 1000000).toFixed(1)}M</div>
        </div>

        {/* Stage */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-text-secondary">Stage</span>
          </div>
          <div className="text-base font-bold">{stageBadges[protocol.stage]}</div>
        </div>

        {/* Expected Costs */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-text-secondary">Expected Costs</span>
          </div>
          <div className="text-base font-bold">${protocol.expected_costs || 30}</div>
        </div>

        {/* Listed For */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-text-secondary">Listed For</span>
          </div>
          <div className="text-base font-bold">{protocol.listed_days || 3} Days</div>
        </div>
      </div>

      {/* What to do */}
      <div className="mb-4">
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
        <div className="pt-4 border-t border-border/30">
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
    </div>
  )
}
