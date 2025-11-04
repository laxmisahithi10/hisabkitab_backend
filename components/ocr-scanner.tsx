"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, FileText, X, CheckCircle } from "lucide-react"

interface ExtractedData {
  merchant?: string
  amount?: string
  date?: string
  items?: string[]
}

export function OCRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        simulateOCR()
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateOCR = () => {
    setIsScanning(true)
    // Simulate OCR processing time
    setTimeout(() => {
      setExtractedData({
        merchant: "Campus Canteen",
        amount: "₹185.50",
        date: "2024-01-15",
        items: ["Veg Thali - ₹120", "Cold Coffee - ₹45", "Samosa - ₹20.50"],
      })
      setIsScanning(false)
    }, 2000)
  }

  const handleClear = () => {
    setUploadedImage(null)
    setExtractedData(null)
    setIsScanning(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddExpense = () => {
    if (extractedData) {
      // Get existing data from localStorage
      const existingData = JSON.parse(localStorage.getItem("hisabkitab-data") || "{}")

      const newExpense = {
        id: Date.now(),
        description: `${extractedData.merchant} - Receipt`,
        amount: Number.parseFloat(extractedData.amount?.replace("₹", "") || "0"),
        category: "Food", // Default category, could be made smarter
        date: "Today",
      }

      // Update expenses and balance
      const updatedData = {
        ...existingData,
        expenses: [newExpense, ...(existingData.expenses || [])],
        balance: (existingData.balance || 0) - newExpense.amount,
      }

      // Update category spending if category exists
      if (updatedData.categories) {
        const categoryIndex = updatedData.categories.findIndex((cat: any) => cat.name === newExpense.category)
        if (categoryIndex !== -1) {
          updatedData.categories[categoryIndex].spent += newExpense.amount
        }
      }

      localStorage.setItem("hisabkitab-data", JSON.stringify(updatedData))

      // Show success and reset
      alert("Expense added successfully!")
      handleClear()

      // Refresh the page to show updated data
      window.location.reload()
    }
  }

  return (
    <div className="space-y-4">
      {!uploadedImage ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-24 md:h-32 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <span className="font-medium text-sm md:text-base">Upload Receipt</span>
              <span className="text-xs md:text-sm text-muted-foreground">JPG, PNG up to 10MB</span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-24 md:h-32 rounded-2xl border-2 border-dashed border-secondary/30 bg-secondary/5 hover:bg-secondary/10 transition-colors"
            disabled
          >
            <div className="flex flex-col items-center space-y-2">
              <Camera className="h-6 w-6 md:h-8 md:w-8 text-secondary" />
              <span className="font-medium text-sm md:text-base">Scan Receipt</span>
              <span className="text-xs md:text-sm text-muted-foreground">Coming Soon</span>
            </div>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center space-x-2 text-sm md:text-base">
              <FileText className="h-4 w-4 md:h-5 md:w-5" />
              <span>Receipt Analysis</span>
            </h4>
            <Button variant="ghost" size="sm" onClick={handleClear} className="rounded-xl">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <h5 className="font-medium mb-2 text-sm md:text-base">Uploaded Receipt</h5>
                <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded receipt"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-sm md:text-base">Extracted Data</h5>
                  {isScanning ? (
                    <Badge variant="secondary" className="animate-pulse rounded-full text-xs">
                      Processing...
                    </Badge>
                  ) : extractedData ? (
                    <Badge variant="default" className="rounded-full text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  ) : null}
                </div>

                {isScanning ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
                  </div>
                ) : extractedData ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Merchant</p>
                      <p className="font-medium text-sm md:text-base">{extractedData.merchant}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-medium text-lg md:text-xl text-primary">{extractedData.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Date</p>
                      <p className="font-medium text-sm md:text-base">{extractedData.date}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Items</p>
                      <div className="space-y-1">
                        {extractedData.items?.map((item, index) => (
                          <p key={index} className="text-xs md:text-sm bg-muted/50 rounded-lg px-2 py-1">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleAddExpense} className="w-full mt-4 rounded-xl text-sm md:text-base">
                      Add to Expenses
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Upload a receipt to extract expense data automatically
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
    </div>
  )
}
