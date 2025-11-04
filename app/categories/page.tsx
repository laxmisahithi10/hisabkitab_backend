"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Edit3,
  Trash2,
  Coffee,
  Bus,
  BookOpen,
  ShoppingBag,
  Home,
  Gamepad2,
  Heart,
  Utensils,
  Car,
  Shirt,
  IndianRupee,
} from "lucide-react"

// Mock data for categories
const initialCategories = [
  {
    id: 1,
    name: "Food",
    icon: Coffee,
    color: "bg-chart-1",
    budget: 3000,
    spent: 1800,
    transactions: 24,
    description: "Meals, snacks, and beverages",
  },
  {
    id: 2,
    name: "Transport",
    icon: Bus,
    color: "bg-chart-2",
    budget: 1500,
    spent: 800,
    transactions: 18,
    description: "Bus, auto, metro, and travel expenses",
  },
  {
    id: 3,
    name: "Education",
    icon: BookOpen,
    color: "bg-chart-3",
    budget: 2000,
    spent: 1200,
    transactions: 8,
    description: "Books, stationery, and course materials",
  },
  {
    id: 4,
    name: "Entertainment",
    icon: Gamepad2,
    color: "bg-chart-4",
    budget: 1000,
    spent: 450,
    transactions: 12,
    description: "Movies, games, and fun activities",
  },
  {
    id: 5,
    name: "Canteen",
    icon: Utensils,
    color: "bg-chart-5",
    budget: 1200,
    spent: 680,
    transactions: 32,
    description: "College canteen and mess expenses",
  },
  {
    id: 6,
    name: "Shopping",
    icon: ShoppingBag,
    color: "bg-secondary",
    budget: 800,
    spent: 320,
    transactions: 6,
    description: "Clothes, accessories, and personal items",
  },
]

const iconOptions = [
  { icon: Coffee, name: "Coffee" },
  { icon: Bus, name: "Bus" },
  { icon: BookOpen, name: "Book" },
  { icon: Gamepad2, name: "Games" },
  { icon: Utensils, name: "Utensils" },
  { icon: ShoppingBag, name: "Shopping" },
  { icon: Home, name: "Home" },
  { icon: Car, name: "Car" },
  { icon: Heart, name: "Health" },
  { icon: Shirt, name: "Clothes" },
]

const colorOptions = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-primary",
  "bg-secondary",
  "bg-accent",
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    budget: "",
    description: "",
    icon: Coffee,
    color: "bg-chart-1",
  })

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    const category = {
      id: Date.now(),
      name: newCategory.name,
      icon: newCategory.icon,
      color: newCategory.color,
      budget: Number.parseInt(newCategory.budget),
      spent: 0,
      transactions: 0,
      description: newCategory.description,
    }
    setCategories([...categories, category])
    setNewCategory({ name: "", budget: "", description: "", icon: Coffee, color: "bg-chart-1" })
    setIsAddDialogOpen(false)
  }

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault()
    setCategories(
      categories.map((cat) =>
        cat.id === editingCategory.id
          ? {
              ...cat,
              name: editingCategory.name,
              budget: Number.parseInt(editingCategory.budget),
              description: editingCategory.description,
              icon: editingCategory.icon,
              color: editingCategory.color,
            }
          : cat,
      ),
    )
    setIsEditDialogOpen(false)
    setEditingCategory(null)
  }

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  const startEdit = (category: any) => {
    setEditingCategory({
      ...category,
      budget: category.budget.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Categories</h1>
            <p className="text-muted-foreground">Manage your expense categories</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Create a new expense category to better organize your spending</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Groceries"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Budget (₹)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="0"
                    value={newCategory.budget}
                    onChange={(e) => setNewCategory({ ...newCategory, budget: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of this category"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Choose Icon</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <Button
                          key={option.name}
                          type="button"
                          variant={newCategory.icon === option.icon ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewCategory({ ...newCategory, icon: option.icon })}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Choose Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <Button
                        key={color}
                        type="button"
                        variant={newCategory.color === color ? "default" : "outline"}
                        size="sm"
                        className={`${color} text-white`}
                        onClick={() => setNewCategory({ ...newCategory, color })}
                      >
                        <div className="w-4 h-4 rounded-full bg-current" />
                      </Button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Add Category
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Budget</CardTitle>
              <CardDescription>Monthly allocation across all categories</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary flex items-center">
                <IndianRupee className="h-6 w-6" />
                {totalBudget.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Spent</CardTitle>
              <CardDescription>Amount used across all categories</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-destructive flex items-center">
                <IndianRupee className="h-6 w-6" />
                {totalSpent.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Remaining</CardTitle>
              <CardDescription>Available budget for this month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary flex items-center">
                <IndianRupee className="h-6 w-6" />
                {(totalBudget - totalSpent).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            const spentPercentage = (category.spent / category.budget) * 100
            const isOverBudget = spentPercentage > 100

            return (
              <Card key={category.id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${category.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription className="text-xs">{category.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(category)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? This action cannot be undone and will
                              remove all associated transactions.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spent</span>
                      <span className={isOverBudget ? "text-destructive font-semibold" : ""}>
                        ₹{category.spent.toLocaleString()} / ₹{category.budget.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={Math.min(spentPercentage, 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{spentPercentage.toFixed(1)}% used</span>
                      <span>{category.transactions} transactions</span>
                    </div>
                  </div>

                  {isOverBudget && (
                    <Badge variant="destructive" className="w-full justify-center">
                      Over Budget by ₹{(category.spent - category.budget).toLocaleString()}
                    </Badge>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">Remaining</p>
                      <p className="font-semibold text-sm">
                        ₹{Math.max(0, category.budget - category.spent).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">Avg/Transaction</p>
                      <p className="font-semibold text-sm">
                        ₹{category.transactions > 0 ? Math.round(category.spent / category.transactions) : 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update your category details and budget</DialogDescription>
            </DialogHeader>
            {editingCategory && (
              <form onSubmit={handleEditCategory} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Category Name</Label>
                  <Input
                    id="edit-name"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-budget">Monthly Budget (₹)</Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    value={editingCategory.budget}
                    onChange={(e) => setEditingCategory({ ...editingCategory, budget: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Choose Icon</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <Button
                          key={option.name}
                          type="button"
                          variant={editingCategory.icon === option.icon ? "default" : "outline"}
                          size="sm"
                          onClick={() => setEditingCategory({ ...editingCategory, icon: option.icon })}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Choose Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <Button
                        key={color}
                        type="button"
                        variant={editingCategory.color === color ? "default" : "outline"}
                        size="sm"
                        className={`${color} text-white`}
                        onClick={() => setEditingCategory({ ...editingCategory, color })}
                      >
                        <div className="w-4 h-4 rounded-full bg-current" />
                      </Button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Update Category
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
