"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Filter, X, Search, MapPin, RefreshCw } from "lucide-react"

interface FiltersPanelProps {
  isOpen: boolean
  onClose: () => void
  onFiltersChange: (filters: FilterState) => void
  onSortChange: (sort: SortState) => void
  currentFilters: FilterState
  currentSort: SortState
}

export interface FilterState {
  searchTerm: string
  scoreRange: [number, number]
  verdict: string[]
  location: string[]
  experienceRange: [number, number]
  skills: string[]
  dateRange: string
}

export interface SortState {
  field: "score" | "name" | "appliedDate" | "experience"
  direction: "asc" | "desc"
}

const availableLocations = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Los Angeles, CA",
  "Chicago, IL",
  "Boston, MA",
  "Denver, CO",
]

const availableSkills = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "AWS",
  "GraphQL",
  "Docker",
  "Kubernetes",
  "CSS",
  "HTML",
  "Git",
  "SQL",
  "Java",
  "Spring",
  "MySQL",
  "Figma",
  "Vue.js",
  "Angular",
]

export function FiltersPanel({
  isOpen,
  onClose,
  onFiltersChange,
  onSortChange,
  currentFilters,
  currentSort,
}: FiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters)
  const [localSort, setLocalSort] = useState<SortState>(currentSort)

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSortChange = (field: SortState["field"], direction: SortState["direction"]) => {
    const newSort = { field, direction }
    setLocalSort(newSort)
    onSortChange(newSort)
  }

  const clearAllFilters = () => {
    const defaultFilters: FilterState = {
      searchTerm: "",
      scoreRange: [0, 100],
      verdict: [],
      location: [],
      experienceRange: [0, 10],
      skills: [],
      dateRange: "all",
    }
    setLocalFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const toggleArrayFilter = (key: "verdict" | "location" | "skills", value: string) => {
    const currentArray = localFilters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    handleFilterChange(key, newArray)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-96 h-full bg-slate-900/95 backdrop-blur-md border-r border-white/20 text-white overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Filters & Sorting</h2>
                <p className="text-sm text-slate-400">Refine your candidate search</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={onClose} className="hover:bg-white/10">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-300 mb-2 block">Search Candidates</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={localFilters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                placeholder="Search by name, email, or skills..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Sorting */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-300 mb-3 block">Sort By</label>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={localSort.field}
                onValueChange={(value: SortState["field"]) => handleSortChange(value, localSort.direction)}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  <SelectItem value="score">Relevance Score</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="appliedDate">Applied Date</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={localSort.direction}
                onValueChange={(value: SortState["direction"]) => handleSortChange(localSort.field, value)}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  <SelectItem value="desc">High to Low</SelectItem>
                  <SelectItem value="asc">Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Score Range */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-300 mb-3 block">
              Relevance Score: {localFilters.scoreRange[0]}% - {localFilters.scoreRange[1]}%
            </label>
            <Slider
              value={localFilters.scoreRange}
              onValueChange={(value) => handleFilterChange("scoreRange", value)}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Verdict Filter */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-300 mb-3 block">Match Verdict</label>
            <div className="flex flex-wrap gap-2">
              {["High", "Medium", "Low"].map((verdict) => (
                <Button
                  key={verdict}
                  size="sm"
                  variant={localFilters.verdict.includes(verdict) ? "default" : "ghost"}
                  onClick={() => toggleArrayFilter("verdict", verdict)}
                  className={`${
                    localFilters.verdict.includes(verdict)
                      ? verdict === "High"
                        ? "bg-green-600 hover:bg-green-700"
                        : verdict === "Medium"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-red-600 hover:bg-red-700"
                      : "hover:bg-white/10"
                  }`}
                >
                  {verdict}
                </Button>
              ))}
            </div>
          </div>

          {/* Experience Range */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-300 mb-3 block">
              Experience: {localFilters.experienceRange[0]} - {localFilters.experienceRange[1]} years
            </label>
            <Slider
              value={localFilters.experienceRange}
              onValueChange={(value) => handleFilterChange("experienceRange", value)}
              max={10}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-300 mb-3 block">Location</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableLocations.map((location) => (
                <Button
                  key={location}
                  size="sm"
                  variant={localFilters.location.includes(location) ? "default" : "ghost"}
                  onClick={() => toggleArrayFilter("location", location)}
                  className={`w-full justify-start text-left ${
                    localFilters.location.includes(location) ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-white/10"
                  }`}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {location}
                </Button>
              ))}
            </div>
          </div>

          {/* Skills Filter */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-300 mb-3 block">Required Skills</label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {availableSkills.map((skill) => (
                <Button
                  key={skill}
                  size="sm"
                  variant={localFilters.skills.includes(skill) ? "default" : "ghost"}
                  onClick={() => toggleArrayFilter("skills", skill)}
                  className={`text-xs ${
                    localFilters.skills.includes(skill) ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-white/10"
                  }`}
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-300 mb-3 block">Applied Date</label>
            <Select value={localFilters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          <div className="pt-4 border-t border-white/10">
            <Button
              onClick={clearAllFilters}
              variant="ghost"
              className="w-full hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
