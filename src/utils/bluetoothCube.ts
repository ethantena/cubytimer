import { useState, useEffect } from 'react'

// Type declarations for Web Bluetooth API
declare global {
  interface Navigator {
    bluetooth?: Bluetooth
  }
  
  interface RequestDeviceOptions {
    acceptAllDevices?: boolean
    filters?: BluetoothRequestDeviceFilter[]
    optionalServices?: BluetoothServiceUUID[]
  }
  
  interface BluetoothRequestDeviceFilter {
    services?: BluetoothServiceUUID[]
    name?: string
    namePrefix?: string
  }
  
  type BluetoothServiceUUID = number | string
  type BluetoothCharacteristicUUID = number | string
  
  interface Bluetooth {
    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>
  }
  
  interface BluetoothDevice extends EventTarget {
    name: string
    gatt?: BluetoothRemoteGATTServer | null
    addEventListener(type: string, listener: EventListener): void
  }
  
  interface BluetoothRemoteGATTServer {
    connect(): Promise<BluetoothRemoteGATTServer>
    getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>
    getPrimaryServices(): Promise<BluetoothRemoteGATTService[]>
    connected: boolean
    disconnect(): void
  }
  
  interface BluetoothRemoteGATTService {
    getCharacteristic(characteristic: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic>
    getCharacteristics(): Promise<BluetoothRemoteGATTCharacteristic[]>
  }
  
  interface BluetoothRemoteGATTCharacteristic extends EventTarget {
    value: DataView | null
    properties: BluetoothCharacteristicProperties
    startNotifications(): Promise<void>
    stopNotifications(): Promise<void>
    readValue(): Promise<DataView>
    writeValue(value: BufferSource): Promise<void>
    addEventListener(type: string, listener: EventListener): void
  }
  
  interface BluetoothCharacteristicProperties {
    broadcast?: boolean
    read?: boolean
    writeWithoutResponse?: boolean
    write?: boolean
    notify?: boolean
    indicate?: boolean
    authenticatedSignedWrites?: boolean
    reliableWrite?: boolean
    writableAuxiliaries?: boolean
  }
}

export interface BluetoothCube {
  device: BluetoothDevice
  characteristic?: BluetoothRemoteGATTCharacteristic
  isConnected: boolean
  name: string
}

export interface CubeMove {
  face: string
  amount: number // 1, 2, or 3 (equivalent to -1)
  timestamp: number
}

export class BluetoothCubeManager {
  private cube: BluetoothCube | null = null
  private moveBuffer: CubeMove[] = []
  private onMoveCallback?: (moves: CubeMove[]) => void
  private onConnectionChangeCallback?: (isConnected: boolean) => void

  constructor() {
    this.checkBluetoothSupport()
  }

  private checkBluetoothSupport(): boolean {
    if (typeof navigator === 'undefined' || !navigator.bluetooth) {
      // Silently handle unsupported browsers - don't log errors to console
      return false
    }
    return true
  }

  async connectCube(): Promise<boolean> {
    if (!this.checkBluetoothSupport()) {
      return false
    }

    try {
      // Request Bluetooth device with cube service
      const device = await navigator.bluetooth!.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
          '0000180a-0000-1000-8000-00805f9b34fb', // Device Information Service
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART Service (common for custom devices)
          '0000ffe1-0000-1000-8000-00805f9b34fb', // Custom service for some cubes
        ]
      })

      if (!device) {
        return false
      }

      // Connect to GATT server
      const server = await device.gatt?.connect()
      if (!server) {
        return false
      }

      // Try to find the right characteristic for cube moves
      let characteristic: BluetoothRemoteGATTCharacteristic | undefined

      // Try Nordic UART Service first
      try {
        const uartService = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e')
        characteristic = await uartService.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e') // RX characteristic
      } catch (e) {
        // Try other services
        const services = await server.getPrimaryServices()
        for (const service of services) {
          try {
            const characteristics = await service.getCharacteristics()
            for (const char of characteristics) {
              if (char.properties.notify || char.properties.read) {
                characteristic = char
                break
              }
            }
            if (characteristic) break
          } catch (e) {
            continue
          }
        }
      }

      if (!characteristic) {
        console.error('Could not find suitable characteristic for cube communication')
        return false
      }

      // Setup event listeners
      this.setupEventListeners(device, characteristic)

      this.cube = {
        device,
        characteristic,
        isConnected: true,
        name: device.name || 'Unknown Cube'
      }

      this.onConnectionChangeCallback?.(true)
      return true

    } catch (error: any) {
      console.error('Failed to connect to Bluetooth cube:', error)
      return false
    }
  }

  private setupEventListeners(device: BluetoothDevice, characteristic: BluetoothRemoteGATTCharacteristic) {
    // Handle disconnection
    device.addEventListener('gattserverdisconnected', () => {
      if (this.cube) {
        this.cube.isConnected = false
        this.onConnectionChangeCallback?.(false)
      }
    })

    // Start notifications if supported
    if (characteristic.properties.notify) {
      characteristic.startNotifications().then(() => {
        characteristic.addEventListener('characteristicvaluechanged', this.handleCharacteristicValueChanged.bind(this))
      }).catch(error => {
        console.error('Failed to start notifications:', error)
      })
    }
  }

  private handleCharacteristicValueChanged(event: Event) {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic
    const value = characteristic.value
    
    if (!value) return

    // Parse the cube data (this will vary depending on the cube manufacturer)
    const moves = this.parseCubeData(value)
    
    if (moves.length > 0) {
      this.moveBuffer.push(...moves)
      this.onMoveCallback?.(moves)
    }
  }

  private parseCubeData(data: DataView): CubeMove[] {
    const moves: CubeMove[] = []
    const timestamp = Date.now()

    // This is a generic parser - you'll need to customize it based on your specific cube
    // Different cube manufacturers use different data formats
    
    // Example for a generic cube (you'll need to adapt this)
    for (let i = 0; i < data.byteLength; i++) {
      const byte = data.getUint8(i)
      
      // Generic move parsing - this is just an example
      if (byte >= 0x01 && byte <= 0x06) {
        const faces = ['U', 'R', 'F', 'D', 'L', 'B']
        const face = faces[byte - 1]
        const amount = 1 // Default to clockwise
        
        moves.push({ face, amount, timestamp })
      } else if (byte >= 0x11 && byte <= 0x16) {
        // Counter-clockwise moves
        const faces = ['U', 'R', 'F', 'D', 'L', 'B']
        const face = faces[byte - 0x11]
        const amount = 3 // Equivalent to -1
        
        moves.push({ face, amount, timestamp })
      } else if (byte >= 0x21 && byte <= 0x26) {
        // Double moves
        const faces = ['U', 'R', 'F', 'D', 'L', 'B']
        const face = faces[byte - 0x21]
        const amount = 2
        
        moves.push({ face, amount, timestamp })
      }
    }

    return moves
  }

  async disconnectCube(): Promise<void> {
    if (this.cube?.device.gatt?.connected) {
      await this.cube.device.gatt.disconnect()
    }
    
    if (this.cube) {
      this.cube.isConnected = false
      this.onConnectionChangeCallback?.(false)
      this.cube = null
    }
    
    this.moveBuffer = []
  }

  isConnected(): boolean {
    return this.cube?.isConnected ?? false
  }

  getCubeInfo(): BluetoothCube | null {
    return this.cube
  }

  getMoveHistory(): CubeMove[] {
    return [...this.moveBuffer]
  }

  clearMoveHistory(): void {
    this.moveBuffer = []
  }

  // Event handlers
  onMove(callback: (moves: CubeMove[]) => void): void {
    this.onMoveCallback = callback
  }

  onConnectionChange(callback: (isConnected: boolean) => void): void {
    this.onConnectionChangeCallback = callback
  }

  // Utility methods
  formatMovesToScramble(moves: CubeMove[]): string {
    return moves.map(move => {
      const suffix = move.amount === 2 ? '2' : move.amount === 3 ? "'" : ''
      return move.face + suffix
    }).join(' ')
  }

  // Get battery level if supported
  async getBatteryLevel(): Promise<number | null> {
    if (!this.cube?.device.gatt?.connected) return null

    try {
      const batteryService = await this.cube.device.gatt.getPrimaryService('0000180f-0000-1000-8000-00805f9b34fb')
      const batteryLevelChar = await batteryService.getCharacteristic('00002a19-0000-1000-8000-00805f9b34fb')
      const value = await batteryLevelChar.readValue()
      return value.getUint8(0)
    } catch (error) {
      console.error('Failed to get battery level:', error)
      return null
    }
  }

  // Send command to cube (if supported)
  async sendCommand(command: Uint8Array): Promise<boolean> {
    if (!this.cube?.characteristic || !this.cube.characteristic.properties.write) {
      return false
    }

    try {
      await this.cube.characteristic.writeValue(command.buffer as BufferSource)
      return true
    } catch (error) {
      console.error('Failed to send command:', error)
      return false
    }
  }
}

// Singleton instance with lazy initialization
let bluetoothCubeManagerInstance: BluetoothCubeManager | null = null

function getBluetoothCubeManager(): BluetoothCubeManager {
  if (!bluetoothCubeManagerInstance) {
    bluetoothCubeManagerInstance = new BluetoothCubeManager()
  }
  return bluetoothCubeManagerInstance
}

// Hook for React components
export function useBluetoothCube() {
  const [cube, setCube] = useState<BluetoothCube | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [moves, setMoves] = useState<CubeMove[]>([])
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if Bluetooth is supported before creating manager
    const supported = typeof navigator !== 'undefined' && 'bluetooth' in navigator
    setIsSupported(supported)
    
    if (!supported) {
      return
    }

    const manager = getBluetoothCubeManager()
    
    // Set up event listeners
    manager.onConnectionChange((connected) => {
      setIsConnected(connected)
      setCube(manager.getCubeInfo())
    })

    manager.onMove((newMoves) => {
      setMoves(prev => [...prev, ...newMoves])
    })

    // Initial state
    setIsConnected(manager.isConnected())
    setCube(manager.getCubeInfo())
    setMoves(manager.getMoveHistory())

    return () => {
      // Cleanup if needed
    }
  }, [])

  const connect = async () => {
    if (!isSupported) return false
    const manager = getBluetoothCubeManager()
    return await manager.connectCube()
  }

  const disconnect = async () => {
    if (!isSupported) return
    const manager = getBluetoothCubeManager()
    await manager.disconnectCube()
    setMoves([])
  }

  const clearMoves = () => {
    if (!isSupported) return
    const manager = getBluetoothCubeManager()
    manager.clearMoveHistory()
    setMoves([])
  }

  const getBatteryLevel = async () => {
    if (!isSupported) return null
    const manager = getBluetoothCubeManager()
    return await manager.getBatteryLevel()
  }

  const formatMovesToScramble = (moves: CubeMove[]) => {
    if (!isSupported) return ''
    const manager = getBluetoothCubeManager()
    return manager.formatMovesToScramble(moves)
  }

  return {
    cube,
    isConnected,
    moves,
    connect,
    disconnect,
    clearMoves,
    getBatteryLevel,
    formatMovesToScramble
  }
}
