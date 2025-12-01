'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Eye, Save, Trash2, Upload, GripVertical } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { ProtocolCard } from '@/components/ProtocolCard'
import type { Protocol, Category, ProtocolStage, RiskLevel, GradeLevel } from '@/types'

interface ProtocolEditorProps {
  protocolId: string | null
  onClose: () => void
  onSave: () => void
}

interface ImageItem {
  id: string
  base64: string
  name: string
}

export function ProtocolEditor({ protocolId, onClose, onSave }: ProtocolEditorProps) {
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [images, setImages] = useState<ImageItem[]>([])
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [formData, setFormData] = useState<Partial<Protocol>>({
    name: '',
    category: 'infrastructure',
    stage: 'seed',
    risk_level: 'medium',
    total_raised_usd: 0,
    lead_investors: [],
    founding_team_grade: 'A',
    vc_track_record_grade: 'A',
    business_model_grade: 'A',
    short_description: '',
    detailed_analysis: '',
    entry_strategy: '',
    exit_strategy: '',
    website_url: '',
    twitter_url: '',
    discord_url: '',
    is_featured: false,
    risk_factors: [],
    expected_costs: 30,
    tasks: ['Daily Check-in', 'Staking', 'Social Tasks'],
    chains: [],
  })

  const [investorInput, setInvestorInput] = useState('')
  const [riskFactorInput, setRiskFactorInput] = useState('')
  const [taskInput, setTaskInput] = useState('')
  const [chainInput, setChainInput] = useState('')

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
      // Validate required fields
      if (!formData.name?.trim()) {
        alert('Protocol name is required')
        setLoading(false)
        return
      }

      if (!formData.short_description?.trim()) {
        alert('Short description is required')
        setLoading(false)
        return
      }

      if (protocolId) {
        // Update existing
        console.log('Updating protocol with data:', formData)
        const { data, error } = await supabase
          .from('protocols')
          .update(formData)
          .eq('id', protocolId)
          .select()

        if (error) {
          console.error('Supabase error:', error)
          throw new Error(`Failed to update protocol: ${error.message}`)
        }

        console.log('Update response:', data)
      } else {
        // Create new
        console.log('Creating new protocol with data:', formData)
        const { data, error } = await supabase
          .from('protocols')
          .insert([formData])
          .select()

        if (error) {
          console.error('Supabase error:', error)
          throw new Error(`Failed to create protocol: ${error.message}`)
        }

        console.log('Insert response:', data)
      }

      alert('Protocol saved successfully!')
      onSave()
    } catch (error) {
      console.error('Error saving protocol:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to save protocol: ${errorMessage}`)
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

  const addTask = () => {
    if (taskInput.trim()) {
      setFormData({
        ...formData,
        tasks: [...(formData.tasks || []), taskInput.trim()]
      })
      setTaskInput('')
    }
  }

  const removeTask = (index: number) => {
    setFormData({
      ...formData,
      tasks: formData.tasks?.filter((_, i) => i !== index)
    })
  }

  const addChain = () => {
    if (chainInput.trim()) {
      setFormData({
        ...formData,
        chains: [...(formData.chains || []), chainInput.trim()]
      })
      setChainInput('')
    }
  }

  const removeChain = (index: number) => {
    setFormData({
      ...formData,
      chains: formData.chains?.filter((_, i) => i !== index)
    })
  }

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      const newImage: ImageItem = {
        id: Date.now().toString(),
        base64,
        name: file.name
      }
      setImages([...images, newImage])
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-white')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-white')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-white')

    const files = Array.from(e.dataTransfer.files)
    files.forEach(file => handleImageUpload(file))
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile()
        if (file) handleImageUpload(file)
      }
    }
  }

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    setImages(newImages)
  }

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id))
  }

  const previewProtocol: Protocol = {
    id: protocolId || 'preview',
    name: formData.name || 'Untitled Protocol',
    logo_url: formData.logo_url,
    category: formData.category || 'infrastructure',
    stage: formData.stage || 'seed',
    risk_level: formData.risk_level || 'medium',
    total_raised_usd: formData.total_raised_usd || 0,
    lead_investors: formData.lead_investors || [],
    founding_team_grade: formData.founding_team_grade || 'A',
    vc_track_record_grade: formData.vc_track_record_grade || 'A',
    business_model_grade: formData.business_model_grade || 'A',
    strategy_forecast: formData.strategy_forecast || '',
    short_description: formData.short_description || '',
    detailed_analysis: formData.detailed_analysis,
    entry_strategy: formData.entry_strategy,
    exit_strategy: formData.exit_strategy,
    website_url: formData.website_url,
    twitter_url: formData.twitter_url,
    discord_url: formData.discord_url,
    risk_factors: formData.risk_factors,
    is_featured: formData.is_featured || false,
    expected_costs: formData.expected_costs || 30,
    tasks: formData.tasks || ['Daily Check-in', 'Staking', 'Social Tasks'],
    chains: formData.chains || [],
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

            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">
                Logo URL (Optional)
              </label>
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono text-sm"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-text-secondary mt-1 font-mono">
                Leave empty to show first letter of protocol name
              </p>
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
              <div className="space-y-3">
                <textarea
                  ref={textareaRef}
                  value={formData.detailed_analysis}
                  onChange={(e) => setFormData({ ...formData, detailed_analysis: e.target.value })}
                  onPaste={handlePaste}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono text-sm"
                  placeholder="In-depth analysis for premium users..."
                />

                {/* Image Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-white/50 transition-colors"
                >
                  <Upload className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                  <p className="text-xs text-text-secondary mb-1">Drag & drop images here or paste from clipboard</p>
                  <p className="text-xs text-gray-600">Supports PNG, JPG, GIF, WebP</p>
                </div>

                {/* Images Preview */}
                {images.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-text-secondary">Images ({images.length})</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {images.map((img, index) => (
                        <div
                          key={img.id}
                          draggable
                          onDragStart={() => setDraggedImageId(img.id)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault()
                            if (draggedImageId) {
                              const fromIndex = images.findIndex(i => i.id === draggedImageId)
                              reorderImages(fromIndex, index)
                              setDraggedImageId(null)
                            }
                          }}
                          className="flex items-center gap-2 p-2 bg-surface-light rounded-lg group cursor-move hover:bg-surface-light/80 transition-colors"
                        >
                          <GripVertical className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <img src={img.base64} alt={img.name} className="w-8 h-8 rounded object-cover" />
                          <span className="text-xs text-gray-400 flex-1 truncate">{img.name}</span>
                          <button
                            onClick={() => removeImage(img.id)}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-display font-bold">Metrics & Grades</h3>

            <div className="grid grid-cols-2 gap-4">
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
                  Founding Team Grade *
                </label>
                <select
                  value={formData.founding_team_grade}
                  onChange={(e) => setFormData({ ...formData, founding_team_grade: e.target.value as GradeLevel })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-mono text-text-secondary mb-2">
                  VC Track Record Grade *
                </label>
                <select
                  value={formData.vc_track_record_grade}
                  onChange={(e) => setFormData({ ...formData, vc_track_record_grade: e.target.value as GradeLevel })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-mono text-text-secondary mb-2">
                  Business Model Grade *
                </label>
                <select
                  value={formData.business_model_grade}
                  onChange={(e) => setFormData({ ...formData, business_model_grade: e.target.value as GradeLevel })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-mono text-text-secondary mb-2">
                  Expected Costs ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.expected_costs}
                  onChange={(e) => setFormData({ ...formData, expected_costs: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono"
                  placeholder="30"
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

          {/* Tasks - What to do */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-display font-bold">What to do</h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="flex-1 px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono text-sm"
                placeholder="Daily Check-in"
              />
              <button
                onClick={addTask}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors font-mono text-sm"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tasks?.map((task, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-light">
                  <span className="text-sm font-mono">{task}</span>
                  <button
                    onClick={() => removeTask(index)}
                    className="text-text-secondary hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
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

          {/* Chains */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-display font-bold">Chains</h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={chainInput}
                onChange={(e) => setChainInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addChain()}
                className="flex-1 px-4 py-2 rounded-lg bg-surface border border-border focus:border-white transition-colors outline-none font-mono text-sm"
                placeholder="Ethereum"
              />
              <button
                onClick={addChain}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors font-mono text-sm"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.chains?.map((chain, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-light">
                  <span className="text-sm font-mono">{chain}</span>
                  <button
                    onClick={() => removeChain(index)}
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
