"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Users } from "lucide-react"

interface HotelSearchBarProps {
  onSearch: (filters: HotelSearchFilters) => void
}

export interface HotelSearchFilters {
  destination: string
  checkIn: string
  checkOut: string
  guests: number
  priceMin: number
  priceMax: number
  view: string
  amenities: string[]
}

const sriLankanDestinations = [
  "Colombo",
  "Galle",
  "Kandy",
  "Anuradhapura",
  "Sigiriya",
  "Ella",
  "Nuwara Eliya",
  "Mirissa",
  "Bentota",
  "Negombo",
  "Trincomalee",
  "Yala",
]

export function HotelSearchBar({ onSearch }: HotelSearchBarProps) {
  const [destination, setDestination] = useState("Colombo")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [view, setView] = useState("")

  const handleSearch = () => {
    onSearch({
      destination,
      checkIn,
      checkOut,
      guests: Number.parseInt(guests),
      priceMin: Number.parseInt(priceMin) || 0,
      priceMax: Number.parseInt(priceMax) || 1000,
      view,
      amenities: [],
    })
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {sriLankanDestinations.map((dest) => (
                  <SelectItem key={dest} value={dest}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {dest}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="check-in">Check-in</Label>
            <Input
              id="check-in"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="check-out">Check-out</Label>
            <Input
              id="check-out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Guests</Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((count) => (
                  <SelectItem key={count} value={count.toString()}>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {count} {count === 1 ? "guest" : "guests"}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="price-min">Min Price (per night)</Label>
            <Input
              id="price-min"
              type="number"
              placeholder="50"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price-max">Max Price (per night)</Label>
            <Input
              id="price-max"
              type="number"
              placeholder="500"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="view">Preferred View</Label>
            <Select value={view} onValueChange={setView}>
              <SelectTrigger>
                <SelectValue placeholder="Any view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any view</SelectItem>
                <SelectItem value="sea">Sea View</SelectItem>
                <SelectItem value="hill">Hill View</SelectItem>
                <SelectItem value="city">City View</SelectItem>
                <SelectItem value="jungle">Jungle View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleSearch} className="w-full bg-primary hover:bg-primary-700" size="lg">
          <Search className="w-4 h-4 mr-2" />
          Search Hotels
        </Button>
      </CardContent>
    </Card>
  )
}
