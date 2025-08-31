"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CurrencyPicker } from "@/components/currency-picker"
import { CurrencyDisplay } from "@/components/currency-display"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrency } from "@/hooks/use-currency"

interface BudgetStepProps {
  onNext: (data: BudgetData) => void
}

export interface BudgetData {
  budget: number
  currency: string
  tripLength: number
  travelers: number
}

export function BudgetStep({ onNext }: BudgetStepProps) {
  const [budget, setBudget] = useState<string>("")
  const [tripLength, setTripLength] = useState<string>("7")
  const [travelers, setTravelers] = useState<string>("2")
  const { selectedCurrency } = useCurrency()

  const handleNext = () => {
    if (!budget || !tripLength || !travelers) return

    onNext({
      budget: Number.parseFloat(budget),
      currency: selectedCurrency,
      tripLength: Number.parseInt(tripLength),
      travelers: Number.parseInt(travelers),
    })
  }

  const isValid = budget && tripLength && travelers
  const budgetAmount = Number.parseFloat(budget) || 0

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-center">Set Your Budget</CardTitle>
        <p className="text-center text-slate-600">Let's start with your travel budget and basic trip details</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Total Budget</Label>
            <Input
              id="budget"
              type="number"
              placeholder="2000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <CurrencyPicker />
          </div>
        </div>

        {budgetAmount > 0 && (
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Budget in other currencies:</span>
              <CurrencyDisplay
                amount={budgetAmount}
                originalCurrency={selectedCurrency}
                showLKR={selectedCurrency !== "LKR"}
                className="text-sm"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trip-length">Trip Length</Label>
            <Select value={tripLength} onValueChange={setTripLength}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 14 }, (_, i) => i + 3).map((days) => (
                  <SelectItem key={days} value={days.toString()}>
                    {days} {days === 1 ? "day" : "days"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="travelers">Number of Travelers</Label>
            <Select value={travelers} onValueChange={setTravelers}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((count) => (
                  <SelectItem key={count} value={count.toString()}>
                    {count} {count === 1 ? "traveler" : "travelers"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleNext} disabled={!isValid} className="w-full bg-primary hover:bg-primary-700" size="lg">
            Continue to Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
