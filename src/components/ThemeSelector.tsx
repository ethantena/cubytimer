'use client'

import { useTheme } from '@/hooks/useTheme'
import { Palette } from 'lucide-react'

export function ThemeSelector() {
  const { currentTheme, themes, changeTheme } = useTheme()

  return (
    <div className="bg-card border border-border rounded-xl p-6 ascii-interface">
      <div className="ascii-header">THEME SELECTOR</div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={16} />
          <span className="font-medium ascii-text">VS Code Themes</span>
        </div>
        
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => changeTheme(theme)}
              className={`p-3 rounded-xl text-left transition-all ascii-btn ${
                currentTheme.name === theme.name
                  ? 'ring-2 ring-primary bg-primary/10'
                  : 'hover:bg-secondary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium ascii-text">{theme.name}</span>
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: theme.colors.background }}
                    title="Background"
                  />
                  <div
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: theme.colors.accent }}
                    title="Accent"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-secondary/50 rounded-xl">
          <p className="text-sm ascii-muted">
            Current theme: <span className="font-medium ascii-text">{currentTheme.name}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
