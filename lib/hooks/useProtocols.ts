import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Protocol } from '@/types'

export function useProtocols() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProtocols()
  }, [])

  const fetchProtocols = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('protocols')
        .select('*')
        .order('ranking_score', { ascending: false })

      if (error) throw error

      setProtocols(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch protocols')
      console.error('Error fetching protocols:', err)
    } finally {
      setLoading(false)
    }
  }

  return { protocols, loading, error, refetch: fetchProtocols }
}
