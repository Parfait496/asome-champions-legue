export interface TeamStats {
  played: number
  wins: number
  draws: number
  losses: number
  gf: number
  ga: number
  gd: number
  points: number
}

export interface Team {
  id: number
  name: string
  year_group: number
  emoji: string
  color: string
  bg_color: string
  stats: TeamStats
  players?: Player[]
}

export interface Player {
  id: number
  name: string
  jersey_number: number
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  photo?: string
  is_captain: boolean
  goals: number
  assists: number
  yellow_cards: number
  red_cards: number
  team?: Team
}

export interface MatchEvent {
  id: number
  player_name: string
  team_name: string
  event_type: 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'substitution' | 'own_goal'
  minute: number
  notes: string
}

export interface Match {
  id: number
  home_team: Team
  away_team: Team
  home_score: number
  away_score: number
  match_date: string
  matchday: number
  venue: string
  status: 'scheduled' | 'live' | 'done' | 'postponed'
  minute?: number
  penalty_winner?: Team
  events: MatchEvent[]
}

export interface StandingsEntry extends TeamStats {
  team: Team
}

export interface NewsPost {
  id: number
  title: string
  tag: string
  excerpt: string
  content: string
  cover_image?: string
  cover_image_url?: string
  emoji: string
  bg_color: string
  author_name: string
  author_title: string
  created_at: string
}

export interface Submission {
  id: number
  submission_type: 'suggestion' | 'claim'
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}