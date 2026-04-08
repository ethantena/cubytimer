'use client'

import { useState, useEffect } from 'react'
import { useBluetoothCube } from '@/utils/bluetoothCube'
import { Bluetooth, BluetoothOff, Battery, RotateCcw, Play, AlertCircle } from 'lucide-react'

export function BluetoothCube() {
  const { cube, isConnected, moves, connect, disconnect, clearMoves, getBatteryLevel, formatMovesToScramble } = useBluetoothCube()
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isBluetoothSupported, setIsBluetoothSupported] = useState(true)

  useEffect(() => {
    // Check if Bluetooth is supported
    const supported = typeof navigator !== 'undefined' && 'bluetooth' in navigator
    setIsBluetoothSupported(supported)
  }, [])

  const handleConnect = async () => {
    setIsConnecting(true)
    const success = await connect()
    setIsConnecting(false)
    
    if (success) {
      // Try to get battery level
      const level = await getBatteryLevel()
      setBatteryLevel(level)
    }
  }

  const handleDisconnect = async () => {
    await disconnect()
    setBatteryLevel(null)
  }

  const handleClearMoves = () => {
    clearMoves()
  }

  const handleGetBattery = async () => {
    const level = await getBatteryLevel()
    setBatteryLevel(level)
  }

  if (!isBluetoothSupported) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-warning/20 rounded-lg">
            <AlertCircle className="text-warning" size={20} />
          </div>
          <h3 className="text-lg font-light">Smart Cube</h3>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Bluetooth is not supported in this browser.</p>
          <p className="mt-1">Use Chrome, Edge, or Opera to connect smart cubes.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-light">Smart Cube</h3>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Bluetooth className="text-green-500" size={20} />
          ) : (
            <BluetoothOff className="text-muted-foreground" size={20} />
          )}
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {cube && (
        <div className="mb-4 p-3 bg-secondary rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Device:</span> {cube.name}
          </p>
          {batteryLevel !== null && (
            <p className="text-sm mt-1">
              <span className="font-medium">Battery:</span> {batteryLevel}%
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground px-3 py-2 rounded-xl transition-colors text-sm"
          >
            <Bluetooth size={16} />
            {isConnecting ? 'Connecting...' : 'Connect Cube'}
          </button>
        ) : (
          <>
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-2 bg-error hover:bg-error/90 text-error-foreground px-3 py-2 rounded-xl transition-colors text-sm"
            >
              <BluetoothOff size={16} />
              Disconnect
            </button>
            <button
              onClick={handleGetBattery}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-xl transition-colors text-sm"
            >
              <Battery size={16} />
              Battery
            </button>
          </>
        )}
        
        {moves.length > 0 && (
          <button
            onClick={handleClearMoves}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-xl transition-colors text-sm"
          >
            <RotateCcw size={16} />
            Clear
          </button>
        )}
      </div>

      {moves.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Move History</span>
            <span className="text-sm text-muted-foreground">{moves.length} moves</span>
          </div>
          
          <div className="bg-secondary rounded-lg p-3 max-h-32 overflow-y-auto">
            <p className="font-mono text-sm break-all">
              {formatMovesToScramble(moves.slice(-20))}
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            Last 20 moves shown
          </div>
        </div>
      )}

      {!isConnected && (
        <div className="text-sm text-muted-foreground">
          <p>Connect your smart cube to track moves automatically.</p>
          <p className="mt-1">Make sure your cube supports Bluetooth and is in pairing mode.</p>
        </div>
      )}
    </div>
  )
}
