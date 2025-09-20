"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, TrendingUp, Users, Target, BarChart3, PieChart } from "lucide-react"

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedReport, setSelectedReport] = useState("overview")

  const reportTypes = [
    { id: "overview", name: "Overview Report", description: "Complete hiring analytics" },
    { id: "skills", name: "Skills Analysis", description: "Most requested vs available skills" },
    { id: "performance", name: "Performance Metrics", description: "Screening efficiency stats" },
    { id: "trends", name: "Hiring Trends", description: "Patterns over time" },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-slate-300 text-lg mt-2">Generate comprehensive hiring insights and performance reports</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <Card
            key={report.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedReport === report.id
                ? "bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/20"
                : "bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15"
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="p-6 text-center">
              <FileText className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <h3 className="font-semibold text-white mb-2">{report.name}</h3>
              <p className="text-sm text-slate-400">{report.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Processed</p>
              <p className="text-3xl font-bold text-white">1,247</p>
              <p className="text-green-400 text-sm">+12% from last month</p>
            </div>
            <Users className="w-10 h-10 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Average Score</p>
              <p className="text-3xl font-bold text-white">78.5%</p>
              <p className="text-green-400 text-sm">+3.2% improvement</p>
            </div>
            <Target className="w-10 h-10 text-green-400" />
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">High Matches</p>
              <p className="text-3xl font-bold text-white">389</p>
              <p className="text-green-400 text-sm">31% of total</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-400" />
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Time Saved</p>
              <p className="text-3xl font-bold text-white">156h</p>
              <p className="text-blue-400 text-sm">vs manual screening</p>
            </div>
            <BarChart3 className="w-10 h-10 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Detailed Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills Analysis */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-400" />
            Top Skills in Demand
          </h3>
          <div className="space-y-4">
            {[
              { skill: "React", demand: 89, availability: 67 },
              { skill: "TypeScript", demand: 76, availability: 45 },
              { skill: "Node.js", demand: 68, availability: 52 },
              { skill: "AWS", demand: 64, availability: 38 },
              { skill: "Python", demand: 58, availability: 71 },
            ].map((item) => (
              <div key={item.skill} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white font-medium">{item.skill}</span>
                  <span className="text-slate-400">
                    {item.demand}% demand / {item.availability}% available
                  </span>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${item.demand}%` }} />
                  </div>
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${item.availability}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Trends */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Screening Performance
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Processing Speed</span>
                <span className="text-green-400">+24% faster</span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-3/4" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Accuracy Rate</span>
                <span className="text-blue-400">94.2%</span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-[94%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">False Positives</span>
                <span className="text-yellow-400">5.8%</span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full w-[6%]" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Screening Activity</h3>
        <div className="space-y-4">
          {[
            { time: "2 hours ago", action: "Processed 15 resumes for Frontend Developer role", score: "Avg: 82%" },
            { time: "5 hours ago", action: "Generated skills gap report for Q1 hiring", score: "12 insights" },
            { time: "1 day ago", action: "Screened 28 candidates for Full Stack position", score: "Avg: 76%" },
            { time: "2 days ago", action: "AI suggestions applied to 8 resumes", score: "+15% improvement" },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div>
                <p className="text-white font-medium">{activity.action}</p>
                <p className="text-slate-400 text-sm">{activity.time}</p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{activity.score}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
