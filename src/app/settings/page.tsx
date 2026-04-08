'use client'

import { useState } from 'react'
import { useTimerStore } from '@/store/useTimerStore'
import { Settings, Palette, Type, User, Trash2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const { settings, updateSettings, clearAllSolves, solves } = useTimerStore()
  const [wcaId, setWcaId] = useState(settings.wcaId || '')
  const [wcaToken, setWcaToken] = useState(settings.wcaToken || '')
  const [saveMessage, setSaveMessage] = useState('')

  const themes = [
    { id: 'dark', name: 'Dark', colors: { bg: '#0f0f0f', primary: '#3b82f6' } },
    { id: 'light', name: 'Light', colors: { bg: '#ffffff', primary: '#3b82f6' } },
    { id: 'blue', name: 'Blue', colors: { bg: '#0c1929', primary: '#0ea5e9' } },
    { id: 'green', name: 'Green', colors: { bg: '#0a1f1a', primary: '#10b981' } },
    { id: 'purple', name: 'Purple', colors: { bg: '#1a0f2e', primary: '#a855f7' } }
  ]

  const fonts = [
    { id: 'jetbrains', name: 'JetBrains Mono' },
    { id: 'inter', name: 'Inter' },
    { id: 'mono', name: 'System Mono' }
  ]

  const inspectionTimes = [
    { value: 0, label: 'None' },
    { value: 5, label: '5 seconds' },
    { value: 10, label: '10 seconds' },
    { value: 15, label: '15 seconds' },
    { value: 30, label: '30 seconds' }
  ]

  const handleThemeChange = (theme: string) => {
    updateSettings({ theme: theme as any })
    applyTheme(theme)
  }

  const applyTheme = (theme: string) => {
    const themeConfig = themes.find(t => t.id === theme)
    if (!themeConfig) return

    const root = document.documentElement
    root.style.setProperty('--background', themeConfig.colors.bg)
    root.style.setProperty('--primary', themeConfig.colors.primary)
    
    // Update other theme colors based on theme
    if (theme === 'light') {
      root.style.setProperty('--foreground', '#000000')
      root.style.setProperty('--card', '#f3f4f6')
      root.style.setProperty('--border', '#e5e7eb')
    } else {
      root.style.setProperty('--foreground', '#ffffff')
      root.style.setProperty('--card', '#1a1a1a')
      root.style.setProperty('--border', '#333333')
    }
  }

  const handleFontChange = (font: string) => {
    updateSettings({ font: font as any })
    const body = document.body
    body.className = body.className.replace(/font-\w+/, `font-${font}`)
  }

  const handleWCASave = () => {
    updateSettings({ wcaId, wcaToken })
    setSaveMessage('WCA credentials saved!')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all solve data? This cannot be undone.')) {
      clearAllSolves()
      setSaveMessage('All data cleared!')
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-light">Settings</h1>
            <p className="text-muted-foreground">Customize your timer experience</p>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className="bg-success/20 border border-success text-success px-4 py-2 rounded-lg mb-6">
            {saveMessage}
          </div>
        )}

        {/* Appearance Settings */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Palette className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-light">Appearance</h2>
          </div>

          {/* Theme Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-3">Theme</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    settings.theme === theme.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div 
                    className="w-full h-8 rounded-lg mb-2" 
                    style={{ backgroundColor: theme.colors.bg }}
                  />
                  <div className="text-sm font-medium">{theme.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Selection */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-3">Font</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {fonts.map((font) => (
                <button
                  key={font.id}
                  onClick={() => handleFontChange(font.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    settings.font === font.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-sm font-medium">{font.name}</div>
                  <div className="text-xs text-muted-foreground mt-1" style={{ fontFamily: font.id === 'jetbrains' ? 'JetBrains Mono, monospace' : font.id }}>
                    Sample text 123
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timer Settings */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Settings className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-light">Timer Settings</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-3">Inspection Time</label>
            <select
              value={settings.inspectionTime}
              onChange={(e) => updateSettings({ inspectionTime: parseInt(e.target.value) })}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {inspectionTimes.map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* WCA Account */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-lg">
              <User className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-light">WCA Account</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">WCA ID</label>
              <input
                type="text"
                value={wcaId}
                onChange={(e) => setWcaId(e.target.value)}
                placeholder="e.g., 2023SMIT01"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">WCA API Token</label>
              <input
                type="password"
                value={wcaToken}
                onChange={(e) => setWcaToken(e.target.value)}
                placeholder="Enter your WCA API token"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={handleWCASave}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-xl transition-colors"
            >
              <Save size={16} />
              Save WCA Credentials
            </button>
          </div>
        </div>

        
        {/* Data Management */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Trash2 className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-light">Data Management</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Total Solves</p>
                <p className="text-sm text-muted-foreground">{solves.length} solves stored</p>
              </div>
              <button
                onClick={handleClearAllData}
                className="bg-error hover:bg-error/90 text-error-foreground px-4 py-3 rounded-xl transition-colors"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
