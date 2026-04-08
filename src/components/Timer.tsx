'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTimerStore } from '@/store/useTimerStore'
import { generateScramble } from '@/utils/scrambleGenerator'
import { useErrorBoundary } from '@/components/ErrorBoundary'
import { Play, Square, RotateCcw, Plus, X } from 'lucide-react'
import { Navigation } from './Navigation'

export function Timer() {
  const { captureError } = useErrorBoundary()
  
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

  // Generate new scramble when event changes
  useEffect(() => {
    try {
      const newScramble = generateScramble(currentEvent)
      setScramble(newScramble)
    } catch (error) {
      captureError(error instanceof Error ? error : 'Failed to generate scramble', 'Timer')
    }
  }, [currentEvent, setScramble, captureError])

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
      try {
        // Stop timer and save solve
        stopTimer()
        const finalTime = Date.now() - (startTime || 0)
        addSolve({
          time: finalTime,
          scramble: currentScramble,
          event: currentEvent,
          penalty: 'none'
        })
        // Generate new scramble
        const newScramble = generateScramble(currentEvent)
        setScramble(newScramble)
      } catch (error) {
        captureError(error instanceof Error ? error : 'Failed to save solve', 'Timer')
      }
    } else {
      // Start timer
      startTimer()
    }
  }, [isRunning, startTime, stopTimer, addSolve, currentScramble, currentEvent, setScramble, captureError, startTimer])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  const getTimerColor = () => {
    if (isRunning) return 'text-green-500'
    if (isReady) return 'text-yellow-500'
    return 'text-foreground'
  }

  const getTimerStatus = () => {
    if (isRunning) return 'Running - Press any key to stop'
    return 'Press any key to start'
  }

  const handlePenalty = (solveId: string, penalty: 'none' | '+2' | 'DNF') => {
    updateSolvePenalty(solveId, penalty)
  }

  const getEffectiveTime = (solve: { time: number; penalty: string }) => {
    if (solve.penalty === 'DNF') return Infinity
    if (solve.penalty === '+2') return solve.time + 2000
    return solve.time
  }

  const recentSolves = solves.slice(-5).reverse()

  return (
    <div className="min-h-screen bg-background text-foreground p-4 ascii-dots">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 ascii-interface p-6">
          <h1 className="text-4xl font-bold mb-2 ascii-text">CubyTimer</h1>
          <p className="text-muted-foreground ascii-muted">Modern Speedcubing Timer</p>
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Event Selector */}
        <div className="flex justify-center mb-6">
          <select
            value={currentEvent}
            onChange={(e) => setEvent(e.target.value)}
            className="bg-card border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary ascii-btn"
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

        {/* Scramble Display */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8 ascii-interface">
          <div className="ascii-header">SCRAMBLE</div>
          <div className="text-center mt-4">
            <p className="text-2xl font-mono break-all ascii-text">{currentScramble}</p>
          </div>
        </div>

        {/* Timer Display */}
        <div className="bg-card border border-border rounded-xl p-12 mb-8 ascii-interface">
          <div className="ascii-header">TIMER</div>
          <div className="text-center mt-8">
            <div className={`text-8xl font-bold timer-display mb-4 timer-ascii ${getTimerColor()}`}>
              {formatTime(displayTime)}
            </div>
            <p className="text-muted-foreground mb-4 ascii-muted">{getTimerStatus()}</p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={resetTimer}
                className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-xl transition-colors ascii-btn"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Recent Solves */}
        {recentSolves.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6 ascii-interface">
            <div className="ascii-header">RECENT SOLVES</div>
            <div className="mt-4 space-y-2">
              {recentSolves.map((solve) => (
                <div key={solve.id} className="flex items-center justify-between p-3 bg-background rounded-xl ascii-section">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground ascii-muted">#{solves.indexOf(solve) + 1}</span>
                    <span className="font-mono ascii-text">
                      {getEffectiveTime(solve) === Infinity ? 'DNF' : formatTime(getEffectiveTime(solve))}
                    </span>
                    {solve.penalty !== 'none' && (
                      <span className="text-sm px-2 py-1 bg-warning/20 text-warning rounded-xl">
                        {solve.penalty}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePenalty(solve.id, solve.penalty === '+2' ? 'none' : '+2')}
                      className={`px-2 py-1 rounded-xl text-sm ascii-btn ${
                        solve.penalty === '+2' 
                          ? 'bg-warning text-warning-foreground' 
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      +2
                    </button>
                    <button
                      onClick={() => handlePenalty(solve.id, solve.penalty === 'DNF' ? 'none' : 'DNF')}
                      className={`px-2 py-1 rounded-xl text-sm ascii-btn ${
                        solve.penalty === 'DNF' 
                          ? 'bg-error text-error-foreground' 
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      DNF
                    </button>
                    <button
                      onClick={() => removeSolve(solve.id)}
                      className="p-2 text-error hover:bg-error/20 rounded-xl ascii-btn"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

              </div>
    </div>
  )
}
