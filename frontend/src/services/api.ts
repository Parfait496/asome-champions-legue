import axios from 'axios'
import type { Team, Player, Match, StandingsEntry, NewsPost } from '../types'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, ''),
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Helper — handles both paginated {results:[]} and plain []
function extractList<T>(data: any): T[] {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}

export const teamsApi = {
  getAll: () => api.get<any>('/teams/').then((r) => extractList<Team>(r.data)),
  getOne: (id: number) => api.get<Team>(`/teams/${id}/`).then((r) => r.data),
}

export const playersApi = {
  getAll: () => api.get<any>('/players/').then((r) => extractList<Player>(r.data)),
  getTopScorers: () =>
    api.get<any>('/matches/top_scorers/').then((r) => extractList<Player>(r.data)),
}

export const matchesApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<any>('/matches/', { params }).then((r) => ({
      results: extractList<Match>(r.data),
      count: r.data.count || 0,
    })),
  getOne: (id: number) => api.get<Match>(`/matches/${id}/`).then((r) => r.data),
  getLive: () => api.get<any>('/matches/live/').then((r) => extractList<Match>(r.data)),
  getStandings: () =>
    api.get<any>('/matches/standings/').then((r) => extractList<StandingsEntry>(r.data)),
}

export const newsApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<any>('/news/', { params }).then((r) => ({
      results: extractList<NewsPost>(r.data),
      count: r.data.count || 0,
    })),
}

export const announcementsApi = {
  getAll: () =>
    api.get<any>('/news/', { params: { tag: 'announcement' } }).then((r) => ({
      results: extractList<NewsPost>(r.data),
      count: r.data.count || 0,
    })),
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/token/', { username, password }).then((r) => r.data),
}

export default api