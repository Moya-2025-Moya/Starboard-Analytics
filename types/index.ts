export type RiskLevel = 'low' | 'medium' | 'high'
export type ProtocolStage = 'seed' | 'series-a' | 'series-b' | 'pre-tge' | 'tge'
export type Category = 'defi' | 'infrastructure' | 'gaming' | 'nft' | 'dao' | 'layer1' | 'layer2' | 'other'

export interface Protocol {
  id: string
  name: string
  logo_url?: string
  category: Category
  stage: ProtocolStage
  risk_level: RiskLevel
  ranking_score: number
  total_raised_usd: number
  lead_investors: string[]
  founding_team_score: number
  vc_track_record_score: number
  business_model_score: number
  strategy_forecast: string
  airdrop_probability: number
  expected_tge_date?: string
  website_url?: string
  twitter_url?: string
  discord_url?: string
  short_description: string
  detailed_analysis?: string
  entry_strategy?: string
  exit_strategy?: string
  risk_factors?: string[]
  key_metrics?: Record<string, any>
  last_updated: string
  created_at: string
  is_featured: boolean
}

export interface User {
  id: string
  email: string
  is_subscribed: boolean
  subscription_tier?: 'free' | 'premium'
  subscription_end_date?: string
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  tier: 'free' | 'premium'
  status: 'active' | 'cancelled' | 'expired'
  start_date: string
  end_date?: string
  stripe_subscription_id?: string
}
