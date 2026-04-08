'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTimerStore } from '@/store/useTimerStore'
import { generateScramble } from '@/utils/scrambleGenerator'
import { Play, Square, RotateCcw, Plus, X } from 'lucide-react'
import { Navigation } from './Navigation'
import { BluetoothCube } from './BluetoothCube'

export function Timer() {
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
  const [inspectionTime, setInspectionTime] = useState(15)
  const [isInspecting, setIsInspecting] = useState(false)
  const [inspectionStartTime, setInspectionStartTime] = useState(0)

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
    } else if (isInspecting) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - inspectionStartTime) / 1000)
        const remaining = Math.max(0, inspectionTime - elapsed)
        setDisplayTime(remaining * 1000)
        
        if (remaining === 0) {
          setIsInspecting(false)
          startTimer()
        }
      }, 100)
    } else {
      setDisplayTime(currentTime)
    }

    return () => clearInterval(interval)
  }, [isRunning, startTime, currentTime, isInspecting, inspectionStartTime, inspectionTime, startTimer])

  const formatTime = useCallback((time: number): string => {
    if (isInspecting) {
      const seconds = Math.floor(time / 1000)
      return `0:${seconds.toString().padStart(2, '0')}`
    }

    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    const milliseconds = Math.floor((time % 1000) / 10)

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
    } else {
      return `${seconds}.${milliseconds.toString().padStart(2, '0')}`
    }
  }, [isInspecting])

  const handleSpaceDown = useCallback(() => {
    if (!isRunning && !isReady && !isInspecting) {
      // Start inspection
      setIsInspecting(true)
      setInspectionStartTime(Date.now())
    } else if (isReady) {
      // Start timer
      startTimer()
    }
  }, [isRunning, isReady, isInspecting, startTimer])

  const handleSpaceUp = useCallback(() => {
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
      // Generate new scramble
      const newScramble = generateScramble(currentEvent)
      setScramble(newScramble)
    } else if (isInspecting) {
      // Stop inspection and start timer
      setIsInspecting(false)
      startTimer()
    }
  }, [isRunning, isReady, isInspecting, startTime, stopTimer, addSolve, currentScramble, currentEvent, setScramble, startTimer])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault()
      if (e.type === 'keydown') {
        handleSpaceDown()
      } else if (e.type === 'keyup') {
        handleSpaceUp()
      }
    }
  }, [handleSpaceDown, handleSpaceUp])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('keyup', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('keyup', handleKeyPress)
    }
  }, [handleKeyPress])

  const getTimerColor = () => {
    if (isInspecting) {
      if (displayTime <= 2000) return 'text-green-500'
      if (displayTime <= 8000) return 'text-yellow-500'
      return 'text-red-500'
    }
    if (isRunning) return 'text-green-500'
    if (isReady) return 'text-yellow-500'
    return 'text-foreground'
  }

  const getTimerStatus = () => {
    if (isInspecting) return 'Inspection'
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

  const recentSolves = solves.slice(-5).reverse()

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">CubyTimer</h1>
          <p className="text-muted-foreground">Modern Speedcubing Timer</p>
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Event Selector */}
        <div className="flex justify-center mb-6">
          <select
            value={currentEvent}
            onChange={(e) => setEvent(e.target.value)}
            className="bg-card border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Scramble</h2>
            <p className="text-2xl font-mono break-all">{currentScramble}</p>
          </div>
        </div>

        {/* Timer Display */}
        <div className="bg-card border border-border rounded-lg p-12 mb-8">
          <div className="text-center">
            <div className={`text-8xl font-bold timer-display mb-4 ${getTimerColor()}`}>
              {formatTime(displayTime)}
            </div>
            <p className="text-muted-foreground mb-4">{getTimerStatus()}</p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={resetTimer}
                className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Recent Solves */}
        {recentSolves.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Solves</h2>
            <div className="space-y-2">
              {recentSolves.map((solve) => (
                <div key={solve.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">#{solves.indexOf(solve) + 1}</span>
                    <span className="font-mono">
                      {getEffectiveTime(solve) === Infinity ? 'DNF' : formatTime(getEffectiveTime(solve))}
                    </span>
                    {solve.penalty !== 'none' && (
                      <span className="text-sm px-2 py-1 bg-warning/20 text-warning rounded">
                        {solve.penalty}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePenalty(solve.id, solve.penalty === '+2' ? 'none' : '+2')}
                      className={`px-2 py-1 rounded text-sm ${
                        solve.penalty === '+2' 
                          ? 'bg-warning text-warning-foreground' 
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      +2
                    </button>
                    <button
                      onClick={() => handlePenalty(solve.id, solve.penalty === 'DNF' ? 'none' : 'DNF')}
                      className={`px-2 py-1 rounded text-sm ${
                        solve.penalty === 'DNF' 
                          ? 'bg-error text-error-foreground' 
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      DNF
                    </button>
                    <button
                      onClick={() => removeSolve(solve.id)}
                      className="p-1 text-error hover:bg-error/20 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* External Devices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BluetoothCube />
        </div>
      </div>
    </div>
  )
}
