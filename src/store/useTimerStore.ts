import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Solve = {
  id: string
  time: number
  scramble: string
  event: string
  penalty: 'none' | '+2' | 'DNF'
  timestamp: Date
}

export type Settings = {
  font: 'jetbrains' | 'inter' | 'mono'
  theme: 'catppuccin' | 'cyberpunk' | 'matcha-dark' | 'matcha-light' | 'kimbie-dark' | 'black'
  inspectionTime: number
  wcaId?: string
  wcaToken?: string
}

export type TimerState = {
  isRunning: boolean
  isReady: boolean
  startTime: number | null
  currentTime: number
  solves: Solve[]
  currentEvent: string
  currentScramble: string
  settings: Settings
}

export type TimerActions = {
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  addSolve: (solve: Omit<Solve, 'id' | 'timestamp'>) => void
  removeSolve: (id: string) => void
  updateSolvePenalty: (id: string, penalty: 'none' | '+2' | 'DNF') => void
  setEvent: (event: string) => void
  setScramble: (scramble: string) => void
  updateSettings: (settings: Partial<Settings>) => void
  clearAllSolves: () => void
}


const THEMES = {
  catppuccin: {
    background: '#1e1e2e',
    foreground: '#cdd6f4',
    primary: '#cba6f7',
    secondary: '#313244',
    accent: '#f5c2e7',
    card: '#181825',
    border: '#45475a',
    muted: '#6c7086',
    success: '#a6e3a1',
    warning: '#f9e2af',
    error: '#f38ba8'
  },
  cyberpunk: {
    background: '#0a0a0f',
    foreground: '#f0f0f5',
    primary: '#ff00ff',
    secondary: '#1a0a1a',
    accent: '#00ffff',
    card: '#0f050f',
    border: '#ff00ff',
    muted: '#666666',
    success: '#00ff00',
    warning: '#ffff00',
    error: '#ff0055'
  },
  'matcha-dark': {
    background: '#1a1f1a',
    foreground: '#d4e8d4',
    primary: '#7cb342',
    secondary: '#2a3a2a',
    accent: '#aed581',
    card: '#0f1f0f',
    border: '#4a6a4a',
    muted: '#6a8a6a',
    success: '#81c784',
    warning: '#ffb74d',
    error: '#e57373'
  },
  'matcha-light': {
    background: '#f1f8e9',
    foreground: '#1b5e20',
    primary: '#558b2f',
    secondary: '#dcedc8',
    accent: '#7cb342',
    card: '#e8f5e9',
    border: '#a5d6a7',
    muted: '#689f38',
    success: '#43a047',
    warning: '#fb8c00',
    error: '#e53935'
  },
  'kimbie-dark': {
    background: '#221a0f',
    foreground: '#d3af86',
    primary: '#dc3958',
    secondary: '#362c24',
    accent: '#f79a32',
    card: '#18100a',
    border: '#5e4b35',
    muted: '#8b7355',
    success: '#889b4a',
    warning: '#f06431',
    error: '#dc3958'
  },
  black: {
    background: '#000000',
    foreground: '#ffffff',
    primary: '#ffffff',
    secondary: '#111111',
    accent: '#888888',
    card: '#0a0a0a',
    border: '#333333',
    muted: '#666666',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444'
  }
}

export { THEMES }

export const useTimerStore = create<TimerState & TimerActions>()(
  persist(
    (set, get) => ({
      isRunning: false,
      isReady: false,
      startTime: null,
      currentTime: 0,
      solves: [],
      currentEvent: '3x3x3',
      currentScramble: '',
      settings: {
        font: 'jetbrains',
        theme: 'black',
        inspectionTime: 15,
      },

      startTimer: () => {
        set({ 
          isRunning: true, 
          isReady: false,
          startTime: Date.now(),
          currentTime: 0
        })
      },

      stopTimer: () => {
        const { startTime } = get()
        if (startTime) {
          const finalTime = Date.now() - startTime
          set({ 
            isRunning: false, 
            currentTime: finalTime,
            startTime: null
          })
        }
      },

      resetTimer: () => {
        set({ 
          isRunning: false, 
          isReady: false,
          startTime: null, 
          currentTime: 0 
        })
      },

      addSolve: (solve) => {
        const newSolve: Solve = {
          ...solve,
          id: Date.now().toString(),
          timestamp: new Date()
        }
        set((state) => ({
          solves: [...state.solves, newSolve]
        }))
      },

      removeSolve: (id) => {
        set((state) => ({
          solves: state.solves.filter(solve => solve.id !== id)
        }))
      },

      updateSolvePenalty: (id, penalty) => {
        set((state) => ({
          solves: state.solves.map(solve => 
            solve.id === id ? { ...solve, penalty } : solve
          )
        }))
      },

      setEvent: (event) => {
        set({ currentEvent: event })
      },

      setScramble: (scramble) => {
        set({ currentScramble: scramble })
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }))
      },

      clearAllSolves: () => {
        set({ solves: [] })
      }
    }),
    {
      name: 'cubytimer-storage',
      partialize: (state) => ({
        solves: state.solves,
        settings: state.settings,
        currentEvent: state.currentEvent
      })
    }
  )
)
