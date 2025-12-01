'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ExternalLink, TrendingUp, AlertTriangle, Target, LogOut, GripVertical } from 'lucide-react'
import type { Protocol } from '@/types'

interface DetailPanelProps {
  protocol: Protocol | null
  onClose: () => void
  isOpen: boolean
}

export function DetailPanel({ protocol, onClose, isOpen }: DetailPanelProps) {
  const [width, setWidth] = useState(50) // percentage
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100
      setWidth(Math.max(30, Math.min(70, newWidth))) // Min 30%, max 70%
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  if (!isOpen || !protocol) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full bg-black/95 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto animate-slide-in flex"
        style={{ width: `${width}%` }}
      >
        {/* Resize Handle */}
        <div
          className="absolute left-0 top-0 h-full w-1 hover:w-2 bg-border/50 hover:bg-white/30 cursor-ew-resize transition-all flex items-center justify-center group"
          onMouseDown={() => setIsResizing(true)}
        >
          <div className="absolute left-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-white/50" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-surface/95 backdrop-blur-xl border-b border-border p-6 flex items-center justify-between z-10">
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
              <h2 className="text-2xl font-bold">{protocol.name}</h2>
              <p className="text-text-secondary text-sm uppercase tracking-wide">
                {protocol.category}
              </p>
            </div>
          </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-light rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-lg p-4">
              <div className="text-text-secondary text-sm mb-1">Risk Level</div>
              <div className="text-2xl font-bold text-white uppercase">
                {protocol.risk_level}
              </div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-text-secondary text-sm mb-1">Total Raised</div>
              <div className="text-2xl font-bold text-white">
                ${(protocol.total_raised_usd / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>

          {/* Description */}
          <section>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-400" />
              Overview
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {protocol.short_description}
            </p>
          </section>

          {/* Detailed Analysis */}
          {protocol.detailed_analysis && (
            <section className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">Deep Dive Analysis</h3>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {protocol.detailed_analysis}
              </p>
            </section>
          )}

          {/* Due Diligence Grades */}
          <section>
            <h3 className="text-lg font-bold mb-4">Due Diligence Breakdown</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="glass rounded-lg p-4 text-center">
                <div className="text-text-secondary text-xs mb-2">Founding Team</div>
                <div className="text-4xl font-bold text-white">
                  {protocol.founding_team_grade}
                </div>
              </div>

              <div className="glass rounded-lg p-4 text-center">
                <div className="text-text-secondary text-xs mb-2">VC Track Record</div>
                <div className="text-4xl font-bold text-white">
                  {protocol.vc_track_record_grade}
                </div>
              </div>

              <div className="glass rounded-lg p-4 text-center">
                <div className="text-text-secondary text-xs mb-2">Business Model</div>
                <div className="text-4xl font-bold text-white">
                  {protocol.business_model_grade}
                </div>
              </div>
            </div>
          </section>

          {/* Strategy */}
          <div className="grid md:grid-cols-2 gap-4">
            {protocol.entry_strategy && (
              <section className="glass rounded-xl p-5">
                <h3 className="text-md font-bold mb-3 flex items-center gap-2 text-white">
                  <Target className="w-4 h-4" />
                  Entry Strategy
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {protocol.entry_strategy}
                </p>
              </section>
            )}

            {protocol.exit_strategy && (
              <section className="glass rounded-xl p-5">
                <h3 className="text-md font-bold mb-3 flex items-center gap-2 text-white">
                  <LogOut className="w-4 h-4" />
                  Exit Strategy
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {protocol.exit_strategy}
                </p>
              </section>
            )}
          </div>

          {/* Risk Factors */}
          {protocol.risk_factors && protocol.risk_factors.length > 0 && (
            <section className="glass rounded-xl p-5 border border-red-500/20">
              <h3 className="text-md font-bold mb-3 flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-4 h-4" />
                Risk Factors
              </h3>
              <ul className="space-y-2">
                {protocol.risk_factors.map((risk, index) => (
                  <li key={index} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Lead Investors */}
          <section>
            <h3 className="text-lg font-bold mb-3">Lead Investors</h3>
            <div className="flex flex-wrap gap-2">
              {protocol.lead_investors.map((investor) => (
                <span
                  key={investor}
                  className="px-4 py-2 rounded-lg glass font-medium"
                >
                  {investor}
                </span>
              ))}
            </div>
          </section>

          {/* Links */}
          <section>
            <h3 className="text-lg font-bold mb-3">Resources</h3>
            <div className="flex flex-wrap gap-3">
              {protocol.website_url && (
                <a
                  href={protocol.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-surface-light transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
              {protocol.twitter_url && (
                <a
                  href={protocol.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-surface-light transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Twitter</span>
                </a>
              )}
              {protocol.discord_url && (
                <a
                  href={protocol.discord_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-surface-light transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Discord</span>
                </a>
              )}
            </div>
          </section>

            {/* Metadata */}
            <div className="text-xs text-text-secondary pt-4 border-t border-border">
              Last updated: {new Date(protocol.last_updated).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
