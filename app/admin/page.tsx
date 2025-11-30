'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Database, Users, FileText, LogOut, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { ProtocolEditor } from '@/components/admin/ProtocolEditor'
import { ProtocolList } from '@/components/admin/ProtocolList'
import { UserManagement } from '@/components/admin/UserManagement'
import { DatabaseView } from '@/components/admin/DatabaseView'
import type { User } from '@/types'

type Tab = 'protocols' | 'database' | 'users'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('protocols')
  const [editingProtocolId, setEditingProtocolId] = useState<string | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        router.push('/')
        return
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error || !userData || userData.role !== 'admin') {
        router.push('/')
        return
      }

      setUser(userData as User)
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary font-mono">Loading admin panel...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold tracking-wide">Admin Panel</h1>
              <p className="text-sm text-text-secondary font-mono">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-surface-light transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-mono">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-surface/30">
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => {
                setActiveTab('protocols')
                setEditingProtocolId(null)
                setIsCreatingNew(false)
              }}
              className={`flex items-center gap-2 px-4 py-3 font-mono text-sm transition-all ${
                activeTab === 'protocols'
                  ? 'text-white border-b-2 border-white'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              Protocols
            </button>
            <button
              onClick={() => {
                setActiveTab('database')
                setEditingProtocolId(null)
                setIsCreatingNew(false)
              }}
              className={`flex items-center gap-2 px-4 py-3 font-mono text-sm transition-all ${
                activeTab === 'database'
                  ? 'text-white border-b-2 border-white'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              Database
            </button>
            <button
              onClick={() => {
                setActiveTab('users')
                setEditingProtocolId(null)
                setIsCreatingNew(false)
              }}
              className={`flex items-center gap-2 px-4 py-3 font-mono text-sm transition-all ${
                activeTab === 'users'
                  ? 'text-white border-b-2 border-white'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Users
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'protocols' && (
          <div>
            {!editingProtocolId && !isCreatingNew ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold">Manage Protocols</h2>
                  <button
                    onClick={() => setIsCreatingNew(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors font-mono text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    New Protocol
                  </button>
                </div>
                <ProtocolList
                  onEdit={(id) => setEditingProtocolId(id)}
                />
              </div>
            ) : (
              <ProtocolEditor
                protocolId={editingProtocolId}
                onClose={() => {
                  setEditingProtocolId(null)
                  setIsCreatingNew(false)
                }}
                onSave={() => {
                  setEditingProtocolId(null)
                  setIsCreatingNew(false)
                }}
              />
            )}
          </div>
        )}

        {activeTab === 'database' && <DatabaseView />}
        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  )
}
