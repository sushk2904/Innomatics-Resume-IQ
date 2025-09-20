"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Lightbulb, FileText, Target, TrendingUp, Download, Copy, RefreshCw, Sparkles, CheckCircle } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface Suggestion {
  id: string
  type: "bullet-point" | "skill" | "section" | "formatting"
  title: string
  description: string
  before?: string
  after: string
  impact: "high" | "medium" | "low"
}

const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    type: "bullet-point",
    title: "Quantify Achievements",
    description: "Add specific metrics to demonstrate impact",
    before: "Improved website performance",
    after:
      "Improved website performance by 40%, reducing load time from 3.2s to 1.9s, resulting in 25% increase in user engagement",
    impact: "high",
  },
  {
    id: "2",
    type: "skill",
    title: "Add Missing Technical Skills",
    description: "Include relevant skills mentioned in job description",
    after: "Docker, Kubernetes, AWS Lambda, GraphQL, Jest Testing Framework",
    impact: "high",
  },
  {
    id: "3",
    type: "section",
    title: "Add Projects Section",
    description: "Showcase relevant projects to demonstrate practical experience",
    after:
      "PROJECTS\n• E-commerce Platform - Built responsive React app with TypeScript, integrated Stripe payments, deployed on AWS\n• Task Management Tool - Developed full-stack application using Node.js, MongoDB, implemented real-time updates",
    impact: "medium",
  },
  {
    id: "4",
    type: "bullet-point",
    title: "Strengthen Action Verbs",
    description: "Use more impactful action verbs to describe responsibilities",
    before: "Worked on frontend development tasks",
    after:
      "Architected and implemented responsive frontend components, collaborating with cross-functional teams to deliver user-centric solutions",
    impact: "medium",
  },
]

export default function AISuggestionsPage() {
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bullet-point":
        return <Target className="w-4 h-4" />
      case "skill":
        return <TrendingUp className="w-4 h-4" />
      case "section":
        return <FileText className="w-4 h-4" />
      case "formatting":
        return <Sparkles className="w-4 h-4" />
      default:
        return <Lightbulb className="w-4 h-4" />
    }
  }

  const toggleSuggestion = (id: string) => {
    setSelectedSuggestions((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const generateImprovedContent = () => {
    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      const selected = mockSuggestions.filter((s) => selectedSuggestions.includes(s.id))
      const content = selected.map((s) => s.after).join("\n\n")
      setGeneratedContent(content)
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI-Powered Resume Suggestions
            </h1>
            <p className="text-slate-300 text-lg">
              Get personalized recommendations to improve resume relevance and impact
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Suggestions List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Improvement Suggestions</h2>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {mockSuggestions.length} suggestions
                </Badge>
              </div>

              {mockSuggestions.map((suggestion) => (
                <Card
                  key={suggestion.id}
                  className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer ${
                    selectedSuggestions.includes(suggestion.id) ? "ring-2 ring-blue-500/50 bg-blue-500/10" : ""
                  }`}
                  onClick={() => toggleSuggestion(suggestion.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          {getTypeIcon(suggestion.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{suggestion.title}</h3>
                          <p className="text-slate-400 text-sm">{suggestion.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getImpactColor(suggestion.impact)} border text-xs`}>
                          {suggestion.impact} impact
                        </Badge>
                        {selectedSuggestions.includes(suggestion.id) && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                    </div>

                    {suggestion.before && (
                      <div className="mb-4">
                        <p className="text-sm text-slate-400 mb-2">Before:</p>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <p className="text-sm text-slate-300">{suggestion.before}</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-slate-400 mb-2">
                        {suggestion.before ? "After:" : "Suggested addition:"}
                      </p>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <p className="text-sm text-slate-300">{suggestion.after}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(suggestion.after)
                        }}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Generated Content */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Generated Improvements</h2>
                <div className="flex space-x-2">
                  <Button
                    onClick={generateImprovedContent}
                    disabled={selectedSuggestions.length === 0 || isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Generate
                  </Button>
                </div>
              </div>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <div className="p-6">
                  {selectedSuggestions.length === 0 ? (
                    <div className="text-center py-12">
                      <Lightbulb className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400">Select suggestions to generate improved content</p>
                    </div>
                  ) : generatedContent ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Improved Content</h3>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(generatedContent)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy All
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        className="min-h-[400px] bg-white/5 border-white/20 text-white resize-none"
                        placeholder="Generated content will appear here..."
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Button
                        onClick={generateImprovedContent}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {isGenerating ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        Generate Improved Content
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
