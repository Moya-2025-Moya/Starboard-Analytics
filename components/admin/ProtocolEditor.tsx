'use client'

import { useState, useEffect } from 'react'
import { X, Eye, Save, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { ProtocolCard } from '@/components/ProtocolCard'
import type { Protocol, Category, ProtocolStage, RiskLevel } from '@/types'

interface ProtocolEditorProps {
  protocolId: string | null
  onClose: () => void
  onSave: () => void
}

export function ProtocolEditor({ protocolId, onClose, onSave }: ProtocolEditorProps) {
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState<Partial<Protocol>>({
    name: '',
    category: 'infrastructure',
    stage: 'seed',
    risk_level: 'medium',
    ranking_score: 0,
    total_raised_usd: 0,
    lead_investors: [],
    founding_team_score: 0,
    vc_track_record_score: 0,
    business_model_score: 0,
    airdrop_probability: 0,
    short_description: '',
    detailed_analysis: '',
    entry_strategy: '',
    exit_strategy: '',
    website_url: '',
    twitter_url: '',
    discord_url: '',
    is_featured: false,
    risk_factors: [],
  })

  const [investorInput, setInvestorInput] = useState('')
  const [riskFactorInput, setRiskFactorInput] = useState('')

  useEffect(() => {
    if (protocolId) {
      loadProtocol()
    }
  }, [protocolId])

  async function loadProtocol() {
    if (!protocolId) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('protocols')
        .select('*')
        .eq('id', protocolId)
        .single()

      if (error) throw error
      setFormData(data)
    } catch (error) {
      console.error('Error loading protocol:', error)
      alert('Failed to load protocol')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setLoading(true)
    try {
      if (protocolId) {
        // Update existing
        const { error } = await supabase
          .from('protocols')
          .update(formData)
          .eq('id', protocolId)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('protocols')
          .insert([formData])

        if (error) throw error
      }

      alert('Protocol saved successfully!')
      onSave()
    } catch (error) {
      console.error('Error saving protocol:', error)
      alert('Failed to save protocol')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!protocolId) return
    if (!confirm('Are you sure you want to delete this protocol?')) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('protocols')
        .delete()
        .eq('id', protocolId)

      if (error) throw error

      alert('Protocol deleted successfully!')
      onSave()
    } catch (error) {
      console.error('Error deleting protocol:', error)
      alert('Failed to delete protocol')
    } finally {
      setLoading(false)
    }
  }

  const addInvestor = () => {
    if (investorInput.trim()) {
      setFormData({
        ...formData,
        lead_investors: [...(formData.lead_investors || []), investorInput.trim()]
      })
      setInvestorInput('')
    }
  }

  const removeInvestor = (index: number) => {
    setFormData({
      ...formData,
      lead_investors: formData.lead_investors?.filter((_, i) => i !== index)
    })
  }

  const addRiskFactor = () => {
    if (riskFactorInput.trim()) {
      setFormData({
        ...formData,
        risk_factors: [...(formData.risk_factors || []), riskFactorInput.trim()]
      })
      setRiskFactorInput('')
    }
  }

  const removeRiskFactor = (index: number) => {
    setFormData({
      ...formData,
      risk_factors: formData.risk_factors?.filter((_, i) => i !== index)
    })
  }

  const previewProtocol: Protocol = {
    id: protocolId || 'preview',
    name: formData.name || 'Untitled Protocol',
    category: formData.category || 'infrastructure',
    stage: formData.stage || 'seed',
    risk_level: formData.risk_level || 'medium',
    ranking_score: formData.ranking_score || 0,
    total_raised_usd: formData.total_raised_usd || 0,
    lead_investors: formData.lead_investors || [],
    founding_team_score: formData.founding_team_score || 0,
    vc_track_record_score: formData.vc_track_record_score || 0,
    business_model_score: formData.business_model_score || 0,
    strategy_forecast: formData.strategy_forecast || '',
    airdrop_probability: formData.airdrop_probability || 0,
    short_description: formData.short_description || '',
    detailed_analysis: formData.detailed_analysis,
    entry_strategy: formData.entry_strategy,
    exit_strategy: formData.exit_strategy,
    website_url: formData.website_url,
    twitter_url: formData.twitter_url,
    discord_url: formData.discord_url,
    risk_factors: formData.risk_factors,
    is_featured: formData.is_featured || false,
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">
            {protocolId ? 'Edit Protocol' : 'New Protocol'}
          </h2>
          <p className="text-sm text-text-secondary font-mono mt-1">
            Fill in the details below to create or update a protocol
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-surface-light transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-mono">{showPreview ? 'Hide' : 'Show'} Preview</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-light rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-6 glass rounded-xl p-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold">Basic Information</h3>

            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">
                Protocol Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                placeholder="Aethir Network"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-text-secondary mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                >
                  <option value="defi">DeFi</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="gaming">Gaming</option>
                  <option value="nft">NFT</option>
                  <option value="dao">DAO</option>
                  <option value="layer1">Layer1</option>
                  <option value="layer2">Layer2</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-mono text-text-secondary mb-2">
                  Stage *
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value as ProtocolStage })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                >
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="series-b">Series B</option>
                  <option value="pre-tge">Pre-TGE</option>
                  <option value="tge">TGE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">
                Short Description *
              </label>
              <textarea
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono text-sm"
                placeholder="Brief description of the protocol..."
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">
                Detailed Analysis
              </label>
              <textarea
                value={formData.detailed_analysis}
                onChange={(e) => setFormData({ ...formData, detailed_analysis: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono text-sm"
                placeholder="In-depth analysis for premium users..."
              />
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-display font-bold">Metrics & Scores</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-text-secondary mb-2">
                  Ranking Score
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.ranking_score}
                  onChange={(e) => setFormData({ ...formData, ranking_score: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-text-secondary mb-2">
                  Risk Level
                </label>
                <select
                  value={formData.risk_level}
                  onChange={(e) => setFormData({ ...formData, risk_level: e.target.value as RiskLevel })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-mono text-text-secondary mb-2">
                  Total Raised (USD)
                </label>
                <input
                  type="number"
                  value={formData.total_raised_usd}
                  onChange={(e) => setFormData({ ...formData, total_raised_usd: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                  placeholder="25000000"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-text-secondary mb-2">
                  Airdrop Probability (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.airdrop_probability}
                  onChange={(e) => setFormData({ ...formData, airdrop_probability: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-text-secondary mb-2">
                  Founding Team Score
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.founding_team_score}
                  onChange={(e) => setFormData({ ...formData, founding_team_score: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-text-secondary mb-2">
                  VC Track Record Score
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.vc_track_record_score}
                  onChange={(e) => setFormData({ ...formData, vc_track_record_score: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-text-secondary mb-2">
                  Business Model Score
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.business_model_score}
                  onChange={(e) => setFormData({ ...formData, business_model_score: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-mono">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Featured Protocol
                </label>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-display font-bold">Links</h3>

            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono text-sm"
                placeholder="https://protocol.com"
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">
                Twitter URL
              </label>
              <input
                type="url"
                value={formData.twitter_url}
                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono text-sm"
                placeholder="https://twitter.com/protocol"
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">
                Discord URL
              </label>
              <input
                type="url"
                value={formData.discord_url}
                onChange={(e) => setFormData({ ...formData, discord_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono text-sm"
                placeholder="https://discord.gg/protocol"
              />
            </div>
          </div>

          {/* Investors */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-display font-bold">Lead Investors</h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={investorInput}
                onChange={(e) => setInvestorInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addInvestor()}
                className="flex-1 px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono text-sm"
                placeholder="Framework Ventures"
              />
              <button
                onClick={addInvestor}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors font-mono text-sm"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.lead_investors?.map((investor, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-light">
                  <span className="text-sm font-mono">{investor}</span>
                  <button
                    onClick={() => removeInvestor(index)}
                    className="text-text-secondary hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-display font-bold">Risk Factors</h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={riskFactorInput}
                onChange={(e) => setRiskFactorInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRiskFactor()}
                className="flex-1 px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono text-sm"
                placeholder="Untested consensus mechanism"
              />
              <button
                onClick={addRiskFactor}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors font-mono text-sm"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {formData.risk_factors?.map((risk, index) => (
                <div key={index} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-surface-light">
                  <span className="text-sm font-mono flex-1">{risk}</span>
                  <button
                    onClick={() => removeRiskFactor(index)}
                    className="text-text-secondary hover:text-white mt-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-display font-bold">Strategy</h3>

            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">
                Entry Strategy
              </label>
              <textarea
                value={formData.entry_strategy}
                onChange={(e) => setFormData({ ...formData, entry_strategy: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono text-sm"
                placeholder="Recommended entry approach..."
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">
                Exit Strategy
              </label>
              <textarea
                value={formData.exit_strategy}
                onChange={(e) => setFormData({ ...formData, exit_strategy: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono text-sm"
                placeholder="Recommended exit approach..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div>
              {protocolId && (
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-mono">Delete</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-lg glass hover:bg-surface-light transition-colors disabled:opacity-50 font-mono text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-50 font-mono text-sm"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Protocol'}
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold">Card Preview</h3>
            <div className="max-w-md">
              <ProtocolCard
                protocol={previewProtocol}
                onClick={() => {}}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
