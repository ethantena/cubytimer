'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Timer, BarChart3, Settings, Shield } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Timer', icon: Timer },
    { href: '/stats', label: 'Statistics', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings }
  ]

  return (
    <nav className="bg-card border border-border rounded-xl p-2 mb-6 ascii-interface">
      <div className="flex justify-center">
        <div className="flex gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ascii-btn ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
