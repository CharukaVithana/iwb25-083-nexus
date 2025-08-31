"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Car, Coffee, Waves, Mountain, Building, Trees, X, Phone, Mail, Globe } from "lucide-react"
import { Hotel } from "./hotel-card"

interface HotelDetailsModalProps {
  hotel: Hotel | null
  isOpen: boolean
  onClose: () => void
}

// Detailed information for the 5 premium hotels
const HOTEL_DETAILS: Record<string, any> = {
  "Amanwella": {
    description: "Amanwella is a luxurious beach resort nestled in the coastal paradise of Tangalle, Sri Lanka. This intimate sanctuary offers unparalleled luxury with just 14 private villas, each featuring stunning ocean views and direct beach access. The resort combines traditional Sri Lankan architecture with modern elegance, creating an atmosphere of serene sophistication.",
    highlights: [
      "14 private villas with ocean views",
      "Direct beach access",
      "Award-winning Aman Spa",
      "Private dining experiences",
      "Cultural performances",
      "Helicopter transfers available"
    ],
    amenities: [
      "Private beach",
      "Infinity pool",
      "Aman Spa",
      "Fine dining restaurant",
      "Library",
      "Cultural center",
      "Helicopter pad",
      "Concierge services"
    ],
    location: "Tangalle, Sri Lanka",
    contact: {
      phone: "+94 47 222 3333",
      email: "reservations@amanwella.com",
      website: "www.amanwella.com"
    },
    images: [
      "https://ik.imgkit.net/3vlqs5axxjf/external/ik-seo/https://media.iceportal.com/127248/photos/72801400_XL/Amanwella-Exterior.jpg?tr=w-656%2Ch-390%2Cfo-auto",
      "/bentota.jpg",
      "/beach.jpg"
    ]
  },
  "Wild Coast Tented Lodge": {
    description: "Wild Coast Tented Lodge offers an extraordinary safari experience in the heart of Yala National Park. This luxury eco-lodge features spacious tents with modern amenities, private plunge pools, and unparalleled wildlife viewing opportunities. Each tent is designed to blend seamlessly with the natural surroundings while providing the highest level of comfort.",
    highlights: [
      "Prime location in Yala National Park",
      "Luxury safari tents with private plunge pools",
      "Daily wildlife safaris",
      "Expert naturalist guides",
      "Sustainable eco-friendly design",
      "Award-winning cuisine"
    ],
    amenities: [
      "Private plunge pools",
      "Outdoor showers",
      "Safari vehicles",
      "Naturalist guides",
      "Fine dining",
      "Spa treatments",
      "Library",
      "Observation decks"
    ],
    location: "Yala National Park, Sri Lanka",
    contact: {
      phone: "+94 47 222 4444",
      email: "reservations@wildcoastlodge.com",
      website: "www.wildcoastlodge.com"
    },
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/138890847.jpg?k=64e1cdc9a56b8238534101fdf6cc08654ffdf75c2b4a85729b5759700845546c&o=&hp=1",
      "/sigiriya.jpg",
      "/nine.jpg"
    ]
  },
  "Anantara Peace Haven": {
    description: "Anantara Peace Haven Tangalle is a cliff-top luxury resort offering breathtaking views of the Indian Ocean. This award-winning property features contemporary design with traditional Sri Lankan elements, creating a perfect blend of modern luxury and cultural authenticity. The resort's infinity pool and private beach access make it an ideal destination for discerning travelers.",
    highlights: [
      "Cliff-top location with ocean views",
      "Award-winning infinity pool",
      "Private beach access",
      "Luxury spa and wellness center",
      "Multiple dining options",
      "Cultural experiences",
      "Kids club and family activities"
    ],
    amenities: [
      "Infinity pool",
      "Private beach",
      "Anantara Spa",
      "Multiple restaurants",
      "Kids club",
      "Fitness center",
      "Business center",
      "Concierge services"
    ],
    location: "Tangalle, Sri Lanka",
    contact: {
      phone: "+94 47 222 5555",
      email: "reservations@anantara.com",
      website: "www.anantara.com"
    },
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/65697351.jpg?k=a5d1e24d1afdf21ef066daba9c2d73fd9db16670a75746ea59814def4470f5fd&o=&hp=1",
      "/bentota1.jpg",
      "/boat.jpg"
    ]
  },
  "Cape Weligama": {
    description: "Cape Weligama is a stunning cliff-top resort located in the vibrant coastal town of Mirissa. This luxury property offers panoramic views of the Indian Ocean and features a unique moon pool that appears to float above the sea. The resort combines contemporary design with Sri Lankan hospitality, providing an unforgettable beach vacation experience.",
    highlights: [
      "Spectacular cliff-top location",
      "Iconic moon pool",
      "Panoramic ocean views",
      "Multiple dining venues",
      "Spa and wellness facilities",
      "Water sports activities",
      "Cultural excursions"
    ],
    amenities: [
      "Moon pool",
      "Cliff-top location",
      "Multiple restaurants",
      "Spa center",
      "Fitness center",
      "Water sports",
      "Kids activities",
      "Business facilities"
    ],
    location: "Mirissa, Sri Lanka",
    contact: {
      phone: "+94 41 222 6666",
      email: "reservations@capeweligama.com",
      website: "www.capeweligama.com"
    },
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/84311412.jpg?k=3539ec4ab66f18fd1e30c1210af4bf42625c2a1919faa8407fa6f66e7bba6297&o=&hp=1",
      "/surfer1.jpg",
      "/nine.jpg"
    ]
  },
  "Leopard Trails Wilpattu": {
    description: "Leopard Trails Wilpattu offers an exclusive wildlife experience in the pristine Wilpattu National Park. This luxury safari camp provides intimate encounters with Sri Lanka's wildlife, featuring spacious tents, gourmet dining, and expert-guided safaris. The camp is designed to minimize environmental impact while maximizing guest comfort and wildlife viewing opportunities.",
    highlights: [
      "Exclusive access to Wilpattu National Park",
      "Luxury safari tents",
      "Private wildlife safaris",
      "Expert naturalist guides",
      "Gourmet bush dining",
      "Photography workshops",
      "Conservation focus"
    ],
    amenities: [
      "Luxury tents",
      "Private safaris",
      "Naturalist guides",
      "Gourmet dining",
      "Photography services",
      "Spa treatments",
      "Library",
      "Observation areas"
    ],
    location: "Wilpattu National Park, Sri Lanka",
    contact: {
      phone: "+94 11 222 7777",
      email: "reservations@leopardtrails.com",
      website: "www.leopardtrails.com"
    },
    images: [
      "https://q-xx.bstatic.com/xdata/images/hotel/max500/586443921.jpg?k=6a3573a296b67da9c3baab190743900d7d13942e36b92d014c3bef55c0afa396&o=",
      "/sigiriya.jpg",
      "/bentota.jpg"
    ]
  }
}

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

export function HotelDetailsModal({ hotel, isOpen, onClose }: HotelDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!hotel) return null

  const details = HOTEL_DETAILS[hotel.name]
  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "Rs"
    return `${symbol}${amount}`
  }

  const nextImage = () => {
    if (details?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % details.images.length)
    }
  }

  const prevImage = () => {
    if (details?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + details.images.length) % details.images.length)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">{hotel.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          {details?.images && (
            <div className="relative">
              <img
                src={details.images[currentImageIndex]}
                alt={hotel.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              {details.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {details.images.map((_: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-slate-600" />
                <span className="text-slate-600">{details?.location || hotel.location}</span>
              </div>
              <div className="flex items-center gap-1 mb-4">
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
                <span className="text-sm font-medium ml-1">{hotel.rating}</span>
                <span className="text-sm text-slate-500 ml-2">({hotel.reviewCount} reviews)</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-2">
                {formatCurrency(hotel.price, hotel.currency)}
                <span className="text-sm text-slate-500 font-normal"> per night</span>
              </div>
            </div>

            <div>
              <Badge variant="outline" className="flex items-center gap-1 w-fit mb-2">
                {getViewIcon(hotel.view)}
                <span className="capitalize">{hotel.view} View</span>
              </Badge>
              <div className="flex flex-wrap gap-1">
                {hotel.amenities.slice(0, 4).map((amenity) => (
                  <Badge key={amenity} variant="outline" className="flex items-center gap-1 text-xs">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </Badge>
                ))}
                {hotel.amenities.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{hotel.amenities.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {details?.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">About This Property</h3>
              <p className="text-slate-600 leading-relaxed">{details.description}</p>
            </div>
          )}

          {/* Highlights */}
          {details?.highlights && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Highlights</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {details.highlights.map((highlight: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-slate-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Amenities */}
          {details?.amenities && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Amenities & Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {details.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-slate-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {details?.contact && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4" />
                  <span>{details.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4" />
                  <span>{details.contact.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Globe className="w-4 h-4" />
                  <a href={`https://${details.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {details.contact.website}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              Book Now
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
