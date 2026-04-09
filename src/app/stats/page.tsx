'use client'

import { useMemo } from 'react'
import { useTimerStore } from '@/store/useTimerStore'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function StatsPage() {
  const { solves, currentEvent } = useTimerStore()

  const stats = useMemo(() => {
    const eventSolves = solves.filter(solve => solve.event === currentEvent)
    
    if (eventSolves.length === 0) {
      return {
        totalSolves: 0,
        averageTime: 0,
        bestTime: 0,
        worstTime: 0,
        ao5: null,
        ao12: null,
        ao50: null,
        ao100: null,
        sessionAverage: 0,
        improvement: 0
      }
    }

    const getEffectiveTime = (solve: { time: number; penalty: string }) => {
      if (solve.penalty === 'DNF') return Infinity
      if (solve.penalty === '+2') return solve.time + 2000
      return solve.time
    }

    const validSolves = eventSolves
      .map(solve => ({ ...solve, effectiveTime: getEffectiveTime(solve) }))
      .filter(solve => solve.effectiveTime !== Infinity)

    const times = validSolves.map(solve => solve.effectiveTime)
    
    const totalSolves = eventSolves.length
    const averageTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
    const bestTime = times.length > 0 ? Math.min(...times) : 0
    const worstTime = times.length > 0 ? Math.max(...times) : 0

    const calculateAo = (count: number) => {
      if (validSolves.length < count) return null
      
      const recentSolves = validSolves.slice(-count)
      const sortedTimes = recentSolves.map(s => s.effectiveTime).sort((a, b) => a - b)
      
      if (sortedTimes.length === count) {
        const trimmedTimes = sortedTimes.slice(1, -1)
        return trimmedTimes.reduce((a, b) => a + b, 0) / trimmedTimes.length
      }
      
      return sortedTimes.reduce((a, b) => a + b, 0) / sortedTimes.length
    }

    const ao5 = calculateAo(5)
    const ao12 = calculateAo(12)
    const ao50 = calculateAo(50)
    const ao100 = calculateAo(100)

    const sessionAverage = validSolves.length > 0 ? averageTime : 0
    
    const improvement = validSolves.length >= 10 
      ? (validSolves[0].effectiveTime - validSolves[validSolves.length - 1].effectiveTime) / validSolves[0].effectiveTime * 100
      : 0

    return {
      totalSolves,
      averageTime,
      bestTime,
      worstTime,
      ao5,
      ao12,
      ao50,
      ao100,
      sessionAverage,
      improvement
    }
  }, [solves, currentEvent])

  const formatTime = (time: number): string => {
    if (time === 0 || time === Infinity) return '--'
    
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    const milliseconds = Math.floor((time % 1000) / 10)

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
    } else {
      return `${seconds}.${milliseconds.toString().padStart(2, '0')}`
    }
  }

  const chartData = useMemo(() => {
    const eventSolves = solves.filter(solve => solve.event === currentEvent)
    return eventSolves.slice(-50).map((solve, index) => {
      let time = solve.time
      if (solve.penalty === 'DNF') time = Infinity
      if (solve.penalty === '+2') time += 2000
      
      return {
        index: index + 1,
        time: time === Infinity ? null : time / 1000,
        date: new Date(solve.timestamp).toLocaleDateString()
      }
    })
  }, [solves, currentEvent])

  const distributionData = useMemo(() => {
    const eventSolves = solves.filter(solve => solve.event === currentEvent)
    const ranges = [
      { label: '< 10s', min: 0, max: 10000 },
      { label: '10-15s', min: 10000, max: 15000 },
      { label: '15-20s', min: 15000, max: 20000 },
      { label: '20-25s', min: 20000, max: 25000 },
      { label: '25-30s', min: 25000, max: 30000 },
      { label: '30-45s', min: 30000, max: 45000 },
      { label: '45-60s', min: 45000, max: 60000 },
      { label: '> 60s', min: 60000, max: Infinity }
    ]

    return ranges.map(range => {
      const count = eventSolves.filter(solve => {
        let time = solve.time
        if (solve.penalty === 'DNF') return false
        if (solve.penalty === '+2') time += 2000
        return time >= range.min && time < range.max
      }).length

      return { range: range.label, count }
    })
  }, [solves, currentEvent])

  return (
    <div className="min-h-screen bg-background text-foreground ascii-dots font-mono">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className="ascii-btn">
            <ArrowLeft size={16} className="inline mr-2" />
            [ BACK ]
          </Link>
          <div>
            <h1 className="text-2xl font-mono text-white">[ STATISTICS ]</h1>
            <p className="text-muted-foreground font-mono text-sm">Performance analytics for {currentEvent}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="ascii-section mb-6">
          <div className="ascii-header">QUICK STATS</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            <div className="border-r border-b border-border p-4">
              <div className="text-xs text-muted-foreground font-mono mb-1">[ BEST_TIME ]</div>
              <div className="text-2xl font-mono text-white">{formatTime(stats.bestTime)}</div>
            </div>
            <div className="border-b border-border p-4">
              <div className="text-xs text-muted-foreground font-mono mb-1">[ SESSION_AVG ]</div>
              <div className="text-2xl font-mono text-white">{formatTime(stats.sessionAverage)}</div>
            </div>
            <div className="border-r border-border p-4">
              <div className="text-xs text-muted-foreground font-mono mb-1">[ AO5 ]</div>
              <div className="text-2xl font-mono text-white">{formatTime(stats.ao5 || 0)}</div>
            </div>
            <div className="p-4">
              <div className="text-xs text-muted-foreground font-mono mb-1">[ TOTAL_SOLVES ]</div>
              <div className="text-2xl font-mono text-white">{stats.totalSolves}</div>
            </div>
          </div>
        </div>

        {/* Advanced Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="ascii-section">
            <div className="ascii-header">ADVANCED AVERAGES</div>
            <div className="space-y-0">
              <div className="flex justify-between border-b border-border p-3">
                <span className="font-mono text-muted-foreground">Average of 5</span>
                <span className="font-mono text-white">{formatTime(stats.ao5 || 0)}</span>
              </div>
              <div className="flex justify-between border-b border-border p-3">
                <span className="font-mono text-muted-foreground">Average of 12</span>
                <span className="font-mono text-white">{formatTime(stats.ao12 || 0)}</span>
              </div>
              <div className="flex justify-between border-b border-border p-3">
                <span className="font-mono text-muted-foreground">Average of 50</span>
                <span className="font-mono text-white">{formatTime(stats.ao50 || 0)}</span>
              </div>
              <div className="flex justify-between border-b border-border p-3">
                <span className="font-mono text-muted-foreground">Average of 100</span>
                <span className="font-mono text-white">{formatTime(stats.ao100 || 0)}</span>
              </div>
              <div className="flex justify-between border-b border-border p-3">
                <span className="font-mono text-muted-foreground">Mean Time</span>
                <span className="font-mono text-white">{formatTime(stats.averageTime)}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="font-mono text-muted-foreground">Worst Time</span>
                <span className="font-mono text-white">{formatTime(stats.worstTime)}</span>
              </div>
            </div>
          </div>

          <div className="ascii-section">
            <div className="ascii-header">SESSION_INFO</div>
            <div className="space-y-0">
              <div className="flex justify-between border-b border-border p-3">
                <span className="font-mono text-muted-foreground">Improvement</span>
                <span className={`font-mono ${stats.improvement > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.improvement > 0 ? '+' : ''}{stats.improvement.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between border-b border-border p-3">
                <span className="font-mono text-muted-foreground">DNF Count</span>
                <span className="font-mono text-white">{solves.filter(s => s.event === currentEvent && s.penalty === 'DNF').length}</span>
              </div>
              <div className="flex justify-between border-b border-border p-3">
                <span className="font-mono text-muted-foreground">+2 Count</span>
                <span className="font-mono text-white">{solves.filter(s => s.event === currentEvent && s.penalty === '+2').length}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="font-mono text-muted-foreground">Success Rate</span>
                <span className="font-mono text-white">{stats.totalSolves > 0 
                  ? ((stats.totalSolves - solves.filter(s => s.event === currentEvent && s.penalty === 'DNF').length) / stats.totalSolves * 100).toFixed(1)
                  : 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="ascii-section">
            <div className="ascii-header">TIME_PROGRESSION</div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="index" stroke="var(--muted)" />
                  <YAxis stroke="var(--muted)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                    labelStyle={{ color: 'var(--foreground)' }}
                    formatter={(value: unknown) => {
    const numValue = value as number | string | null | undefined
    const timeValue = typeof numValue === 'number' ? numValue : null
    return [timeValue ? `${timeValue}s` : 'DNF', 'Time']
  }}
                  />
                  <Line type="monotone" dataKey="time" stroke="var(--primary)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="ascii-section">
            <div className="ascii-header">TIME_DISTRIBUTION</div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="range" stroke="var(--muted)" />
                  <YAxis stroke="var(--muted)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} labelStyle={{ color: 'var(--foreground)' }} />
                  <Bar dataKey="count" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
