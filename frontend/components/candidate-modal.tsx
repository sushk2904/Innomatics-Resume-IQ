"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Mail,
  MapPin,
  Briefcase,
  CheckCircle,
  XCircle,
  TrendingUp,
  MessageSquare,
  Lightbulb,
} from "lucide-react"

interface Candidate {
  id: string
  name: string
  email: string
  location: string
  appliedDate: string
  score: number
  verdict: "High" | "Medium" | "Low"
  matchedSkills: string[]
  missingSkills: string[]
  experience: string
  resumeUrl: string
}

interface CandidateModalProps {
  candidate: Candidate
  isOpen: boolean
  onClose: () => void
}

export function CandidateModal({ candidate, isOpen, onClose }: CandidateModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500"
    if (score >= 60) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "High":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Low":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const mockExperienceTimeline = [
    {
      company: "TechCorp Inc.",
      position: "Senior Frontend Developer",
      duration: "2022 - Present",
      relevance: 95,
      skills: ["React", "TypeScript", "GraphQL"],
    },
    {
      company: "StartupXYZ",
      position: "Frontend Developer",
      duration: "2020 - 2022",
      relevance: 85,
      skills: ["JavaScript", "Vue.js", "CSS"],
    },
    {
      company: "WebAgency",
      position: "Junior Developer",
      duration: "2019 - 2020",
      relevance: 60,
      skills: ["HTML", "CSS", "jQuery"],
    },
  ]

  const aiSuggestions = [
    "Consider highlighting React experience more prominently in the summary section",
    "Add specific project examples demonstrating TypeScript proficiency",
    "Include metrics and achievements from previous frontend projects",
    "Mention experience with modern build tools and deployment processes",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-md border-white/20 text-white">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getScoreColor(candidate.score)} p-1 shadow-lg`}>
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{candidate.score}</div>
                  <div className="text-xs text-slate-400">%</div>
                </div>
              </div>
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white mb-1">{candidate.name}</DialogTitle>
              <div className="flex items-center space-x-4 text-slate-400 text-sm">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {candidate.email}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {candidate.location}
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {candidate.experience}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getVerdictColor(candidate.verdict)} border`}>{candidate.verdict} Match</Badge>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-1" />
              Resume
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-md">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-blue-600">
              Experience
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-blue-600">
              Skills Analysis
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-blue-600">
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score Breakdown */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Score Breakdown
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Technical Skills</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Experience Match</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Education</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cultural Fit</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Applied Date</span>
                    <span>{new Date(candidate.appliedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Experience</span>
                    <span>{candidate.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Skills Matched</span>
                    <span className="text-green-400">{candidate.matchedSkills.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Skills Missing</span>
                    <span className="text-red-400">{candidate.missingSkills.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Overall Verdict</span>
                    <Badge className={`${getVerdictColor(candidate.verdict)} border text-xs`}>
                      {candidate.verdict}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-6">Experience Timeline vs Job Requirements</h3>
              <div className="space-y-6">
                {mockExperienceTimeline.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{exp.position}</h4>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {exp.relevance}% relevant
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-1">{exp.company}</p>
                        <p className="text-slate-400 text-sm mb-3">{exp.duration}</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill) => (
                            <Badge key={skill} className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {index < mockExperienceTimeline.length - 1 && (
                      <div className="absolute left-2 top-8 w-0.5 h-12 bg-slate-600"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Skills */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  Matched Skills ({candidate.matchedSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.matchedSkills.map((skill) => (
                    <Badge key={skill} className="bg-green-500/20 text-green-400 border-green-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <XCircle className="w-5 h-5 mr-2 text-red-400" />
                  Missing Skills ({candidate.missingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.missingSkills.map((skill) => (
                    <Badge key={skill} className="bg-red-500/20 text-red-400 border-red-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="mt-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                AI-Powered Improvement Suggestions
              </h3>
              <div className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <MessageSquare className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-300">{suggestion}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Generate Detailed Report
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
