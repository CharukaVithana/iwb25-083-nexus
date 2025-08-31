"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, Edit, Trash2, Plus, Calendar, Sun, Moon, Sunrise } from "lucide-react"

export interface DayItem {
  id: string
  type: "stay" | "activity" | "transport"
  name: string
  location?: string
  duration?: string
  price: number
  currency: string
  description?: string
  locked?: boolean
}

interface DayCardProps {
  day: number
  items: DayItem[]
  onEditItem: (itemId: string) => void
  onDeleteItem: (itemId: string) => void
  onAddItem: (day: number, type: DayItem["type"]) => void
}

export function DayCard({ day, items, onEditItem, onDeleteItem, onAddItem }: DayCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "Rs"
    return `${symbol}${amount}`
  }

  const getTypeColor = (type: DayItem["type"]) => {
    switch (type) {
      case "stay":
        return {
          bg: "bg-gradient-to-r from-blue-500 to-blue-600",
          text: "text-white",
          cardBg: "bg-gradient-to-r from-blue-50 to-blue-100/50",
          border: "border-blue-200/30"
        }
      case "activity":
        return {
          bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
          text: "text-white",
          cardBg: "bg-gradient-to-r from-emerald-50 to-emerald-100/50",
          border: "border-emerald-200/30"
        }
      case "transport":
        return {
          bg: "bg-gradient-to-r from-purple-500 to-purple-600",
          text: "text-white",
          cardBg: "bg-gradient-to-r from-purple-50 to-purple-100/50",
          border: "border-purple-200/30"
        }
      default:
        return {
          bg: "bg-gradient-to-r from-slate-500 to-slate-600",
          text: "text-white",
          cardBg: "bg-gradient-to-r from-slate-50 to-slate-100/50",
          border: "border-slate-200/30"
        }
    }
  }

  const getTypeIcon = (type: DayItem["type"]) => {
    switch (type) {
      case "stay":
        return "🏨"
      case "activity":
        return "🎯"
      case "transport":
        return "🚗"
      default:
        return "📍"
    }
  }

  const getDayIcon = (day: number) => {
    const dayOfWeek = day % 7
    switch (dayOfWeek) {
      case 1: return <Sunrise className="w-5 h-5 text-orange-500" />
      case 2: return <Sun className="w-5 h-5 text-yellow-500" />
      case 3: return <Sun className="w-5 h-5 text-yellow-500" />
      case 4: return <Sun className="w-5 h-5 text-yellow-500" />
      case 5: return <Sun className="w-5 h-5 text-orange-400" />
      case 6: return <Moon className="w-5 h-5 text-indigo-500" />
      case 0: return <Moon className="w-5 h-5 text-indigo-500" />
      default: return <Calendar className="w-5 h-5 text-slate-500" />
    }
  }

  const dayTotal = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 mb-6">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-tr-full"></div>

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
              {getDayIcon(day)}
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">Day {day}</CardTitle>
              <p className="text-sm text-slate-600">Your adventure continues</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-bold text-slate-800">
                {formatCurrency(dayTotal, items[0]?.currency || "USD")}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                {items.length} {items.length === 1 ? 'Activity' : 'Activities'}
              </div>
            </div>
            <Badge className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-md">
              <Calendar className="w-4 h-4 mr-2" />
              Day {day}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/30">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Activities Yet</h3>
              <p className="text-slate-500 mb-6">Start building your perfect day!</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-md"
                onClick={() => onAddItem(day, "stay")}
              >
                <span className="mr-2">🏨</span>
                Add Stay
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-md"
                onClick={() => onAddItem(day, "activity")}
              >
                <span className="mr-2">🎯</span>
                Add Activity
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-md"
                onClick={() => onAddItem(day, "transport")}
              >
                <span className="mr-2">🚗</span>
                Add Transport
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item, index) => {
                const typeStyle = getTypeColor(item.type)
                return (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden ${typeStyle.cardBg} rounded-xl border ${typeStyle.border} p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    {/* Item decorative element */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full"></div>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg shadow-md ${typeStyle.bg}`}>
                            <span className="text-lg">{getTypeIcon(item.type)}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg">{item.name}</h4>
                            {item.location && (
                              <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <span className="font-medium">{item.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${typeStyle.bg} ${typeStyle.text} border-0 shadow-md px-3 py-1`}>
                            {item.type}
                          </Badge>
                          {item.locked && (
                            <Badge variant="outline" className="border-slate-300 text-slate-600">
                              Locked
                            </Badge>
                          )}
                        </div>
                      </div>

                      {item.description && (
                        <div className="mb-3 p-3 bg-white/60 rounded-lg border border-white/40">
                          <p className="text-sm text-slate-700 leading-relaxed">{item.description}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {item.duration && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/50 px-3 py-1 rounded-full">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="font-medium">{item.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm bg-white/50 px-3 py-1 rounded-full">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="font-bold text-slate-800">
                              {formatCurrency(item.price, item.currency)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-white/60 transition-colors"
                            onClick={() => onEditItem(item.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-red-50 hover:text-red-600 transition-colors"
                            onClick={() => onDeleteItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Add more activities section */}
            <div className="pt-4 border-t border-slate-200/50">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg shadow-md">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700">Add More Activities</h4>
                      <p className="text-sm text-slate-500">Enhance your day with additional experiences</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/60 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                    onClick={() => onAddItem(day, "stay")}
                  >
                    <span className="mr-2">🏨</span>
                    Add Stay
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/60 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all duration-200"
                    onClick={() => onAddItem(day, "activity")}
                  >
                    <span className="mr-2">🎯</span>
                    Add Activity
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/60 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200"
                    onClick={() => onAddItem(day, "transport")}
                  >
                    <span className="mr-2">🚗</span>
                    Add Transport
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
