'use client'

import { TrendingUp, Shield, DollarSign, Calendar } from 'lucide-react'
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
  return (
    <div
      onClick={onClick}
      className="glass rounded-xl p-6 cursor-pointer border border-border hover:border-white/30 transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {protocol.logo_url ? (
            <img
              src={protocol.logo_url}
              alt={protocol.name}
              className="w-12 h-12 rounded-lg"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-surface-light flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {protocol.name[0]}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg">{protocol.name}</h3>
            <span className="text-xs text-text-secondary uppercase tracking-wide">
              {protocol.category}
            </span>
          </div>
        </div>

        {protocol.is_featured && (
          <div className="px-2 py-1 rounded bg-white/10 text-white text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
        {protocol.short_description}
      </p>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-xs text-text-secondary">Score</div>
            <div className="font-bold text-sm">{protocol.ranking_score}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Shield className={`w-4 h-4 ${riskColors[protocol.risk_level]}`} />
          <div>
            <div className="text-xs text-text-secondary">Risk</div>
            <div className={`font-bold text-sm capitalize ${riskColors[protocol.risk_level]}`}>
              {protocol.risk_level}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-xs text-text-secondary">Raised</div>
            <div className="font-bold text-sm">
              ${(protocol.total_raised_usd / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-xs text-text-secondary">Stage</div>
            <div className="font-bold text-sm">
              {stageBadges[protocol.stage]}
            </div>
          </div>
        </div>
      </div>

      {/* Airdrop Probability */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary">Airdrop Probability</span>
          <span className="font-medium">{protocol.airdrop_probability}%</span>
        </div>
        <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gray-400 to-white transition-all duration-500"
            style={{ width: `${protocol.airdrop_probability}%` }}
          />
        </div>
      </div>

      {/* Lead Investors */}
      {protocol.lead_investors.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="text-xs text-text-secondary mb-2">Lead Investors</div>
          <div className="flex flex-wrap gap-2">
            {protocol.lead_investors.slice(0, 2).map((investor) => (
              <span
                key={investor}
                className="px-2 py-1 rounded bg-surface-light text-xs"
              >
                {investor}
              </span>
            ))}
            {protocol.lead_investors.length > 2 && (
              <span className="px-2 py-1 rounded bg-surface-light text-xs text-text-secondary">
                +{protocol.lead_investors.length - 2}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
