"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { BudgetStep, type BudgetData } from "@/components/budget-step"
import { PreferencesStep, type PreferencesData } from "@/components/preferences-step"
import { ItineraryPlanner } from "@/components/itinerary-planner"

type WizardStep = "budget" | "preferences" | "itinerary"

export default function PlanPage() {
  const [currentStep, setCurrentStep] = useState<WizardStep>("budget")
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null)
  const [preferencesData, setPreferencesData] = useState<PreferencesData | null>(null)

  const handleBudgetNext = (data: BudgetData) => {
    setBudgetData(data)
    setCurrentStep("preferences")
  }

  const handlePreferencesNext = (data: PreferencesData) => {
    setPreferencesData(data)
    setCurrentStep("itinerary")
  }

  const handlePreferencesBack = () => {
    setCurrentStep("budget")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Progress Indicator */}
      <div className="bg-white border-b">
        <div className="container max-w-4xl mx-auto py-4 px-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "budget"
                    ? "bg-primary text-white"
                    : budgetData
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                1
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep === "budget" ? "text-primary" : budgetData ? "text-green-600" : "text-slate-500"
                }`}
              >
                Budget
              </span>
            </div>

            <div className={`h-px w-16 ${budgetData ? "bg-green-500" : "bg-slate-200"}`} />

            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "preferences"
                    ? "bg-primary text-white"
                    : preferencesData
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep === "preferences" ? "text-primary" : preferencesData ? "text-green-600" : "text-slate-500"
                }`}
              >
                Preferences
              </span>
            </div>

            <div className={`h-px w-16 ${preferencesData ? "bg-green-500" : "bg-slate-200"}`} />

            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "itinerary" ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                3
              </div>
              <span
                className={`text-sm font-medium ${currentStep === "itinerary" ? "text-primary" : "text-slate-500"}`}
              >
                Itinerary
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto py-8 px-4">
        {currentStep === "budget" && <BudgetStep onNext={handleBudgetNext} />}

        {currentStep === "preferences" && (
          <PreferencesStep onNext={handlePreferencesNext} onBack={handlePreferencesBack} />
        )}

        {currentStep === "itinerary" && budgetData && preferencesData && (
          <ItineraryPlanner budgetData={budgetData} preferencesData={preferencesData} />
        )}
      </div>
    </div>
  )
}
