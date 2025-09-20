"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, Mic, MicOff, Send, X, Bot, User, Volume2, VolumeX } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AIChatPanelProps {
  isOpen: boolean
  onClose: () => void
  candidateName?: string
}

export function AIChatPanel({ isOpen, onClose, candidateName }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: candidateName
        ? `Hi! I'm here to help you analyze ${candidateName}'s resume. What would you like to know?`
        : "Hello! I'm your AI assistant for resume analysis. How can I help you today?",
      timestamp: new Date(),
      suggestions: [
        "What are the key strengths?",
        "What skills are missing?",
        "How can this resume be improved?",
        "Is this candidate a good fit?",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [mode, setMode] = useState<"chat" | "voice">("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
        suggestions: generateSuggestions(inputValue),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const generateAIResponse = (input: string): string => {
    const responses = {
      strengths:
        "Based on the resume analysis, the key strengths include strong technical skills in React and TypeScript, 5+ years of experience, and leadership experience in previous roles. The candidate shows consistent career progression and has worked with modern technologies.",
      missing:
        "The main missing skills are Docker containerization, Kubernetes orchestration, and cloud deployment experience with AWS. These are important for the DevOps aspects of the role.",
      improve:
        "To improve this resume, I recommend: 1) Adding specific project metrics and achievements, 2) Including more details about leadership and team collaboration, 3) Highlighting experience with testing frameworks, 4) Adding certifications or continuous learning examples.",
      fit: "This candidate appears to be a strong fit for the Frontend Developer role. The 92% relevance score indicates excellent technical alignment, and the experience level matches the job requirements. I'd recommend proceeding with an interview.",
      default:
        "I've analyzed the resume and can provide insights on technical skills, experience relevance, cultural fit, and improvement suggestions. What specific aspect would you like me to focus on?",
    }

    const lowerInput = input.toLowerCase()
    if (lowerInput.includes("strength")) return responses.strengths
    if (lowerInput.includes("missing") || lowerInput.includes("lack")) return responses.missing
    if (lowerInput.includes("improve") || lowerInput.includes("better")) return responses.improve
    if (lowerInput.includes("fit") || lowerInput.includes("suitable")) return responses.fit
    return responses.default
  }

  const generateSuggestions = (input: string): string[] => {
    return [
      "Tell me more about their experience",
      "What are the salary expectations?",
      "How do they compare to other candidates?",
      "Generate a detailed report",
    ]
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Simulate voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        const voiceMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: "What are the key technical skills this candidate possesses?",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, voiceMessage])

        // AI voice response
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content:
              "The candidate has strong technical skills including React, TypeScript, JavaScript, Node.js, and GraphQL. They also have experience with modern development tools and practices. Would you like me to provide a detailed breakdown of their skill proficiency levels?",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, aiResponse])
        }, 1500)
      }, 3000)
    }
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    // Simulate voice playback
    setTimeout(() => setIsPlaying(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl h-[80vh] bg-slate-900/95 backdrop-blur-md border-white/20 text-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">AI Assistant</h2>
              <p className="text-sm text-slate-400">
                {candidateName ? `Analyzing ${candidateName}'s resume` : "Resume Analysis Helper"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex bg-white/10 rounded-lg p-1">
              <Button
                size="sm"
                variant={mode === "chat" ? "default" : "ghost"}
                onClick={() => setMode("chat")}
                className={mode === "chat" ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-white/10"}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Chat
              </Button>
              <Button
                size="sm"
                variant={mode === "voice" ? "default" : "ghost"}
                onClick={() => setMode("voice")}
                className={mode === "voice" ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-white/10"}
              >
                <Mic className="w-4 h-4 mr-1" />
                Voice
              </Button>
            </div>
            <Button size="sm" variant="ghost" onClick={onClose} className="hover:bg-white/10">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start space-x-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
                >
                  {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`rounded-lg p-4 ${
                    message.type === "user"
                      ? "bg-blue-600/20 border border-blue-500/30"
                      : "bg-white/10 border border-white/20"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  {message.type === "ai" && mode === "voice" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={togglePlayback}
                      className="mt-2 text-xs hover:bg-white/10"
                    >
                      {isPlaying ? <VolumeX className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                      {isPlaying ? "Stop" : "Play"}
                    </Button>
                  )}
                  {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs bg-white/5 hover:bg-white/10 border border-white/10"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/10">
          {mode === "chat" ? (
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about resume analysis, skills, or improvements..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Button
                size="lg"
                onClick={toggleRecording}
                className={`rounded-full w-16 h-16 ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-700 animate-pulse"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                }`}
              >
                {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
              <p className="text-sm text-slate-400 mt-2">
                {isRecording ? "Recording... Tap to stop" : "Tap to start voice recording"}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
