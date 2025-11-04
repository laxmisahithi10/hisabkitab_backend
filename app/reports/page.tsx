"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  PiIcon as PieIcon,
  BarChart3,
  Calendar,
  Download,
  IndianRupee,
  Target,
  AlertTriangle,
} from "lucide-react"
import {
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  Pie,
} from "recharts"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Mock data for charts
const categoryData = [
  { name: "Food", value: 1800, color: "#15803d", budget: 3000 },
  { name: "Transport", value: 800, color: "#84cc16", budget: 1500 },
  { name: "Education", value: 1200, color: "#374151", budget: 2000 },
  { name: "Entertainment", value: 450, color: "#e63946", budget: 1000 },
  { name: "Canteen", value: 680, color: "#f0fdf4", budget: 1200 },
  { name: "Shopping", value: 320, color: "#84cc16", budget: 800 },
]

const monthlyData = [
  { month: "Jan", spent: 3200, budget: 5000, income: 8000 },
  { month: "Feb", spent: 4100, budget: 5000, income: 8000 },
  { month: "Mar", spent: 3800, budget: 5000, income: 8000 },
  { month: "Apr", spent: 4500, budget: 5000, income: 8000 },
  { month: "May", spent: 4250, budget: 5000, income: 8000 },
  { month: "Jun", spent: 3900, budget: 5000, income: 8000 },
]

const dailySpendingData = [
  { day: "Mon", amount: 150 },
  { day: "Tue", amount: 200 },
  { day: "Wed", amount: 120 },
  { day: "Thu", amount: 180 },
  { day: "Fri", amount: 250 },
  { day: "Sat", amount: 300 },
  { day: "Sun", amount: 100 },
]

const topExpenses = [
  { description: "Dinner at restaurant", amount: 800, category: "Food", date: "2024-01-15" },
  { description: "Monthly bus pass", amount: 500, category: "Transport", date: "2024-01-01" },
  { description: "Textbooks", amount: 450, category: "Education", date: "2024-01-10" },
  { description: "Movie tickets", amount: 400, category: "Entertainment", date: "2024-01-12" },
  { description: "Groceries", amount: 350, category: "Food", date: "2024-01-08" },
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth")
  const [selectedChart, setSelectedChart] = useState("category")
  const [userData] = useLocalStorage("hisabkitab-data", {
    expenses: [],
    categories: [],
    balance: 0,
    monthlyBudget: 20000,
  })

  const handleExportReports = () => {
    const reportData = {
      period: selectedPeriod,
      totalSpent: userData.expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0),
      expenses: userData.expenses,
      categories: userData.categories,
      generatedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `hisabkitab-report-${selectedPeriod}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Calculate real data from user expenses
  const totalSpent = userData.expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0)
  const totalBudget =
    userData.categories.reduce((sum: any, item: any) => sum + item.budget, 0) || userData.monthlyBudget
  const budgetUtilization = (totalSpent / totalBudget) * 100

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Reports & Analytics</h1>
            <p className="text-muted-foreground">Detailed insights into your spending patterns</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="last3Months">Last 3 Months</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportReports}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                <span>Total Spent</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">₹{totalSpent.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                Based on your expenses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Target className="h-5 w-5 text-secondary" />
                <span>Budget Usage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">{budgetUtilization.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">₹{(totalBudget - totalSpent).toLocaleString()} remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Daily Average</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{Math.round(totalSpent / 30)}</p>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userData.categories.length}</p>
              <p className="text-sm text-muted-foreground">Active spending categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs value={selectedChart} onValueChange={setSelectedChart} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="category">Category Breakdown</TabsTrigger>
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
            <TabsTrigger value="daily">Daily Spending</TabsTrigger>
            <TabsTrigger value="comparison">Budget vs Actual</TabsTrigger>
          </TabsList>

          <TabsContent value="category" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieIcon className="h-5 w-5" />
                    <span>Spending by Category</span>
                  </CardTitle>
                  <CardDescription>Distribution of expenses across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, "Amount"]} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Details</CardTitle>
                  <CardDescription>Breakdown with budget comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryData.map((category, index) => {
                      const percentage = (category.value / category.budget) * 100
                      const isOverBudget = percentage > 100
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                              <span className="font-medium">{category.name}</span>
                              {isOverBudget && <AlertTriangle className="h-4 w-4 text-destructive" />}
                            </div>
                            <span className="text-sm">
                              ₹{category.value.toLocaleString()} / ₹{category.budget.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min(percentage, 100)}%`,
                                backgroundColor: isOverBudget ? "#e63946" : category.color,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{percentage.toFixed(1)}% used</span>
                            {isOverBudget && (
                              <Badge variant="destructive" className="text-xs">
                                Over by ₹{(category.value - category.budget).toLocaleString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Monthly Spending Trends</span>
                </CardTitle>
                <CardDescription>Track your spending patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="spent" fill="#15803d" name="Spent" />
                    <Bar dataKey="budget" fill="#84cc16" name="Budget" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Daily Spending Pattern</span>
                </CardTitle>
                <CardDescription>Your spending habits throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailySpendingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="amount" stroke="#15803d" fill="#15803d" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual Spending</CardTitle>
                <CardDescription>Compare your planned budget with actual expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="budget" stroke="#84cc16" strokeWidth={2} name="Budget" />
                    <Line type="monotone" dataKey="spent" stroke="#15803d" strokeWidth={2} name="Actual Spent" />
                    <Line type="monotone" dataKey="income" stroke="#374151" strokeWidth={2} name="Income" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Top Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Top Expenses This Month</CardTitle>
            <CardDescription>Your largest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topExpenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-lg">₹{expense.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Smart Insights</CardTitle>
            <CardDescription>AI-powered recommendations based on your spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border">
                <h4 className="font-semibold mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                  Spending Trend
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your food expenses have increased by 15% this month. Consider meal planning to reduce costs.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-accent/10 border">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-500" />
                  Budget Alert
                </h4>
                <p className="text-sm text-muted-foreground">
                  You're on track to stay within budget this month. Great job managing your expenses!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
