'use client'

import { useState, useEffect } from 'react'

interface VSCodeTheme {
  name: string
  colors: {
    background: string
    foreground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    accent: string
    accentForeground: string
    card: string
    cardForeground: string
    border: string
    input: string
    ring: string
    muted: string
    mutedForeground: string
  }
}

const vscodeThemes: VSCodeTheme[] = [
  {
    name: 'Dark+ (Default Dark)',
    colors: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      primary: '#0078d4',
      primaryForeground: '#ffffff',
      secondary: '#2d2d30',
      secondaryForeground: '#cccccc',
      accent: '#0078d4',
      accentForeground: '#ffffff',
      card: '#252526',
      cardForeground: '#d4d4d4',
      border: '#3e3e42',
      input: '#3c3c3c',
      ring: '#0078d4',
      muted: '#969696',
      mutedForeground: '#969696'
    }
  },
  {
    name: 'Light+ (Default Light)',
    colors: {
      background: '#ffffff',
      foreground: '#333333',
      primary: '#0078d4',
      primaryForeground: '#ffffff',
      secondary: '#f3f3f3',
      secondaryForeground: '#333333',
      accent: '#0078d4',
      accentForeground: '#ffffff',
      card: '#ffffff',
      cardForeground: '#333333',
      border: '#e5e5e5',
      input: '#f3f3f3',
      ring: '#0078d4',
      muted: '#6e6e6e',
      mutedForeground: '#6e6e6e'
    }
  },
  {
    name: 'Monokai',
    colors: {
      background: '#272822',
      foreground: '#f8f8f2',
      primary: '#66d9ef',
      primaryForeground: '#272822',
      secondary: '#3e3d32',
      secondaryForeground: '#f8f8f2',
      accent: '#66d9ef',
      accentForeground: '#272822',
      card: '#3e3d32',
      cardForeground: '#f8f8f2',
      border: '#75715e',
      input: '#49483e',
      ring: '#66d9ef',
      muted: '#75715e',
      mutedForeground: '#75715e'
    }
  },
  {
    name: 'Dracula',
    colors: {
      background: '#282a36',
      foreground: '#f8f8f2',
      primary: '#bd93f9',
      primaryForeground: '#282a36',
      secondary: '#44475a',
      secondaryForeground: '#f8f8f2',
      accent: '#bd93f9',
      accentForeground: '#282a36',
      card: '#44475a',
      cardForeground: '#f8f8f2',
      border: '#6272a4',
      input: '#44475a',
      ring: '#bd93f9',
      muted: '#6272a4',
      mutedForeground: '#6272a4'
    }
  },
  {
    name: 'GitHub Dark',
    colors: {
      background: '#0d1117',
      foreground: '#c9d1d9',
      primary: '#58a6ff',
      primaryForeground: '#ffffff',
      secondary: '#161b22',
      secondaryForeground: '#c9d1d9',
      accent: '#58a6ff',
      accentForeground: '#ffffff',
      card: '#161b22',
      cardForeground: '#c9d1d9',
      border: '#30363d',
      input: '#21262d',
      ring: '#58a6ff',
      muted: '#8b949e',
      mutedForeground: '#8b949e'
    }
  },
  {
    name: 'Material Palenight',
    colors: {
      background: '#292d3e',
      foreground: '#eeffff',
      primary: '#82aaff',
      primaryForeground: '#292d3e',
      secondary: '#32374d',
      secondaryForeground: '#eeffff',
      accent: '#82aaff',
      accentForeground: '#292d3e',
      card: '#32374d',
      cardForeground: '#eeffff',
      border: '#464b5d',
      input: '#343a4f',
      ring: '#82aaff',
      muted: '#546e7a',
      mutedForeground: '#546e7a'
    }
  },
  {
    name: 'One Dark Pro',
    colors: {
      background: '#282c34',
      foreground: '#abb2bf',
      primary: '#61afef',
      primaryForeground: '#282c34',
      secondary: '#353b45',
      secondaryForeground: '#abb2bf',
      accent: '#61afef',
      accentForeground: '#282c34',
      card: '#353b45',
      cardForeground: '#abb2bf',
      border: '#434852',
      input: '#353b45',
      ring: '#61afef',
      muted: '#5c6370',
      mutedForeground: '#5c6370'
    }
  },
  {
    name: 'Nord',
    colors: {
      background: '#2e3440',
      foreground: '#d8dee9',
      primary: '#88c0d0',
      primaryForeground: '#2e3440',
      secondary: '#3b4252',
      secondaryForeground: '#d8dee9',
      accent: '#88c0d0',
      accentForeground: '#2e3440',
      card: '#3b4252',
      cardForeground: '#d8dee9',
      border: '#4c566a',
      input: '#3b4252',
      ring: '#88c0d0',
      muted: '#4c566a',
      mutedForeground: '#4c566a'
    }
  },
  {
    name: 'Solarized Dark',
    colors: {
      background: '#002b36',
      foreground: '#839496',
      primary: '#268bd2',
      primaryForeground: '#fdf6e3',
      secondary: '#073642',
      secondaryForeground: '#839496',
      accent: '#268bd2',
      accentForeground: '#fdf6e3',
      card: '#073642',
      cardForeground: '#839496',
      border: '#657b83',
      input: '#073642',
      ring: '#268bd2',
      muted: '#657b83',
      mutedForeground: '#657b83'
    }
  },
  {
    name: 'Tokyo Night',
    colors: {
      background: '#1a1b26',
      foreground: '#c0caf5',
      primary: '#7aa2f7',
      primaryForeground: '#1a1b26',
      secondary: '#24283b',
      secondaryForeground: '#c0caf5',
      accent: '#7aa2f7',
      accentForeground: '#1a1b26',
      card: '#24283b',
      cardForeground: '#c0caf5',
      border: '#414868',
      input: '#24283b',
      ring: '#7aa2f7',
      muted: '#565f89',
      mutedForeground: '#565f89'
    }
  }
]

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<VSCodeTheme>(vscodeThemes[1]) // Default to Light+
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('vscode-theme')
    if (savedTheme) {
      const theme = vscodeThemes.find(t => t.name === savedTheme)
      if (theme) {
        setCurrentTheme(theme)
        applyTheme(theme)
      }
    } else {
      applyTheme(currentTheme)
    }
  }, [])

  const applyTheme = (theme: VSCodeTheme) => {
    const root = document.documentElement
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      root.style.setProperty(cssVar, value)
    })
  }

  const changeTheme = (theme: VSCodeTheme) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    if (isClient) {
      localStorage.setItem('vscode-theme', theme.name)
    }
  }

  return {
    currentTheme,
    themes: vscodeThemes,
    changeTheme,
    isClient
  }
}
