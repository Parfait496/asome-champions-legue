import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export const THEMES = {
  gold: { accent: '#F5C842', accentDark: '#C49A10', name: 'Classic Gold' },
  emerald: { accent: '#4ADE80', accentDark: '#22C55E', name: 'Emerald' },
  crimson: { accent: '#F87171', accentDark: '#EF4444', name: 'Crimson' },
  azure: { accent: '#60A5FA', accentDark: '#3B82F6', name: 'Azure' },
}

export type ThemeKey = keyof typeof THEMES

interface ThemeContextType {
  theme: ThemeKey
  setTheme: (t: ThemeKey) => void
  themes: typeof THEMES
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>(
    (localStorage.getItem('theme') as ThemeKey) || 'gold'
  )

  useEffect(() => {
    const t = THEMES[theme]
    document.documentElement.style.setProperty('--color-gold', t.accent)
    document.documentElement.style.setProperty('--color-gold-dark', t.accentDark)
    localStorage.setItem('theme', theme)
  }, [theme])

  const setTheme = (t: ThemeKey) => setThemeState(t)

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}