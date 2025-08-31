"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CurrencyDisplay } from "@/components/currency-display"
import { TrendingUp, TrendingDown, DollarSign, Home, Activity, CheckCircle, AlertTriangle } from "lucide-react"

interface BudgetBarProps {
  totalBudget: number
  currency: string
  spent: {
    lodging: number
    activities: number
    transport: number
  }
}

export function BudgetBar({ totalBudget, currency, spent }: BudgetBarProps) {
  const totalSpent = spent.lodging + spent.activities // Removed transport from calculation
  const remaining = totalBudget - totalSpent
  const percentageUsed = (totalSpent / totalBudget) * 100

  const getStatusColor = () => {
    if (percentageUsed <= 75) return { bg: "from-green-500 to-emerald-600", text: "text-green-700", icon: CheckCircle }
    if (percentageUsed <= 90) return { bg: "from-yellow-500 to-orange-600", text: "text-yellow-700", icon: TrendingUp }
    return { bg: "from-red-500 to-red-600", text: "text-red-700", icon: AlertTriangle }
  }

  const status = getStatusColor()
  const StatusIcon = status.icon

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 min-h-[600px] flex flex-col flex-1">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full"></div>

      <CardContent className="p-6 relative z-10 flex-1 flex flex-col">
        <div className="space-y-6 flex-1 flex flex-col">
          {/* Header with status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-800">Budget Tracker</h3>
                <p className="text-sm text-slate-600">Monitor your spending</p>
              </div>
            </div>
            <Badge className={`px-4 py-2 text-sm font-semibold bg-gradient-to-r ${status.bg} text-white border-0 shadow-md`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {remaining >= 0 ? "On Track" : "Over Budget"}
            </Badge>
          </div>

          {/* Main budget overview */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Total Spent</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-800">
                    <CurrencyDisplay amount={totalSpent} originalCurrency={currency} />
                  </div>
                  <div className="text-xs text-slate-500">
                    {percentageUsed.toFixed(1)}% of budget
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Progress
                  value={Math.min(percentageUsed, 100)}
                  className="h-3 bg-slate-200"
                />
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Progress</span>
                  <span>{percentageUsed.toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-sm font-medium text-slate-600">Total Budget</span>
                <span className="text-lg font-semibold text-slate-800">
                  <CurrencyDisplay amount={totalBudget} originalCurrency={currency} />
                </span>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Spending Breakdown
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {/* Lodging */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Home className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Lodging</span>
                    <div className="text-xs text-slate-500">
                      {((spent.lodging / totalSpent) * 100 || 0).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">
                    <CurrencyDisplay amount={spent.lodging} originalCurrency={currency} />
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Activities</span>
                    <div className="text-xs text-slate-500">
                      {((spent.activities / totalSpent) * 100 || 0).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">
                    <CurrencyDisplay amount={spent.activities} originalCurrency={currency} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Remaining budget highlight */}
          <div className={`p-4 rounded-xl border-2 shadow-md ${
            remaining >= 0
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
              : 'bg-gradient-to-r from-red-50 to-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  remaining >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {remaining >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-white" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Remaining Budget</span>
                  <div className="text-xs text-slate-500">
                    {remaining >= 0 ? 'You\'re doing great!' : 'Consider adjusting your plans'}
                  </div>
                </div>
              </div>
              <div className={`text-2xl font-bold ${
                remaining >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                <CurrencyDisplay amount={Math.abs(remaining)} originalCurrency={currency} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
