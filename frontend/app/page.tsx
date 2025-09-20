"use client"

import type React from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Target, TrendingUp } from "lucide-react"

export default function LandingPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "resume" | "jd") => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Innomatics ResumeIQ
            </h1>
            <p className="text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered Resume Relevance Check in Seconds
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Upload resumes and job descriptions to get instant relevance scores, skill matching analysis, and
              AI-powered feedback for better hiring decisions.
            </p>
          </div>

          {/* Upload Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Resume Upload */}
              <Card className="relative overflow-hidden bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Upload Resume</h3>
                  <div className="border-2 border-dashed border-white/30 rounded-lg p-6 hover:border-blue-400/50 transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-300 mb-4">Drag & drop your resume here</p>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={(e) => handleFileUpload(e, "resume")}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload">
                      <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
                        Choose File
                      </Button>
                    </label>
                    <p className="text-xs text-slate-400 mt-2">PDF or DOCX format</p>
                  </div>
                </div>
              </Card>

              {/* Job Description Upload */}
              <Card className="relative overflow-hidden bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Upload Job Description</h3>
                  <div className="border-2 border-dashed border-white/30 rounded-lg p-6 hover:border-purple-400/50 transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-300 mb-4">Drag & drop job description here</p>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => handleFileUpload(e, "jd")}
                      className="hidden"
                      id="jd-upload"
                    />
                    <label htmlFor="jd-upload">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
                        Choose File
                      </Button>
                    </label>
                    <p className="text-xs text-slate-400 mt-2">PDF, DOCX, or TXT format</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="mt-8 max-w-md mx-auto">
                <div className="mb-2 flex justify-between text-sm text-slate-300">
                  <span>Processing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 bg-slate-700/50" />
                <div className="mt-2 text-center">
                  <div className="inline-flex items-center space-x-2 text-sm text-slate-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Analyzing document structure and content...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20">
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Recent Evaluations</h3>
                <p className="text-3xl font-bold text-green-400 mb-1">247</p>
                <p className="text-sm text-slate-400">This month</p>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Average Score</h3>
                <p className="text-3xl font-bold text-blue-400 mb-1">78%</p>
                <p className="text-sm text-slate-400">Relevance match</p>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Top Missing Skills</h3>
                <p className="text-sm text-orange-400 mb-1">React, Python</p>
                <p className="text-sm text-slate-400">Most requested</p>
              </div>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
            >
              Start Analyzing Resumes
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
