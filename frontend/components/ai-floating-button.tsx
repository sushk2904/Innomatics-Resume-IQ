"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, Sparkles } from "lucide-react"
import { AIChatPanel } from "./ai-chat-panel"

interface AIFloatingButtonProps {
  candidateName?: string
}

export function AIFloatingButton({ candidateName }: AIFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-110 z-40"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
        </div>
      </Button>

      <AIChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} candidateName={candidateName} />
    </>
  )
}
