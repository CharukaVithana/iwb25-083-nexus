"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAllRegions } from "@/lib/api"
import type { Region } from "@/lib/api"
import { MapPin, Star, Camera, Waves, Mountain, TreePine, Building2, Compass } from "lucide-react"

export function RegionsList() {
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await getAllRegions()
        setRegions(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load regions')
        setLoading(false)
      }
    }

    fetchRegions()
  }, [])

  // Icon mapping for different region types
  const getRegionIcon = (regionName: string) => {
    const name = regionName.toLowerCase()
    if (name.includes('coastal') || name.includes('beach') || name.includes('galle')) {
      return <Waves className="w-5 h-5" />
    }
    if (name.includes('hill') || name.includes('mountain') || name.includes('kandy')) {
      return <Mountain className="w-5 h-5" />
    }
    if (name.includes('cultural') || name.includes('ancient') || name.includes('temple')) {
      return <Building2 className="w-5 h-5" />
    }
    if (name.includes('wildlife') || name.includes('nature') || name.includes('yala')) {
      return <TreePine className="w-5 h-5" />
    }
    return <Compass className="w-5 h-5" />
  }

  // Color scheme for different regions
  const getRegionColors = (index: number) => {
    const colors = [
      { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-700', border: 'border-blue-500/20' },
      { bg: 'from-emerald-500 to-teal-500', text: 'text-emerald-700', border: 'border-emerald-500/20' },
      { bg: 'from-purple-500 to-indigo-500', text: 'text-purple-700', border: 'border-purple-500/20' },
      { bg: 'from-rose-500 to-pink-500', text: 'text-rose-700', border: 'border-rose-500/20' },
      { bg: 'from-amber-500 to-orange-500', text: 'text-amber-700', border: 'border-amber-500/20' },
      { bg: 'from-indigo-500 to-blue-500', text: 'text-indigo-700', border: 'border-indigo-500/20' },
      { bg: 'from-teal-500 to-cyan-500', text: 'text-teal-700', border: 'border-teal-500/20' },
      { bg: 'from-violet-500 to-purple-500', text: 'text-violet-700', border: 'border-violet-500/20' },
      { bg: 'from-slate-500 to-gray-500', text: 'text-slate-700', border: 'border-slate-500/20' }
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="relative">
      {/* Enhanced Container with Decorative Elements */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-60"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-40"></div>

        <div className="bg-gradient-to-r from-white via-slate-50 to-blue-50/30 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-2xl p-12">
          {loading ? (
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full opacity-60"></div>
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full opacity-40"></div>
              <div className="bg-gradient-to-r from-white via-slate-50 to-blue-50/30 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-700 mb-4">Discovering Sri Lanka</h3>
                <p className="text-slate-500 mb-6">Loading amazing regions and destinations...</p>
                <div className="flex justify-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-red-400 to-red-500 rounded-full opacity-60"></div>
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-br from-red-400 to-red-500 rounded-full opacity-40"></div>
              <div className="bg-gradient-to-r from-white via-slate-50 to-red-50/30 backdrop-blur-sm rounded-2xl border border-red-200/50 shadow-xl p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Unable to Load Regions</h3>
                <p className="text-slate-500 mb-6">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-md px-6 py-2"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Enhanced Header for Regions Grid */}
              <div className="text-center mb-12">
                <div className="relative inline-block">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                    Choose Your Adventure
                  </h2>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                </div>
                <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
                  Select a region to explore its unique attractions, culture, and hidden gems
                </p>
              </div>

              {/* Enhanced Regions Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regions.map((region, index) => {
                  const colors = getRegionColors(index)
                  return (
                    <div key={region.id} className="relative group">
                      {/* Decorative Elements */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-60"></div>
                      <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-40"></div>

                      <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-xl bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm">
                        {/* Enhanced Image Section */}
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={region.image_url}
                            alt={region.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                          {/* Region Icon Overlay */}
                          <div className="absolute top-4 left-4">
                            <div className={`p-3 bg-gradient-to-br ${colors.bg} rounded-xl shadow-lg transform transition-transform duration-300 group-hover:scale-110`}>
                              {getRegionIcon(region.name)}
                            </div>
                          </div>

                          {/* Rating Badge */}
                          <div className="absolute top-4 right-4">
                            <div className="flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-md">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-semibold text-slate-700">4.{5 + (index % 5)}</span>
                            </div>
                          </div>

                          {/* Enhanced Title */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-serif text-2xl font-bold mb-2 drop-shadow-lg">
                              {region.name}
                            </h3>
                            <div className="flex items-center gap-2 text-white/90 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span>Sri Lanka</span>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Content Section */}
                        <CardContent className="p-6">
                          <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">
                            {region.description}
                          </p>

                          {/* Region Highlights */}
                          <div className="mb-6">
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-3 py-1 bg-gradient-to-r ${colors.bg} bg-opacity-10 text-xs font-semibold ${colors.text} rounded-full border ${colors.border}`}>
                                {region.name.includes('Coastal') ? 'Beaches' :
                                 region.name.includes('Hill') ? 'Mountains' :
                                 region.name.includes('Cultural') ? 'Heritage' :
                                 region.name.includes('Northern') ? 'Culture' :
                                 region.name.includes('Southern') ? 'Wildlife' :
                                 region.name.includes('Eastern') ? 'Adventure' : 'Explore'}
                              </span>
                              <span className="px-3 py-1 bg-gradient-to-r from-slate-500/10 to-slate-600/10 text-xs font-semibold text-slate-600 rounded-full border border-slate-500/20">
                                {Math.floor(Math.random() * 50) + 10} attractions
                              </span>
                            </div>
                          </div>

                          {/* Enhanced Button */}
                          <Button
                            className={`w-full bg-gradient-to-r ${colors.bg} hover:opacity-90 text-white border-0 shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 group-hover:shadow-xl`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Camera className="w-4 h-4" />
                              <span className="font-semibold">Explore {region.name}</span>
                              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>

              {/* Call to Action Footer */}
              <div className="text-center mt-16 pt-8 border-t border-slate-200/50">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    Ready to Start Your Journey?
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Choose a region above to discover detailed itineraries, accommodation options, and local experiences tailored just for you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-md px-8 py-3">
                      <Compass className="w-5 h-5 mr-2" />
                      Plan Your Trip
                    </Button>
                    <Button variant="outline" className="border-slate-300 hover:border-blue-500 hover:bg-blue-50 px-8 py-3">
                      <Camera className="w-5 h-5 mr-2" />
                      View All Destinations
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
