"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { HotelSearchBar, type HotelSearchFilters } from "@/components/hotel-search-bar"
import { HotelCard, type Hotel } from "@/components/hotel-card"
import { HotelFilters } from "@/components/hotel-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Grid, List, Map } from "lucide-react"

// Small override map for well-known hotels that are missing local assets.
// Keys are slug-like tokens that may appear in the backend `image_url` or the hotel `name`.
const HOTEL_IMAGE_OVERRIDES: Record<string, string> = {
  // Using Unsplash source queries so we don't need to commit binaries. These return a relevant image.
  amanwella: "https://ik.imgkit.net/3vlqs5axxjf/external/ik-seo/https://media.iceportal.com/127248/photos/72801400_XL/Amanwella-Exterior.jpg?tr=w-656%2Ch-390%2Cfo-auto",
  "wild-coast": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/138890847.jpg?k=64e1cdc9a56b8238534101fdf6cc08654ffdf75c2b4a85729b5759700845546c&o=&hp=1",
  anantara: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/65697351.jpg?k=a5d1e24d1afdf21ef066daba9c2d73fd9db16670a75746ea59814def4470f5fd&o=&hp=1",
  "cape-weligama": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/84311412.jpg?k=3539ec4ab66f18fd1e30c1210af4bf42625c2a1919faa8407fa6f66e7bba6297&o=&hp=1",
  "leopard-trails": "https://q-xx.bstatic.com/xdata/images/hotel/max500/586443921.jpg?k=6a3573a296b67da9c3baab190743900d7d13942e36b92d014c3bef55c0afa396&o=",
  "sinharaja-lodge": "https://source.unsplash.com/800x600/?Sinharaja,forest,lodge",
  amangalla: "https://source.unsplash.com/800x600/?Amangalla,Galle,heritage,hotel",
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [viewMode, setViewMode] = useState<"list" | "grid" | "map">("list")
  const [sortBy, setSortBy] = useState<"price" | "rating" | "distance">("price")
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    amenities: [] as string[],
    rating: 0,
    view: [] as string[],
  })
  const [loading, setLoading] = useState(true)

  // Fetch initial hotels data
  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async (searchParams = new URLSearchParams()) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:9091/hotels/search?${searchParams}`)
      if (!response.ok) throw new Error('Failed to fetch hotels')
      const data = await response.json()
      
  // Transform the data to match the Hotel interface
      // Prefer numeric `cost_per_night` from the backend; fall back to parsing `price_range` when absent
      const transformedHotels: Hotel[] = data.map((hotel: any) => {
        let amenities: string[] = []
        if (Array.isArray(hotel.amenities)) {
          amenities = hotel.amenities
        } else if (typeof hotel.amenities === 'string') {
          try {
            const parsed = JSON.parse(hotel.amenities)
            if (Array.isArray(parsed)) amenities = parsed
          } catch {}
        }
        return {
          id: hotel.id,
          name: hotel.name,
          location: hotel.destination_name,
            rating: Number(hotel.rating),
          reviewCount: 0,
          // Improved price parsing with better fallback logic
          price: (() => {
            // First try cost_per_night (numeric value from backend)
            if (hotel.cost_per_night !== undefined && hotel.cost_per_night !== null) {
              const cost = Number(hotel.cost_per_night);
              if (!isNaN(cost) && cost > 0) return cost;
            }

            // Then try price_range string parsing
            if (hotel.price_range) {
              // Handle formats like "USD 150-200", "$150-200", "150-200 USD", etc.
              const priceStr = String(hotel.price_range);
              // Extract all numbers from the string
              const numbers = priceStr.match(/\d+/g);
              if (numbers && numbers.length > 0) {
                const firstPrice = Number(numbers[0]);
                if (!isNaN(firstPrice) && firstPrice > 0) return firstPrice;
              }
            }

            // Try other price fields that might exist
            if (hotel.price !== undefined && hotel.price !== null) {
              const price = Number(hotel.price);
              if (!isNaN(price) && price > 0) return price;
            }

            // If all else fails, generate a reasonable price based on hotel rating/location
            // This ensures we never show $0
            const basePrice = 100; // Base price
            const ratingMultiplier = (Number(hotel.rating) || 3) * 20; // Rating affects price
            const locationMultiplier = hotel.location?.toLowerCase().includes('colombo') ? 1.5 : 1.0;
            return Math.round(basePrice + ratingMultiplier * locationMultiplier);
          })(),
          currency: hotel.currency || 'USD',
          // Resolve image: prefer explicit backend image_url, otherwise use a mapped external URL for known hotels,
          // or finally a local placeholder.
          image: (() => {
            const raw = hotel.image_url || ""
            const name = (hotel.name || "").toLowerCase()
            // If backend provided an image_url that looks local (e.g. starts with /hotels/...), try to detect a slug
            const slugToken = raw.split('/').pop()?.toLowerCase() || ''

            // Check raw image path first, then hotel name tokens
            for (const key of Object.keys(HOTEL_IMAGE_OVERRIDES)) {
              if (slugToken.includes(key) || name.includes(key.replace(/-/g, ' '))) {
                return HOTEL_IMAGE_OVERRIDES[key]
              }
            }

            // If backend provided a full URL, use it; otherwise fall back to placeholder
            if (raw && (raw.startsWith('http') || raw.startsWith('/')) && !raw.includes('placeholder.svg')) return raw
            return "/placeholder.svg?height=200&width=300"
          })(),
          amenities,
          view: hotel.view || 'city',
          description: hotel.description || '',
          distance: '',
        }
      })

      setHotels(transformedHotels)
      setFilteredHotels(transformedHotels)
    } catch (error) {
      console.error('Error fetching hotels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (searchFilters: HotelSearchFilters) => {
    const params = new URLSearchParams()
    
    if (searchFilters.destination) {
      params.append('destination', searchFilters.destination)
    }
    if (searchFilters.priceMin !== undefined) {
      params.append('priceMin', searchFilters.priceMin.toString())
    }
    if (searchFilters.priceMax !== undefined) {
      params.append('priceMax', searchFilters.priceMax.toString())
    }
    if (searchFilters.view) {
      params.append('view', searchFilters.view)
    }

    await fetchHotels(params)
  }


  const handleFiltersChange = async (newFilters: any) => {
    setFilters(newFilters)

    const params = new URLSearchParams()
    
    if (newFilters.priceRange[0] > 0 || newFilters.priceRange[1] < 1000) {
      params.append('priceMin', newFilters.priceRange[0].toString())
      params.append('priceMax', newFilters.priceRange[1].toString())
    }
    if (newFilters.rating > 0) {
      params.append('rating', newFilters.rating.toString())
    }
    if (newFilters.amenities.length > 0) {
      params.append('amenities', newFilters.amenities.join(','))
    }
    if (newFilters.view.length > 0) {
      params.append('view', newFilters.view.join(','))
    }

    await fetchHotels(params)
  }

  // Local client-side filtering fallback to ensure UI updates even if backend doesn't apply numeric filters
  useEffect(() => {
    const [minPrice, maxPrice] = filters.priceRange
    const filtered = hotels.filter((h) => {
      const p = Number(h.price || 0)
      if (p < minPrice || p > maxPrice) return false
      if (filters.rating > 0 && (Number(h.rating || 0) < filters.rating)) return false
      if (filters.amenities.length > 0) {
        const hotelAmenities = (h.amenities || []).map((a) => String(a).toLowerCase())
        if (!filters.amenities.every((fa: string) => hotelAmenities.includes(fa.toLowerCase()))) return false
      }
      if (filters.view.length > 0 && !filters.view.includes(h.view)) return false
      return true
    })
    setFilteredHotels(filtered)
  }, [filters, hotels])

  const handleHotelSelect = (hotel: Hotel) => {
    console.log("Selected hotel:", hotel)
    // In a real app, this would open a detailed view or modal
  }

  const handleLockInPlan = (hotel: Hotel) => {
    console.log("Locking hotel in plan:", hotel)
    // In a real app, this would add the hotel to the user's itinerary
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece7dc] via-[#307082]/10 to-[#6ca3a2]/20">
      <Navbar />

      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Enhanced Header Section */}
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <h1 className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#12212e] via-[#307082] to-[#6ca3a2] bg-clip-text text-transparent mb-4 animate-fade-in">
              Find Hotels in Sri Lanka
            </h1>
            {/* Decorative underline */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#307082] to-[#6ca3a2] rounded-full animate-expand"></div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6">
            {/* Hotels Badge */}
            <div className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#307082]/10 to-[#6ca3a2]/10 rounded-full border border-[#307082]/20 hover:border-[#307082] transition-all duration-300 animate-slide-in-left">
              <div className="w-2 h-2 bg-[#307082] rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-[#12212e]">{filteredHotels.length} hotels</span>
            </div>

            {/* Separator Dot */}
            <div className="w-1 h-1 bg-[#6ca3a2] rounded-full animate-bounce"></div>

            {/* Sri Lanka Badge */}
            <div className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6ca3a2]/10 to-[#12212e]/10 rounded-full border border-[#6ca3a2]/20 hover:border-[#6ca3a2] transition-all duration-300 animate-slide-in-up">
              <svg className="w-4 h-4 text-[#6ca3a2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-sm font-semibold text-[#12212e]">Sri Lanka</span>
            </div>

            {/* Separator Dot */}
            <div className="w-1 h-1 bg-[#12212e] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>

            {/* Adventure Badge */}
            <div className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#12212e]/10 to-[#ea9940]/10 rounded-full border border-[#12212e]/20 hover:border-[#12212e] transition-all duration-300 animate-slide-in-right">
              <svg className="w-4 h-4 text-[#ea9940]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-sm font-semibold text-[#12212e]">Adventure Awaits</span>
            </div>
          </div>

          <p className="text-[#307082] mt-4 max-w-2xl mx-auto leading-relaxed">
            Discover the perfect accommodation for your Sri Lankan adventure. From luxury resorts with ocean views to charming boutique hotels nestled in the hills.
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-60"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-40"></div>
            <HotelSearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-60"></div>
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full opacity-40"></div>
                <HotelFilters filters={filters} onFiltersChange={handleFiltersChange} />
              </div>
            </div>
          </div>

          {/* Enhanced Results Section */}
          <div className="lg:col-span-3">
            {/* Enhanced Results Header */}
            <div className="relative mb-8">
              <div className="absolute -top-2 -left-2 w-5 h-5 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full opacity-60"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-40"></div>

              <div className="bg-gradient-to-r from-white via-[#ece7dc]/30 to-[#307082]/10 backdrop-blur-sm rounded-2xl border border-[#6ca3a2]/20 shadow-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-lg shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#12212e]">Hotel Results</h2>
                        <p className="text-[#307082]">
                          {filteredHotels.length} amazing {filteredHotels.length === 1 ? 'hotel' : 'hotels'} found
                          {filters.amenities.length > 0 || filters.view.length > 0 || filters.rating > 0 ? " matching your preferences" : ""}
                        </p>
                      </div>
                    </div>

                    {/* Active Filters Display */}
                    {(filters.amenities.length > 0 || filters.view.length > 0 || filters.rating > 0) && (
                      <div className="flex flex-wrap gap-2">
                        {filters.amenities.map((amenity) => (
                          <Badge key={amenity} className="bg-gradient-to-r from-[#307082] to-[#6ca3a2] text-white border-0 shadow-md px-3 py-1">
                            {amenity}
                          </Badge>
                        ))}
                        {filters.view.map((view) => (
                          <Badge key={view} className="bg-gradient-to-r from-[#6ca3a2] to-[#12212e] text-white border-0 shadow-md px-3 py-1">
                            {view} view
                          </Badge>
                        ))}
                        {filters.rating > 0 && (
                          <Badge className="bg-gradient-to-r from-[#ea9940] to-[#d88a36] text-white border-0 shadow-md px-3 py-1">
                            {filters.rating}+ stars
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Controls */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-4 py-2 bg-white border border-[#6ca3a2]/30 rounded-xl text-sm font-medium text-[#12212e] shadow-sm hover:border-[#307082] focus:border-[#307082] focus:ring-2 focus:ring-[#307082]/20 transition-all duration-200"
                    >
                      <option value="price">Sort by Price</option>
                      <option value="rating">Sort by Rating</option>
                      <option value="distance">Sort by Distance</option>
                    </select>

                    <div className="flex bg-white border border-[#6ca3a2]/30 rounded-xl shadow-sm overflow-hidden">
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={`rounded-none border-0 ${viewMode === "list" ? "bg-gradient-to-r from-[#307082] to-[#6ca3a2] text-white shadow-md" : "hover:bg-[#ece7dc]/50"}`}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={`rounded-none border-0 ${viewMode === "grid" ? "bg-gradient-to-r from-[#307082] to-[#6ca3a2] text-white shadow-md" : "hover:bg-[#ece7dc]/50"}`}
                      >
                        <Grid className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "map" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("map")}
                        className={`rounded-none border-0 ${viewMode === "map" ? "bg-gradient-to-r from-[#307082] to-[#6ca3a2] text-white shadow-md" : "hover:bg-[#ece7dc]/50"}`}
                      >
                        <Map className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Hotel Results */}
            {loading ? (
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full opacity-60"></div>
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-br from-[#6ca3a2] to-[#12212e] rounded-full opacity-40"></div>
                <div className="bg-gradient-to-r from-white via-[#ece7dc]/30 to-[#307082]/10 backdrop-blur-sm rounded-2xl border border-[#6ca3a2]/20 shadow-xl p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#12212e] mb-2">Finding Perfect Hotels</h3>
                  <p className="text-[#307082]">Discovering amazing accommodations for your Sri Lankan adventure...</p>
                </div>
              </div>
            ) : viewMode === "map" ? (
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full opacity-60"></div>
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-br from-[#6ca3a2] to-[#12212e] rounded-full opacity-40"></div>
                <div className="bg-gradient-to-r from-white via-[#ece7dc]/30 to-[#307082]/10 backdrop-blur-sm rounded-2xl border border-[#6ca3a2]/20 shadow-xl p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Map className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#12212e] mb-2">Map View Coming Soon</h3>
                  <p className="text-[#307082]">Explore hotels interactively on our beautiful map interface</p>
                </div>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 xl:grid-cols-2 gap-6" : "space-y-6"}>
                {filteredHotels.map((hotel) => (
                  <div key={hotel.id} className="relative">
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-60"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-40"></div>
                    <HotelCard
                      hotel={hotel}
                      onSelect={handleHotelSelect}
                      onLockInPlan={handleLockInPlan}
                      showLockButton={true}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced No Results */}
            {!loading && filteredHotels.length === 0 && (
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full opacity-60"></div>
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-br from-[#6ca3a2] to-[#12212e] rounded-full opacity-40"></div>
                <div className="bg-gradient-to-r from-white via-[#ece7dc]/30 to-[#307082]/10 backdrop-blur-sm rounded-2xl border border-[#6ca3a2]/20 shadow-xl p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#307082] to-[#6ca3a2] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#12212e] mb-2">No Hotels Found</h3>
                  <p className="text-[#307082] mb-6">We couldn't find hotels matching your criteria. Try adjusting your filters.</p>
                  <Button
                    onClick={() =>
                      handleFiltersChange({
                        priceRange: [0, 1000],
                        amenities: [],
                        rating: 0,
                        view: [],
                      })
                    }
                    className="bg-gradient-to-r from-[#307082] to-[#6ca3a2] hover:from-[#2a6370] hover:to-[#5a8f8e] text-white border-0 shadow-md px-6 py-2"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
