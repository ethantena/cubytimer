'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTimerStore } from '@/store/useTimerStore'
import { generateScramble } from '@/utils/scrambleGenerator'
import { useTheme } from '@/hooks/useTheme'
import { Play, RotateCcw, X, BarChart3, Menu, X as Close } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MinimalisticLayout() {
  const { changeTheme, themes, currentTheme } = useTheme()
  const {
    isRunning,
    isReady,
    startTime,
    currentTime,
    solves,
    currentEvent,
    currentScramble,
    startTimer,
    stopTimer,
    resetTimer,
    addSolve,
    setScramble,
    updateSolvePenalty,
    removeSolve,
    setEvent
  } = useTimerStore()

  const [displayTime, setDisplayTime] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  
  // Generate new scramble when event changes
  useEffect(() => {
    const newScramble = generateScramble(currentEvent)
    setScramble(newScramble)
  }, [currentEvent, setScramble])

  // Update display time
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && startTime) {
      interval = setInterval(() => {
        setDisplayTime(Date.now() - startTime)
      }, 10)
    } else {
      setDisplayTime(currentTime)
    }

    return () => clearInterval(interval)
  }, [isRunning, startTime, currentTime])

  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    const milliseconds = Math.floor((time % 1000) / 10)

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
    } else {
      return `${seconds}.${milliseconds.toString().padStart(2, '0')}`
    }
  }, [])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Start or stop timer on any key press (toggle behavior)
    if (isRunning) {
      // Stop timer and save solve
      stopTimer()
      const finalTime = Date.now() - (startTime || 0)
      addSolve({
        time: finalTime,
        scramble: currentScramble,
        event: currentEvent,
        penalty: 'none'
      })
      const newScramble = generateScramble(currentEvent)
      setScramble(newScramble)
    } else {
      // Start timer
      startTimer()
    }
  }, [isRunning, startTime, stopTimer, addSolve, currentScramble, currentEvent, setScramble, startTimer])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  const getTimerColor = () => {
    if (isRunning) return 'text-green-400'
    if (isReady) return 'text-yellow-400'
    return 'text-foreground'
  }

  const getTimerStatus = () => {
    if (isRunning) return 'Running'
    if (isReady) return 'Ready'
    return 'Press Space'
  }

  const handlePenalty = (solveId: string, penalty: 'none' | '+2' | 'DNF') => {
    updateSolvePenalty(solveId, penalty)
  }

  const getEffectiveTime = (solve: { time: number; penalty: string }) => {
    if (solve.penalty === 'DNF') return Infinity
    if (solve.penalty === '+2') return solve.time + 2000
    return solve.time
  }

  // Calculate simple stats
  const recentSolves = solves.slice(-10)
  const bestTime = recentSolves.length > 0 ? Math.min(...recentSolves.map(s => getEffectiveTime(s)).filter(t => t !== Infinity)) : 0
  const averageTime = recentSolves.length > 0 ? recentSolves.map(s => getEffectiveTime(s)).filter(t => t !== Infinity).reduce((a, b) => a + b, 0) / recentSolves.filter(s => getEffectiveTime(s) !== Infinity).length : 0

  const navItems = [
    { href: '/', label: 'Timer', icon: Play },
    { href: '/stats', label: 'Statistics', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground ascii-dots font-mono">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-sm font-mono text-white">
            [ CUBY TIMER V2.0 ]
          </div>
          <div className="text-sm font-mono text-muted-foreground">
            [ {currentEvent} ]
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Navigation */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 w-72 h-full bg-background border-r border-border transition-transform duration-300 ease-in-out`}>
          <div className="flex flex-col h-full p-4">
            {/* Navigation Section */}
            <div className="ascii-section mb-4">
              <div className="ascii-header">NAVIGATION</div>
              <div className="p-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-2 py-1 font-mono text-sm transition-colors ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary text-foreground'
                      }`}
                    >
                      <Icon size={14} />
                      <span>&gt; {item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Event Section */}
            <div className="ascii-section mb-4">
              <div className="ascii-header">EVENT</div>
              <div className="p-2">
                <select
                  value={currentEvent}
                  onChange={(e) => setEvent(e.target.value)}
                  className="w-full bg-background border border-border px-2 py-1 text-foreground focus:outline-none font-mono text-sm"
                >
                  <option value="3x3x3">3x3</option>
                  <option value="2x2x2">2x2</option>
                  <option value="4x4x4">4x4</option>
                  <option value="5x5x5">5x5</option>
                  <option value="3x3x3 OH">3x3 OH</option>
                  <option value="3x3x3 BLD">3x3 BLD</option>
                  <option value="F2L">F2L</option>
                  <option value="LL">Last Layer</option>
                  <option value="PLL">PLL</option>
                  <option value="OLL">OLL</option>
                  <option value="Pyraminx">Pyraminx</option>
                  <option value="Megaminx">Megaminx</option>
                  <option value="Skewb">Skewb</option>
                  <option value="Square-1">Square-1</option>
                </select>
              </div>
            </div>

            {/* Theme Section */}
            <div className="ascii-section mb-4">
              <div className="ascii-header">VS CODE THEMES</div>
              <div className="p-2">
                <select
                  value={currentTheme.name}
                  onChange={(e) => {
                    const theme = themes.find(t => t.name === e.target.value)
                    if (theme) changeTheme(theme)
                  }}
                  className="w-full bg-background border border-border px-2 py-1 text-foreground focus:outline-none font-mono text-sm"
                >
                  {themes.map((theme) => (
                    <option key={theme.name} value={theme.name}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stats Section - REMOVED */}

          </div>
        </div>

        {/* Main Content - Timer */}
        <div className="flex-1 flex flex-col items-center justify-center relative p-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed top-20 left-4 z-50 p-2 border border-border bg-background"
          >
            <Menu size={16} />
          </button>

          {/* Timer Display */}
          <div className="text-center w-full max-w-2xl">
            {/* Scramble - Centered */}
            <div className="mb-12">
              <div className="text-xs text-muted-foreground mb-2 font-mono">[ SCRAMBLE ]</div>
              <div className="text-xl md:text-2xl font-mono text-white tracking-widest">{currentScramble}</div>
            </div>
            
            <div className="mb-8">
              <div className={`text-8xl font-mono timer-display mb-4 ${getTimerColor()} timer-ascii`}>
                {formatTime(displayTime)}
              </div>
              <div className="font-mono text-sm text-white">
                [ {getTimerStatus()} ]
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={resetTimer}
                className="ascii-btn font-mono text-sm"
              >
                <RotateCcw size={14} className="inline mr-2" />
                [ RESET ]
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Solves */}
        <div className="hidden xl:block w-72 bg-background border-l border-border p-4">
          <div className="ascii-section h-full">
            <div className="ascii-header">RECENT_SOLVES</div>
            <div className="p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
              {recentSolves.length > 0 ? (
                <div className="space-y-1">
                  {recentSolves.slice(-15).reverse().map((solve) => (
                    <div key={solve.id} className="border-b border-border pb-1">
                      <div className="flex justify-between font-mono text-sm">
                        <span className="text-muted-foreground">#{solves.indexOf(solve) + 1}</span>
                        <span className="text-white">
                          {getEffectiveTime(solve) === Infinity ? 'DNF' : formatTime(getEffectiveTime(solve))}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        <button
                          onClick={() => handlePenalty(solve.id, solve.penalty === '+2' ? 'none' : '+2')}
                          className={`px-1 py-0.5 text-xs font-mono ${
                            solve.penalty === '+2' 
                              ? 'bg-warning text-warning-foreground' 
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          +2
                        </button>
                        <button
                          onClick={() => handlePenalty(solve.id, solve.penalty === 'DNF' ? 'none' : 'DNF')}
                          className={`px-1 py-0.5 text-xs font-mono ${
                            solve.penalty === 'DNF' 
                              ? 'bg-error text-error-foreground' 
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          DNF
                        </button>
                        <button
                          onClick={() => removeSolve(solve.id)}
                          className="px-1 py-0.5 text-xs font-mono text-error hover:bg-error/20"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground font-mono text-sm py-8">
                  [ NO_SOLVES_YET ]
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-2">
        <div className="max-w-6xl mx-auto text-center font-mono text-xs text-muted-foreground">
          [ PRESS_ANY_KEY_TO_START_STOP ] [ CLICK_RESET_BUTTON ] [ <a href="https://github.com/ethantena/cubytimer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GITHUB</a> ]
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
