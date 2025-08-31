"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

interface HotelFiltersProps {
  filters: {
    priceRange: number[]
    amenities: string[]
    rating: number
    view: string[]
  }
  onFiltersChange: (filters: any) => void
}

const amenityOptions = [
  "WiFi",
  "Parking",
  "Breakfast",
  "Pool",
  "Spa",
  "Gym",
  "Restaurant",
  "Room Service",
  "Air Conditioning",
  "Beach Access",
]

const viewOptions = [
  { id: "sea", name: "Sea View" },
  { id: "hill", name: "Hill View" },
  { id: "city", name: "City View" },
  { id: "jungle", name: "Jungle View" },
]

export function HotelFilters({ filters, onFiltersChange }: HotelFiltersProps) {
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked ? [...filters.amenities, amenity] : filters.amenities.filter((a) => a !== amenity)

    onFiltersChange({
      ...filters,
      amenities: newAmenities,
    })
  }

  const handleViewChange = (view: string, checked: boolean) => {
    const newViews = checked ? [...filters.view, view] : filters.view.filter((v) => v !== view)

    onFiltersChange({
      ...filters,
      view: newViews,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      priceRange: [0, 1000],
      amenities: [],
      rating: 0,
      view: [],
    })
  }

  const activeFiltersCount = filters.amenities.length + filters.view.length + (filters.rating > 0 ? 1 : 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{activeFiltersCount} active</Badge>
              <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                Clear all
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Price Range (per night)</Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
            max={1000}
            step={25}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-slate-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Minimum Rating</Label>
          <Slider
            value={[filters.rating]}
            onValueChange={(value) => onFiltersChange({ ...filters, rating: value[0] })}
            max={5}
            step={0.5}
            className="w-full"
          />
          <div className="text-sm text-slate-600">{filters.rating}+ stars</div>
        </div>

        {/* View Preferences */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">View Preferences</Label>
          <div className="space-y-2">
            {viewOptions.map((view) => (
              <div key={view.id} className="flex items-center space-x-2">
                <Checkbox
                  id={view.id}
                  checked={filters.view.includes(view.id)}
                  onCheckedChange={(checked) => handleViewChange(view.id, checked as boolean)}
                />
                <Label htmlFor={view.id} className="text-sm">
                  {view.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Amenities</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {amenityOptions.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                />
                <Label htmlFor={amenity} className="text-sm">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
