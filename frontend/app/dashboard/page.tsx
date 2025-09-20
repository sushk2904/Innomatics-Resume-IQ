"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  SlidersHorizontal,
} from "lucide-react"
import { CandidateModal } from "@/components/candidate-modal"
import { AIFloatingButton } from "@/components/ai-floating-button"
import { FiltersPanel, type FilterState, type SortState } from "@/components/filters-panel"
import { MainLayout } from "@/components/layout/main-layout"

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

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    location: "San Francisco, CA",
    appliedDate: "2024-01-15",
    score: 92,
    verdict: "High",
    matchedSkills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    missingSkills: ["Docker", "Kubernetes"],
    experience: "5 years",
    resumeUrl: "/resumes/sarah-johnson.pdf",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    location: "New York, NY",
    appliedDate: "2024-01-14",
    score: 78,
    verdict: "Medium",
    matchedSkills: ["JavaScript", "Python", "SQL", "Git"],
    missingSkills: ["React", "AWS", "TypeScript", "GraphQL"],
    experience: "3 years",
    resumeUrl: "/resumes/michael-chen.pdf",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    location: "Austin, TX",
    appliedDate: "2024-01-13",
    score: 85,
    verdict: "High",
    matchedSkills: ["React", "JavaScript", "CSS", "HTML", "Git", "Figma"],
    missingSkills: ["TypeScript", "Node.js", "AWS"],
    experience: "4 years",
    resumeUrl: "/resumes/emily-rodriguez.pdf",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    location: "Seattle, WA",
    appliedDate: "2024-01-12",
    score: 65,
    verdict: "Medium",
    matchedSkills: ["Java", "Spring", "MySQL", "Git"],
    missingSkills: ["React", "JavaScript", "TypeScript", "AWS", "Docker"],
    experience: "2 years",
    resumeUrl: "/resumes/david-kim.pdf",
  },
  {
    id: "5",
    name: "Lisa Wang",
    email: "lisa.wang@email.com",
    location: "Los Angeles, CA",
    appliedDate: "2024-01-11",
    score: 45,
    verdict: "Low",
    matchedSkills: ["HTML", "CSS", "JavaScript"],
    missingSkills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL", "Docker"],
    experience: "1 year",
    resumeUrl: "/resumes/lisa-wang.pdf",
  },
]

export default function Dashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    scoreRange: [0, 100],
    verdict: [],
    location: [],
    experienceRange: [0, 10],
    skills: [],
    dateRange: "all",
  })

  const [sort, setSort] = useState<SortState>({
    field: "score",
    direction: "desc",
  })

  const filteredAndSortedCandidates = useMemo(() => {
    const filtered = mockCandidates.filter((candidate) => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const matchesSearch =
          candidate.name.toLowerCase().includes(searchLower) ||
          candidate.email.toLowerCase().includes(searchLower) ||
          candidate.matchedSkills.some((skill) => skill.toLowerCase().includes(searchLower)) ||
          candidate.missingSkills.some((skill) => skill.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }

      // Score range filter
      if (candidate.score < filters.scoreRange[0] || candidate.score > filters.scoreRange[1]) {
        return false
      }

      // Verdict filter
      if (filters.verdict.length > 0 && !filters.verdict.includes(candidate.verdict)) {
        return false
      }

      // Location filter
      if (filters.location.length > 0 && !filters.location.includes(candidate.location)) {
        return false
      }

      // Experience filter
      const expYears = Number.parseInt(candidate.experience.split(" ")[0])
      if (expYears < filters.experienceRange[0] || expYears > filters.experienceRange[1]) {
        return false
      }

      // Skills filter
      if (filters.skills.length > 0) {
        const hasRequiredSkills = filters.skills.some((skill) => candidate.matchedSkills.includes(skill))
        if (!hasRequiredSkills) return false
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const appliedDate = new Date(candidate.appliedDate)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24))

        switch (filters.dateRange) {
          case "today":
            if (daysDiff > 0) return false
            break
          case "week":
            if (daysDiff > 7) return false
            break
          case "month":
            if (daysDiff > 30) return false
            break
          case "quarter":
            if (daysDiff > 90) return false
            break
        }
      }

      return true
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sort.field) {
        case "score":
          aValue = a.score
          bValue = b.score
          break
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "appliedDate":
          aValue = new Date(a.appliedDate)
          bValue = new Date(b.appliedDate)
          break
        case "experience":
          aValue = Number.parseInt(a.experience.split(" ")[0])
          bValue = Number.parseInt(b.experience.split(" ")[0])
          break
        default:
          return 0
      }

      if (sort.direction === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [filters, sort])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500"
    if (score >= 60) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  const getScoreGlow = (score: number) => {
    if (score >= 80) return "shadow-green-500/30"
    if (score >= 60) return "shadow-yellow-500/30"
    return "shadow-red-500/30"
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

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setIsModalOpen(true)
  }

  const stats = useMemo(() => {
    const total = filteredAndSortedCandidates.length
    const high = filteredAndSortedCandidates.filter((c) => c.verdict === "High").length
    const medium = filteredAndSortedCandidates.filter((c) => c.verdict === "Medium").length
    const low = filteredAndSortedCandidates.filter((c) => c.verdict === "Low").length
    return { total, high, medium, low }
  }, [filteredAndSortedCandidates])

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Resume Evaluation Dashboard
              </h1>
              <p className="text-slate-300 text-lg">
                Analyze candidate relevance scores and skill matching for Frontend Developer position
              </p>
            </div>
            <Button
              onClick={() => setIsFiltersOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters & Sort
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Candidates</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <User className="w-8 h-8 text-blue-400" />
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">High Match</p>
                <p className="text-2xl font-bold text-green-400">{stats.high}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Medium Match</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.medium}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Low Match</p>
                <p className="text-2xl font-bold text-red-400">{stats.low}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-400" />
            </div>
          </Card>
        </div>

        {(filters.searchTerm ||
          filters.verdict.length > 0 ||
          filters.location.length > 0 ||
          filters.skills.length > 0) && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Active Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.searchTerm && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Search: {filters.searchTerm}</Badge>
              )}
              {filters.verdict.map((verdict) => (
                <Badge key={verdict} className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {verdict} Match
                </Badge>
              ))}
              {filters.location.map((location) => (
                <Badge key={location} className="bg-green-500/20 text-green-400 border-green-500/30">
                  {location}
                </Badge>
              ))}
              {filters.skills.map((skill) => (
                <Badge key={skill} className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedCandidates.map((candidate) => (
            <Card
              key={candidate.id}
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group"
              onClick={() => handleCandidateClick(candidate)}
            >
              <div className="p-6">
                {/* Header with Score Gauge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {candidate.name}
                    </h3>
                    <div className="flex items-center text-slate-400 text-sm mb-1">
                      <Mail className="w-4 h-4 mr-1" />
                      {candidate.email}
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {candidate.location}
                    </div>
                  </div>

                  {/* Circular Score Gauge */}
                  <div className="relative">
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-r ${getScoreColor(candidate.score)} p-1 shadow-lg ${getScoreGlow(candidate.score)} group-hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{candidate.score}</div>
                          <div className="text-xs text-slate-400">%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verdict Badge */}
                <div className="mb-4">
                  <Badge className={`${getVerdictColor(candidate.verdict)} border`}>{candidate.verdict} Match</Badge>
                </div>

                {/* Skills Preview */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-sm text-slate-300">Matched Skills ({candidate.matchedSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {candidate.matchedSkills.slice(0, 3).map((skill) => (
                      <Badge key={skill} className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.matchedSkills.length > 3 && (
                      <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 text-xs">
                        +{candidate.matchedSkills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center mb-2">
                    <XCircle className="w-4 h-4 text-red-400 mr-2" />
                    <span className="text-sm text-slate-300">Missing Skills ({candidate.missingSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {candidate.missingSkills.slice(0, 2).map((skill) => (
                      <Badge key={skill} className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.missingSkills.length > 2 && (
                      <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 text-xs">
                        +{candidate.missingSkills.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center text-slate-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCandidateClick(candidate)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredAndSortedCandidates.length === 0 ? (
          <div className="text-center mt-12">
            <div className="text-slate-400 text-lg mb-4">No candidates match your current filters</div>
            <Button
              onClick={() => setIsFiltersOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Adjust Filters
            </Button>
          </div>
        ) : (
          <div className="text-center mt-8">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
              Load More Candidates ({filteredAndSortedCandidates.length} shown)
            </Button>
          </div>
        )}
      </div>

      {/* AI Floating Button */}
      <AIFloatingButton />

      <FiltersPanel
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        currentFilters={filters}
        currentSort={sort}
      />

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedCandidate(null)
          }}
        />
      )}
    </MainLayout>
  )
}
