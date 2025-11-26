import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkSubscription(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkSubscription(session.user.id)
      } else {
        setIsSubscribed(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_subscribed')
        .eq('id', userId)
        .single()

      if (error) throw error
      setIsSubscribed(data?.is_subscribed ?? false)
    } catch (err) {
      console.error('Error checking subscription:', err)
      setIsSubscribed(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    isSubscribed,
    signIn,
    signUp,
    signOut,
  }
}
