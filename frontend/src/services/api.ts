import axios from 'axios'
import type { Team, Player, Match, StandingsEntry, NewsPost } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Auth token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const teamsApi = {
  getAll: () => api.get<Team[]>('/teams/').then((r) => r.data),
  getOne: (id: number) => api.get<Team>(`/teams/${id}/`).then((r) => r.data),
}

export const playersApi = {
  getAll: () => api.get<Player[]>('/players/').then((r) => r.data),
  getTopScorers: () =>
    api.get<Player[]>('/matches/top_scorers/').then((r) => r.data),
}

export const matchesApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<{ results: Match[]; count: number }>('/matches/', { params }).then((r) => r.data),
  getOne: (id: number) => api.get<Match>(`/matches/${id}/`).then((r) => r.data),
  getLive: () => api.get<Match[]>('/matches/live/').then((r) => r.data),
  getStandings: () =>
    api.get<StandingsEntry[]>('/matches/standings/').then((r) => r.data),
}

export const newsApi = {
  getAll: () =>
    api.get<{ results: NewsPost[]; count: number }>('/news/').then((r) => r.data),
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/token/', { username, password }).then((r) => r.data),
}

export const announcementsApi = {
  getAll: () =>
    api.get<{ results: NewsPost[]; count: number }>('/news/?tag=announcement').then((r) => r.data),
}

export default api