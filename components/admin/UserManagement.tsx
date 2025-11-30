'use client'

import { useState, useEffect } from 'react'
import { Shield, User, Calendar, RefreshCw, Edit, Save, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { User as UserType } from '@/types'

interface ExtendedUser extends UserType {
  subscription_status?: string
}

export function UserManagement() {
  const [users, setUsers] = useState<ExtendedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<UserType>>({})

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(user: ExtendedUser) {
    setEditingUser(user.id)
    setEditForm({
      is_subscribed: user.is_subscribed,
      subscription_tier: user.subscription_tier,
      role: user.role,
      subscription_end_date: user.subscription_end_date,
    })
  }

  function cancelEdit() {
    setEditingUser(null)
    setEditForm({})
  }

  async function saveEdit(userId: string) {
    try {
      const { error } = await supabase
        .from('users')
        .update(editForm)
        .eq('id', userId)

      if (error) throw error

      await loadUsers()
      setEditingUser(null)
      setEditForm({})
      alert('User updated successfully!')
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary font-mono">Loading users...</div>
      </div>
    )
  }

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    subscribed: users.filter(u => u.is_subscribed).length,
    premium: users.filter(u => u.subscription_tier === 'premium').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold">User Management</h2>
        <button
          onClick={loadUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-surface-light transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-mono">Refresh</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="text-sm text-text-secondary font-mono mb-1">Total Users</div>
          <div className="text-2xl font-bold font-mono">{stats.total}</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-sm text-text-secondary font-mono mb-1">Admins</div>
          <div className="text-2xl font-bold font-mono">{stats.admins}</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-sm text-text-secondary font-mono mb-1">Subscribed</div>
          <div className="text-2xl font-bold font-mono">{stats.subscribed}</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-sm text-text-secondary font-mono mb-1">Premium</div>
          <div className="text-2xl font-bold font-mono">{stats.premium}</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-sm font-mono text-text-secondary">Email</th>
                <th className="text-left px-6 py-4 text-sm font-mono text-text-secondary">Role</th>
                <th className="text-left px-6 py-4 text-sm font-mono text-text-secondary">Subscription</th>
                <th className="text-left px-6 py-4 text-sm font-mono text-text-secondary">Status</th>
                <th className="text-left px-6 py-4 text-sm font-mono text-text-secondary">Joined</th>
                <th className="text-right px-6 py-4 text-sm font-mono text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isEditing = editingUser === user.id

                return (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-surface-light/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-mono text-sm">{user.email}</div>
                          <div className="text-xs text-text-secondary font-mono">{user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'user' | 'admin' })}
                          className="px-3 py-1 rounded bg-surface border border-border font-mono text-sm"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {user.role === 'admin' && <Shield className="w-4 h-4 text-yellow-500" />}
                          <span className={`px-2 py-1 rounded text-xs font-mono uppercase ${
                            user.role === 'admin'
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : 'bg-surface-light text-text-secondary'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <select
                          value={editForm.subscription_tier}
                          onChange={(e) => setEditForm({ ...editForm, subscription_tier: e.target.value as 'free' | 'premium' })}
                          className="px-3 py-1 rounded bg-surface border border-border font-mono text-sm"
                        >
                          <option value="free">Free</option>
                          <option value="premium">Premium</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-mono uppercase ${
                          user.subscription_tier === 'premium'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-surface-light text-text-secondary'
                        }`}>
                          {user.subscription_tier}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editForm.is_subscribed}
                            onChange={(e) => setEditForm({ ...editForm, is_subscribed: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="text-xs font-mono">Subscribed</span>
                        </label>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          user.is_subscribed
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-surface-light text-text-secondary'
                        }`}>
                          {user.is_subscribed ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-text-secondary font-mono">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(user.id)}
                              className="p-2 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 hover:bg-surface-light rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(user)}
                            className="p-2 hover:bg-surface-light rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-text-secondary font-mono">No users found.</p>
        </div>
      )}
    </div>
  )
}
