"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Car, Coffee, Waves, Mountain, Building, Trees } from "lucide-react"
import { HotelDetailsModal } from "./hotel-details-modal"

export interface Hotel {
  id: string
  name: string
  location: string
  rating: number
  reviewCount: number
  // `price` is the UI-facing numeric per-night amount. Backends may return `cost_per_night`.
  price: number
  currency: string
  originalPrice?: number
  image: string
  amenities: string[]
  view: string
  description: string
  distance?: string
}

interface HotelCardProps {
  hotel: Hotel
  onSelect: (hotel: Hotel) => void
  onLockInPlan?: (hotel: Hotel) => void
  showLockButton?: boolean
}

// List of premium hotels that have detailed modals
const PREMIUM_HOTELS = [
  "Amanwella",
  "Wild Coast Tented Lodge",
  "Anantara Peace Haven",
  "Cape Weligama",
  "Leopard Trails Wilpattu"
]

const getViewIcon = (view: string) => {
  switch (view) {
    case "sea":
      return <Waves className="w-4 h-4" />
    case "hill":
      return <Mountain className="w-4 h-4" />
    case "city":
      return <Building className="w-4 h-4" />
    case "jungle":
      return <Trees className="w-4 h-4" />
    default:
      return <MapPin className="w-4 h-4" />
  }
}

const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case "wifi":
      return <Wifi className="w-3 h-3" />
    case "parking":
      return <Car className="w-3 h-3" />
    case "breakfast":
      return <Coffee className="w-3 h-3" />
    default:
      return null
  }
}

const getCulturalHotelImage = (hotel: Hotel) => {
  const baseQuery = hotel.image.includes("placeholder.svg") ? hotel.image : hotel.image

  if (baseQuery.includes("placeholder.svg")) {
    // Enhance placeholder images with Sri Lankan context
    if (hotel.view === "sea") {
      return `/placeholder.svg?height=200&width=300&query=luxury Sri Lankan beach resort hotel ${hotel.location} ocean view traditional architecture`
    } else if (hotel.view === "hill") {
      return `/placeholder.svg?height=200&width=300&query=Sri Lankan hill country hotel ${hotel.location} tea plantation view colonial architecture`
    } else if (hotel.view === "city") {
      return `/placeholder.svg?height=200&width=300&query=modern Sri Lankan city hotel ${hotel.location} urban skyline traditional elements`
    } else if (hotel.view === "jungle") {
      return `/placeholder.svg?height=200&width=300&query=Sri Lankan eco lodge jungle hotel ${hotel.location} wildlife nature traditional design`
    }
  }

  return baseQuery
}

export function HotelCard({ hotel, onSelect, onLockInPlan, showLockButton = false }: HotelCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "Rs"
    return `${symbol}${amount}`
  }

  const isPremiumHotel = PREMIUM_HOTELS.includes(hotel.name)

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card's onClick
    if (isPremiumHotel) {
      setShowDetailsModal(true)
    } else {
      // For non-premium hotels, you could redirect to a general hotel page or show a different modal
      console.log("View details for:", hotel.name)
    }
  }

  return (
    <>
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden"
        onClick={() => onSelect(hotel)}
      >
        <div className="absolute top-2 right-2 opacity-10 z-10">
          <img src="/placeholder.svg?height=40&width=40" alt="Cultural Pattern" className="w-6 h-6 object-contain" />
        </div>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Hotel Image */}
            <div className="md:w-1/3 relative">
              <img
                src={getCulturalHotelImage(hotel) || "/placeholder.svg"}
                alt={hotel.name}
                className="w-full h-48 object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              />
              {hotel.originalPrice && hotel.originalPrice > hotel.price && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                  Save {formatCurrency(hotel.originalPrice - hotel.price, hotel.currency)}
                </Badge>
              )}
            </div>

            {/* Hotel Details */}
            <div className="md:w-2/3 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-1">{hotel.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.location}</span>
                      {hotel.distance && <span>• {hotel.distance}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(hotel.rating) ? "text-yellow-400 fill-current" : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{hotel.rating}</span>
                    </div>
                    <p className="text-xs text-slate-500">({hotel.reviewCount} reviews)</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{hotel.description}</p>

                {/* View and Amenities */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getViewIcon(hotel.view)}
                    <span className="capitalize">{hotel.view} View</span>
                  </Badge>
                  {hotel.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="outline" className="flex items-center gap-1">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </Badge>
                  ))}
                  {hotel.amenities.length > 3 && <Badge variant="outline">+{hotel.amenities.length - 3} more</Badge>}
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {formatCurrency(hotel.price, hotel.currency)}
                    </span>
                    <span className="text-sm text-slate-500">per night</span>
                  </div>
                  {hotel.originalPrice && hotel.originalPrice > hotel.price && (
                    <span className="text-sm text-slate-500 line-through">
                      {formatCurrency(hotel.originalPrice, hotel.currency)}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-800 border border-slate-300 hover:border-slate-400 transition-colors duration-200"
                    onClick={handleViewDetails}
                  >
                    View Details
                  </Button>
                  {showLockButton && onLockInPlan && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        onLockInPlan(hotel)
                      }}
                      size="sm"
                      className="bg-primary hover:bg-primary-700"
                    >
                      Lock in Plan
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotel Details Modal */}
      <HotelDetailsModal
        hotel={hotel}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </>
  )
}
