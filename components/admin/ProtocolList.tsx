'use client'

import { useState, useEffect } from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { Protocol } from '@/types'

interface ProtocolListProps {
  onEdit: (id: string) => void
}

export function ProtocolList({ onEdit }: ProtocolListProps) {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProtocols()
  }, [])

  async function loadProtocols() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('protocols')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProtocols(data || [])
    } catch (error) {
      console.error('Error loading protocols:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this protocol?')) return

    try {
      const { error } = await supabase
        .from('protocols')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProtocols(protocols.filter(p => p.id !== id))
      alert('Protocol deleted successfully!')
    } catch (error) {
      console.error('Error deleting protocol:', error)
      alert('Failed to delete protocol')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary font-mono">Loading protocols...</div>
      </div>
    )
  }

  if (protocols.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-text-secondary font-mono">No protocols yet. Create your first one!</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-sm font-mono text-text-secondary">Name</th>
              <th className="text-left px-6 py-4 text-sm font-mono text-text-secondary">Category</th>
              <th className="text-left px-6 py-4 text-sm font-mono text-text-secondary">Stage</th>
              <th className="text-left px-6 py-4 text-sm font-mono text-text-secondary">Score</th>
              <th className="text-left px-6 py-4 text-sm font-mono text-text-secondary">Raised</th>
              <th className="text-left px-6 py-4 text-sm font-mono text-text-secondary">Status</th>
              <th className="text-right px-6 py-4 text-sm font-mono text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {protocols.map((protocol) => (
              <tr key={protocol.id} className="border-b border-border/50 hover:bg-surface-light/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-display font-bold">{protocol.name}</div>
                  <div className="text-xs text-text-secondary font-mono mt-1">
                    {protocol.short_description.substring(0, 50)}...
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded bg-surface-light text-xs font-mono uppercase">
                    {protocol.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-mono">{protocol.stage}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold font-mono">{protocol.ranking_score}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm">
                    ${(protocol.total_raised_usd / 1000000).toFixed(1)}M
                  </span>
                </td>
                <td className="px-6 py-4">
                  {protocol.is_featured && (
                    <span className="px-2 py-1 rounded bg-white/10 text-white text-xs font-mono">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => window.open('/', '_blank')}
                      className="p-2 hover:bg-surface-light rounded-lg transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(protocol.id)}
                      className="p-2 hover:bg-surface-light rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(protocol.id)}
                      className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
