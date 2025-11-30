'use client'

import { useState, useEffect } from 'react'
import { Database, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface TableStats {
  protocols_count: number
  users_count: number
  subscriptions_count: number
  last_protocol_update: string | null
}

export function DatabaseView() {
  const [stats, setStats] = useState<TableStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    setLoading(true)
    try {
      const [protocols, users, subscriptions] = await Promise.all([
        supabase.from('protocols').select('last_updated', { count: 'exact', head: false }),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('*', { count: 'exact', head: true }),
      ])

      const lastUpdate = protocols.data?.[0]?.last_updated || null

      setStats({
        protocols_count: protocols.count || 0,
        users_count: users.count || 0,
        subscriptions_count: subscriptions.count || 0,
        last_protocol_update: lastUpdate,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary font-mono">Loading database stats...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold">Database Overview</h2>
        <button
          onClick={loadStats}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-surface-light transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-mono">Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-surface-light">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-text-secondary font-mono">Total Protocols</div>
              <div className="text-3xl font-bold font-mono">{stats?.protocols_count || 0}</div>
            </div>
          </div>
          {stats?.last_protocol_update && (
            <div className="text-xs text-text-secondary font-mono pt-3 border-t border-border">
              Last update: {new Date(stats.last_protocol_update).toLocaleString()}
            </div>
          )}
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-surface-light">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-text-secondary font-mono">Total Users</div>
              <div className="text-3xl font-bold font-mono">{stats?.users_count || 0}</div>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-surface-light">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-text-secondary font-mono">Active Subscriptions</div>
              <div className="text-3xl font-bold font-mono">{stats?.subscriptions_count || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Info */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-display font-bold">Database Schema</h3>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-surface-light">
            <div className="font-mono font-bold mb-2">protocols</div>
            <div className="text-sm text-text-secondary font-mono space-y-1">
              <div>• Basic information (name, category, stage, description)</div>
              <div>• Metrics (scores, raised amount, airdrop probability)</div>
              <div>• Links (website, twitter, discord)</div>
              <div>• Analysis (detailed analysis, strategy, risk factors)</div>
              <div>• Timestamps (created_at, last_updated)</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-surface-light">
            <div className="font-mono font-bold mb-2">users</div>
            <div className="text-sm text-text-secondary font-mono space-y-1">
              <div>• Authentication (id, email)</div>
              <div>• Subscription (is_subscribed, subscription_tier, subscription_end_date)</div>
              <div>• Role (user, admin)</div>
              <div>• Timestamps (created_at, updated_at)</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-surface-light">
            <div className="font-mono font-bold mb-2">subscriptions</div>
            <div className="text-sm text-text-secondary font-mono space-y-1">
              <div>• Subscription details (tier, status)</div>
              <div>• Dates (start_date, end_date)</div>
              <div>• Integration (stripe_subscription_id)</div>
              <div>• Timestamps (created_at, updated_at)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Info */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-display font-bold mb-4">Connection Details</h3>
        <div className="space-y-2 text-sm font-mono">
          <div className="flex items-center justify-between py-2 border-b border-border/30">
            <span className="text-text-secondary">Database Provider</span>
            <span className="font-bold">Supabase PostgreSQL</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/30">
            <span className="text-text-secondary">Project URL</span>
            <span className="font-bold text-xs">{process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary">Row Level Security</span>
            <span className="font-bold text-green-500">Enabled</span>
          </div>
        </div>
      </div>
    </div>
  )
}
