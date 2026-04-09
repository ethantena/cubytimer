'use client'

import { useState } from 'react'
import { useTimerStore } from '@/store/useTimerStore'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ThemeSelector } from '@/components/ThemeSelector'

export default function SettingsPage() {
  const { settings, updateSettings, clearAllSolves, solves } = useTimerStore()
  const [wcaId, setWcaId] = useState(settings.wcaId || '')
  const [wcaToken, setWcaToken] = useState(settings.wcaToken || '')
  const [saveMessage, setSaveMessage] = useState('')

  
  const fonts: Array<{ id: 'jetbrains' | 'inter' | 'mono', name: string }> = [
    { id: 'jetbrains', name: 'JetBrains Mono' },
    { id: 'inter', name: 'Inter' },
    { id: 'mono', name: 'System Mono' }
  ]

  
  const handleFontChange = (font: 'jetbrains' | 'inter' | 'mono') => {
    updateSettings({ font })
    // Font change will be handled by CSS variables through the theme system
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
    <div className="min-h-screen bg-background text-foreground p-8 ascii-dots">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 ascii-interface p-6">
          <Link
            href="/"
            className="p-2 hover:bg-secondary rounded-xl transition-colors ascii-btn"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-light ascii-text">Settings</h1>
            <p className="text-muted-foreground ascii-muted">Customize your timer experience</p>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className="bg-success/20 border border-success text-success px-4 py-2 rounded-lg mb-6">
            {saveMessage}
          </div>
        )}

        {/* VS Code Theme Selector */}
        <ThemeSelector />

        {/* Appearance Settings */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-6 ascii-interface">
          <div className="ascii-header">APPEARANCE</div>
          <div className="mt-4">
            {/* Font Selection */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-3">Font</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {fonts.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => handleFontChange(font.id)}
                    className={`p-3 rounded-xl border-2 transition-all ascii-btn ${
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
        </div>

        
        {/* WCA Account */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-6 ascii-interface">
          <div className="ascii-header">WCA ACCOUNT</div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">WCA ID</label>
              <input
                type="text"
                value={wcaId}
                onChange={(e) => setWcaId(e.target.value)}
                placeholder="e.g., 2023SMIT01"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary ascii-btn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">WCA API Token</label>
              <input
                type="password"
                value={wcaToken}
                onChange={(e) => setWcaToken(e.target.value)}
                placeholder="Enter your WCA API token"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary ascii-btn"
              />
            </div>
            <button
              onClick={handleWCASave}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-xl transition-colors ascii-btn"
            >
              <Save size={16} />
              Save WCA Credentials
            </button>
          </div>
        </div>

        
        {/* Data Management */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 ascii-interface">
          <div className="ascii-header">DATA MANAGEMENT</div>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Total Solves</p>
                <p className="text-sm text-muted-foreground">{solves.length} solves stored</p>
              </div>
              <button
                onClick={handleClearAllData}
                className="bg-error hover:bg-error/90 text-error-foreground px-4 py-3 rounded-xl transition-colors ascii-btn"
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
