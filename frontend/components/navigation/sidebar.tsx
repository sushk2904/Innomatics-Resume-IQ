"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Upload,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  Target,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Upload",
    href: "/",
    icon: Upload,
  },
  {
    title: "AI Suggestions",
    href: "/ai-suggestions",
    icon: Sparkles,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen bg-slate-900/95 backdrop-blur-md border-r border-white/20 text-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ResumeIQ
              </h1>
              <p className="text-xs text-slate-400">Innomatics</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="hover:bg-white/10">
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start hover:bg-white/10 transition-all duration-200",
                  isActive && "bg-blue-600/20 text-blue-400 border border-blue-500/30",
                  isCollapsed ? "px-2" : "px-3",
                )}
              >
                <item.icon className={cn("w-5 h-5", isCollapsed ? "" : "mr-3")} />
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.title}</div>
                  </div>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Stats Card */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Today's Stats</h3>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Processed</span>
                <span className="text-white font-medium">24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">High Match</span>
                <span className="text-green-400 font-medium">18</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Avg Score</span>
                <span className="text-blue-400 font-medium">82%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        {isCollapsed ? (
          <Button variant="ghost" className="w-full p-2 hover:bg-white/10">
            <User className="w-5 h-5" />
          </Button>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Recruiter</div>
              <div className="text-xs text-slate-400">admin@innomatics.in</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
