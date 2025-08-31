"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth-modal"
import { CurrencyDisplay } from "@/components/currency-display"
import { useAuth } from "@/hooks/use-auth"
import { Calendar, Users, MapPin, Trash2, Edit, Share, Heart, Star, Clock, TrendingUp, DollarSign } from "lucide-react"

export default function SavedPlansPage() {
  const { user, savedPlans, deletePlan } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ece7dc] via-[#307082]/10 to-[#6ca3a2]/20">
        <Navbar />

        {/* Enhanced Auth Required Section */}
        <section className="relative py-20 px-4">
          {/* Enhanced Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#307082]/10 via-[#6ca3a2]/5 to-[#12212e]/10"></div>
            <div className="absolute inset-0 opacity-30">
              <img
                src="/sigiriya.jpg"
                alt="Sigiriya Rock Fortress"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#307082]/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#6ca3a2]/20 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="container max-w-4xl mx-auto text-center relative z-10">
            <div className="relative inline-block mb-8">
              <h1 className="font-serif text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#12212e] via-[#307082] to-[#6ca3a2] bg-clip-text text-transparent mb-6 animate-fade-in">
                Your Saved Plans
              </h1>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-40 h-1.5 bg-gradient-to-r from-[#307082] to-[#6ca3a2] rounded-full shadow-sm animate-expand"></div>
            </div>

            <div className="max-w-2xl mx-auto mb-8">
              <p className="text-xl md:text-2xl text-[#12212e] leading-relaxed mb-4">
                Access your personalized travel plans and continue planning your Sri Lankan adventure
              </p>
              <p className="text-lg md:text-xl text-[#307082] leading-relaxed">
                Sign in to view, edit, and manage all your saved itineraries in one place.
              </p>
            </div>

            {/* Enhanced Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-10">
              <div className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#307082]/10 to-[#6ca3a2]/10 rounded-full border border-[#307082]/20 hover:border-[#307082] transition-all duration-300 animate-slide-in-left">
                <div className="w-3 h-3 bg-[#307082] rounded-full animate-pulse"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#12212e]">∞</div>
                  <div className="text-xs font-semibold text-[#307082] uppercase tracking-wider">Possibilities</div>
                </div>
              </div>

              <div className="w-1 h-1 bg-[#6ca3a2] rounded-full animate-bounce"></div>

              <div className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#6ca3a2]/10 to-[#12212e]/10 rounded-full border border-[#6ca3a2]/20 hover:border-[#6ca3a2] transition-all duration-300 animate-slide-in-up">
                <Heart className="w-5 h-5 text-[#6ca3a2]" />
                <div className="text-center">
                  <div className="text-sm font-semibold text-[#12212e]">Personalized</div>
                  <div className="text-xs font-semibold text-[#6ca3a2] uppercase tracking-wider">Plans</div>
                </div>
              </div>

              <div className="w-1 h-1 bg-[#12212e] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>

              <div className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#12212e]/10 to-[#ea9940]/10 rounded-full border border-[#12212e]/20 hover:border-[#12212e] transition-all duration-300 animate-slide-in-right">
                <Star className="w-5 h-5 text-[#ea9940]" />
                <div className="text-center">
                  <div className="text-sm font-semibold text-[#12212e]">Premium</div>
                  <div className="text-xs font-semibold text-[#12212e] uppercase tracking-wider">Experience</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full opacity-60"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-[#6ca3a2] to-[#12212e] rounded-full opacity-40"></div>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-[#307082] to-[#6ca3a2] hover:from-[#2a6370] hover:to-[#5a8f8e] text-white px-8 py-4 text-lg font-semibold rounded-full border-0 shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-5 h-5 mr-2" />
                Sign In to View Plans
              </Button>
            </div>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
          </div>
        </section>
      </div>
    )
  }

  const handleDeletePlan = (planId: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      deletePlan(planId)
    }
  }

  // Calculate stats
  const totalPlans = savedPlans.length
  const totalBudget = savedPlans.reduce((sum, plan) => sum + plan.budget, 0)
  const avgTripLength = totalPlans > 0 ? Math.round(savedPlans.reduce((sum, plan) => sum + plan.tripLength, 0) / totalPlans) : 0
  const totalTravelers = savedPlans.reduce((sum, plan) => sum + plan.travelers, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece7dc] via-[#307082]/10 to-[#6ca3a2]/20">
      <Navbar />

      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Enhanced Header Section */}
        <div className="mb-12 text-center">
          <div className="relative inline-block">
            <h1 className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#12212e] via-[#307082] to-[#6ca3a2] bg-clip-text text-transparent mb-4 animate-fade-in">
              Your Saved Plans
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#307082] to-[#6ca3a2] rounded-full animate-expand"></div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6">
            {/* Plans Badge */}
            <div className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#307082]/10 to-[#6ca3a2]/10 rounded-full border border-[#307082]/20 hover:border-[#307082] transition-all duration-300 animate-slide-in-left">
              <div className="w-2 h-2 bg-[#307082] rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-[#12212e]">{totalPlans} saved plans</span>
            </div>

            <div className="w-1 h-1 bg-[#6ca3a2] rounded-full animate-bounce"></div>

            {/* Budget Badge */}
            <div className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6ca3a2]/10 to-[#12212e]/10 rounded-full border border-[#6ca3a2]/20 hover:border-[#6ca3a2] transition-all duration-300 animate-slide-in-up">
              <TrendingUp className="w-4 h-4 text-[#6ca3a2]" />
              <span className="text-sm font-semibold text-[#12212e]">
                <CurrencyDisplay amount={totalBudget} originalCurrency="USD" />
              </span>
            </div>

            <div className="w-1 h-1 bg-[#12212e] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>

            {/* Travelers Badge */}
            <div className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#12212e]/10 to-[#ea9940]/10 rounded-full border border-[#12212e]/20 hover:border-[#12212e] transition-all duration-300 animate-slide-in-right">
              <Users className="w-4 h-4 text-[#ea9940]" />
              <span className="text-sm font-semibold text-[#12212e]">{totalTravelers} travelers</span>
            </div>
          </div>

          <p className="text-[#307082] mt-4 max-w-2xl mx-auto leading-relaxed">
            Welcome back, {user.name}! Here are your saved travel plans for Sri Lanka. Manage, edit, and continue planning your perfect adventures.
          </p>
        </div>

        {savedPlans.length === 0 ? (
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full opacity-60"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-[#6ca3a2] to-[#12212e] rounded-full opacity-40"></div>
            <Card className="text-center py-16 bg-gradient-to-r from-white via-[#ece7dc]/30 to-[#307082]/10 backdrop-blur-sm border border-[#6ca3a2]/20 shadow-xl">
              <CardContent>
                <div className="w-20 h-20 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-3 text-[#12212e]">No saved plans yet</h3>
                <p className="text-[#307082] mb-8 max-w-md mx-auto leading-relaxed">
                  Start planning your Sri Lankan adventure and save your first personalized itinerary to access it anytime.
                </p>
                <div className="relative">
                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full opacity-60"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-[#6ca3a2] to-[#12212e] rounded-full opacity-40"></div>
                  <Button className="bg-gradient-to-r from-[#307082] to-[#6ca3a2] hover:from-[#2a6370] hover:to-[#5a8f8e] text-white border-0 shadow-lg px-6 py-3 transform hover:scale-105 transition-all duration-300">
                    <a href="/plan" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Create New Plan
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Enhanced Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="relative">
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full opacity-60"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gradient-to-br from-[#6ca3a2] to-[#12212e] rounded-full opacity-40"></div>
                <Card className="bg-gradient-to-r from-[#ece7dc]/50 to-[#307082]/10 border border-[#6ca3a2]/20 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#12212e]">{totalPlans}</div>
                    <div className="text-sm text-[#307082] font-medium">Saved Plans</div>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-[#6ca3a2] to-[#12212e] rounded-full opacity-60"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gradient-to-br from-[#12212e] to-[#ea9940] rounded-full opacity-40"></div>
                <Card className="bg-gradient-to-r from-[#307082]/10 to-[#6ca3a2]/20 border border-[#6ca3a2]/20 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#6ca3a2] to-[#12212e] rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#12212e]">
                      <CurrencyDisplay amount={totalBudget} originalCurrency="USD" />
                    </div>
                    <div className="text-sm text-[#307082] font-medium">Total Budget</div>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-[#12212e] to-[#ea9940] rounded-full opacity-60"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gradient-to-br from-[#ea9940] to-[#307082] rounded-full opacity-40"></div>
                <Card className="bg-gradient-to-r from-[#6ca3a2]/20 to-[#12212e]/10 border border-[#6ca3a2]/20 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#12212e] to-[#ea9940] rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#12212e]">{avgTripLength}</div>
                    <div className="text-sm text-[#307082] font-medium">Avg Days</div>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-[#ea9940] to-[#307082] rounded-full opacity-60"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full opacity-40"></div>
                <Card className="bg-gradient-to-r from-[#12212e]/10 to-[#ea9940]/10 border border-[#6ca3a2]/20 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#ea9940] to-[#307082] rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#12212e]">{totalTravelers}</div>
                    <div className="text-sm text-[#307082] font-medium">Travelers</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlans.map((plan) => (
                <div key={plan.id} className="relative">
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full opacity-60"></div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gradient-to-br from-[#6ca3a2] to-[#12212e] rounded-full opacity-40"></div>
                  <Card className="hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-white via-[#ece7dc]/20 to-[#307082]/10 backdrop-blur-sm border border-[#6ca3a2]/20 shadow-xl group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold mb-2 text-[#12212e] group-hover:text-[#307082] transition-colors">
                            {plan.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-[#307082] mb-3">
                            <MapPin className="w-4 h-4 text-[#6ca3a2]" />
                            <span className="font-medium">{plan.destination}</span>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-[#307082] to-[#6ca3a2] text-white border-0 shadow-md px-3 py-1">
                          <CurrencyDisplay amount={plan.budget} originalCurrency={plan.currency} lkrClassName="text-sm text-white/90" />
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-[#307082]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#12212e]" />
                          <span className="font-medium">{plan.tripLength} days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#ea9940]" />
                          <span className="font-medium">{plan.travelers} travelers</span>
                        </div>
                      </div>

                      <div className="text-xs text-[#307082] bg-[#ece7dc]/50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span>Created: {plan.createdAt.toLocaleDateString()}</span>
                          <span>Updated: {plan.updatedAt.toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-gradient-to-r from-[#307082]/10 to-[#6ca3a2]/10 border-[#6ca3a2] hover:border-[#307082] hover:bg-[#307082]/20 text-[#12212e] font-medium transition-all duration-200"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-gradient-to-r from-[#6ca3a2]/10 to-[#12212e]/10 border-[#6ca3a2] hover:border-[#6ca3a2] hover:bg-[#6ca3a2]/20 text-[#12212e] font-medium transition-all duration-200"
                        >
                          <Share className="w-3 h-3 mr-1" />
                          Share
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePlan(plan.id)}
                          className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:border-red-300 hover:bg-red-100/50 text-red-600 hover:text-red-700 font-medium transition-all duration-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Enhanced Quick Actions */}
        {user && (
          <div className="relative mt-12">
            <div className="absolute -top-2 -left-2 w-5 h-5 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full opacity-60"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-[#6ca3a2] to-[#12212e] rounded-full opacity-40"></div>
            <Card className="bg-gradient-to-r from-white via-[#ece7dc]/30 to-[#307082]/10 backdrop-blur-sm border border-[#6ca3a2]/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#12212e] flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#ea9940]" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full opacity-60"></div>
                    <Button className="w-full bg-gradient-to-r from-[#307082] to-[#6ca3a2] hover:from-[#2a6370] hover:to-[#5a8f8e] text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-300">
                      <a href="/plan" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Create New Plan
                      </a>
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-[#6ca3a2] to-[#12212e] rounded-full opacity-60"></div>
                    <Button variant="outline" className="w-full bg-gradient-to-r from-[#6ca3a2]/10 to-[#12212e]/10 border-[#6ca3a2] hover:border-[#6ca3a2] hover:bg-[#6ca3a2]/20 text-[#12212e] font-medium transition-all duration-200">
                      <a href="/explore" className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Explore Destinations
                      </a>
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-[#12212e] to-[#ea9940] rounded-full opacity-60"></div>
                    <Button variant="outline" className="w-full bg-gradient-to-r from-[#12212e]/10 to-[#ea9940]/10 border-[#6ca3a2] hover:border-[#6ca3a2] hover:bg-[#6ca3a2]/20 text-[#12212e] font-medium transition-all duration-200">
                      <a href="/hotels" className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Browse Hotels
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
