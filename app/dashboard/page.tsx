"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calculator,
  Plus,
  TrendingUp,
  Target,
  Flame,
  PieChart,
  Lightbulb,
  Coffee,
  Bus,
  BookOpen,
  ShoppingBag,
  Camera,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { OCRScanner } from "@/components/ocr-scanner"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Initial data structure
const initialData = {
  balance: 15750,
  monthlyBudget: 20000,
  expenses: [
    { id: 1, description: "Lunch at canteen", amount: 120, category: "Food", date: "Today" },
    { id: 2, description: "Bus fare", amount: 30, category: "Transport", date: "Today" },
    { id: 3, description: "Coffee with friends", amount: 200, category: "Food", date: "Yesterday" },
    { id: 4, description: "Notebook", amount: 150, category: "Education", date: "Yesterday" },
  ],
  goals: [
    { id: 1, name: "New Laptop", target: 50000, saved: 15750, icon: "Calculator" },
    { id: 2, name: "Trip to Goa", target: 15000, saved: 8500, icon: "Target" },
  ],
  categories: [
    { name: "Food", spent: 1800, budget: 3000, color: "bg-chart-1" },
    { name: "Transport", spent: 800, budget: 1500, color: "bg-chart-2" },
    { name: "Education", spent: 1200, budget: 2000, color: "bg-chart-3" },
    { name: "Entertainment", spent: 450, budget: 1000, color: "bg-chart-4" },
  ],
  streak: 12,
}

export default function Dashboard() {
  const [userData, setUserData] = useLocalStorage("hisabkitab-data", initialData)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isSetGoalOpen, setIsSetGoalOpen] = useState(false)
  const [newExpense, setNewExpense] = useState({ description: "", amount: "", category: "" })
  const [newGoal, setNewGoal] = useState({ name: "", target: "", saved: "0" })
  const { theme, setTheme } = useTheme()

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const expense = {
      id: Date.now(),
      description: newExpense.description,
      amount: Number.parseInt(newExpense.amount),
      category: newExpense.category,
      date: "Today",
    }

    // Update expenses and balance
    const updatedData = {
      ...userData,
      expenses: [expense, ...userData.expenses],
      balance: userData.balance - expense.amount,
    }

    // Update category spending
    const categoryIndex = updatedData.categories.findIndex((cat) => cat.name === expense.category)
    if (categoryIndex !== -1) {
      updatedData.categories[categoryIndex].spent += expense.amount
    }

    setUserData(updatedData)
    setNewExpense({ description: "", amount: "", category: "" })
    setIsAddExpenseOpen(false)
  }

  const handleSetGoal = (e: React.FormEvent) => {
    e.preventDefault()
    const goal = {
      id: Date.now(),
      name: newGoal.name,
      target: Number.parseInt(newGoal.target),
      saved: Number.parseInt(newGoal.saved),
      icon: "Target",
    }

    const updatedData = {
      ...userData,
      goals: [...userData.goals, goal],
    }

    setUserData(updatedData)
    setNewGoal({ name: "", target: "", saved: "0" })
    setIsSetGoalOpen(false)
  }

  const spent = userData.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const budgetUsagePercentage = (spent / userData.monthlyBudget) * 100

  const handleViewAllExpenses = () => {
    window.location.href = "/reports"
  }

  const handleViewDetailedReports = () => {
    window.location.href = "/reports"
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calculator className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-primary">HisabKitab</h1>
                <p className="text-xs lg:text-sm text-muted-foreground">Smart Budget Planner</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="text-right">
                <p className="text-xs lg:text-sm text-muted-foreground">Current Balance</p>
                <p className="text-lg lg:text-2xl font-bold text-primary">₹{userData.balance.toLocaleString()}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-500 transition-transform hover:rotate-12" />
                ) : (
                  <Moon className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500 transition-transform hover:-rotate-12" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <Card className="rounded-2xl shadow-sm border-0 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg lg:text-xl">Monthly Budget</CardTitle>
              <CardDescription>
                ₹{spent.toLocaleString()} of ₹{userData.monthlyBudget.toLocaleString()} used
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={budgetUsagePercentage} className="h-3 rounded-full" />
              <p className="text-sm lg:text-base text-foreground mt-2">
                {budgetUsagePercentage.toFixed(1)}% used • ₹{(userData.monthlyBudget - spent).toLocaleString()}{" "}
                remaining
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-0 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg lg:text-xl flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                <span>Streak Badge</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl lg:text-4xl font-bold text-primary animate-bounce">{userData.streak}</div>
                <p className="text-sm lg:text-base text-muted-foreground">Days of smart spending!</p>
                <Badge variant="secondary" className="animate-pulse rounded-full">
                  🔥 On Fire!
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-0 bg-gradient-to-br from-accent/5 to-accent/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg lg:text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                    <DialogDescription>Track your spending to stay within budget</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddExpense} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="e.g., Lunch at canteen"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newExpense.category}
                        onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Transport">Transport</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full rounded-xl">
                      Add Expense
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isSetGoalOpen} onOpenChange={setIsSetGoalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent rounded-xl">
                    <Target className="h-4 w-4 mr-2" />
                    Set New Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Set New Goal</DialogTitle>
                    <DialogDescription>Create a savings goal to track your progress</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSetGoal} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="goalName">Goal Name</Label>
                      <Input
                        id="goalName"
                        placeholder="e.g., New Phone, Trip to Delhi"
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        placeholder="0"
                        value={newGoal.target}
                        onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="savedAmount">Already Saved (₹)</Label>
                      <Input
                        id="savedAmount"
                        type="number"
                        placeholder="0"
                        value={newGoal.saved}
                        onChange={(e) => setNewGoal({ ...newGoal, saved: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <Button type="submit" className="w-full rounded-xl">
                      Create Goal
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl shadow-sm border-0 bg-gradient-to-br from-chart-3/5 to-chart-3/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
              <Camera className="h-5 w-5 text-primary" />
              <span>Receipt Scanner</span>
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Upload or scan receipts to automatically extract expense data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OCRScanner />
          </CardContent>
        </Card>

        {/* Daily Spending Tracker & Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card className="rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg lg:text-xl">
                Recent Expenses
                <Button variant="ghost" size="sm" className="rounded-xl" onClick={handleViewAllExpenses}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userData.expenses.slice(0, 4).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                        {expense.category === "Food" && <Coffee className="h-4 w-4 text-primary" />}
                        {expense.category === "Transport" && <Bus className="h-4 w-4 text-primary" />}
                        {expense.category === "Education" && <BookOpen className="h-4 w-4 text-primary" />}
                        {expense.category === "Entertainment" && <ShoppingBag className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm lg:text-base truncate">{expense.description}</p>
                        <p className="text-xs lg:text-sm text-muted-foreground">
                          {expense.category} • {expense.date}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-destructive text-sm lg:text-base flex-shrink-0">
                      -₹{expense.amount}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle>Savings Goals</CardTitle>
              <CardDescription>Track your progress towards financial milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.goals.map((goal) => {
                  const progress = (goal.saved / goal.target) * 100
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Target className="h-5 w-5 text-primary" />
                          <span className="font-medium">{goal.name}</span>
                        </div>
                        <span className="text-sm lg:text-base text-muted-foreground">
                          ₹{goal.saved.toLocaleString()} / ₹{goal.target.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2 rounded-full" />
                      <p className="text-xs lg:text-sm text-foreground">
                        {progress.toFixed(1)}% complete • ₹{(goal.target - goal.saved).toLocaleString()} to go
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Spending & Reports Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card className="rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Category Spending</CardTitle>
              <CardDescription>How you're spending across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.categories.map((category) => {
                  const percentage = (category.spent / category.budget) * 100
                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm lg:text-base text-muted-foreground">
                          ₹{category.spent} / ₹{category.budget}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2 rounded-full" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                <PieChart className="h-5 w-5" />
                <span>Reports Preview</span>
              </CardTitle>
              <CardDescription>Quick insights into your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-2xl bg-muted/50">
                    <p className="text-xl lg:text-2xl font-bold text-primary">₹{spent}</p>
                    <p className="text-xs lg:text-sm text-muted-foreground">This Month</p>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-muted/50">
                    <p className="text-xl lg:text-2xl font-bold text-secondary">₹{Math.round(spent / 30)}</p>
                    <p className="text-xs lg:text-sm text-muted-foreground">Daily Average</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-transparent rounded-xl"
                  onClick={handleViewDetailedReports}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Detailed Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips & Reminders - Make responsive */}
        <Card className="rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>Smart Money Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border">
                <h4 className="font-semibold mb-2 text-sm lg:text-base">💡 Today's Tip</h4>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Perfect for student budgets!
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/10 to-accent/10 border">
                <h4 className="font-semibold mb-2 text-sm lg:text-base">🎯 Weekly Goal</h4>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Keep your daily spending under ₹200 to stay on track with your monthly budget.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 border">
                <h4 className="font-semibold mb-2 text-sm lg:text-base">🏆 Achievement</h4>
                <p className="text-sm lg:text-base text-muted-foreground">
                  You've saved ₹500 this week compared to last week. Keep it up!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
