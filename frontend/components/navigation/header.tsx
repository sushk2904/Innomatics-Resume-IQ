"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Settings, User, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-white/20 text-white">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button variant="ghost" size="sm" onClick={onMenuClick} className="hover:bg-white/10 md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          )}

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search candidates, skills, or locations..."
              className="pl-10 w-80 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm font-semibold text-green-400">89</div>
              <div className="text-xs text-slate-400">High Match</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-yellow-400">102</div>
              <div className="text-xs text-slate-400">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-blue-400">78%</div>
              <div className="text-xs text-slate-400">Avg Score</div>
            </div>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-white/10">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="hover:bg-white/10">
            <Settings className="w-5 h-5" />
          </Button>

          {/* Profile */}
          <Button variant="ghost" size="sm" className="hover:bg-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  )
}
