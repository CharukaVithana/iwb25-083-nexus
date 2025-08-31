"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoneChips } from "@/components/zone-chips"
import { zones as zoneCards } from "@/components/zone-chips"
import { cn } from "@/lib/utils"

interface PreferencesStepProps {
  onNext: (data: PreferencesData) => void
  onBack: () => void
}

export interface PreferencesData {
  zones: string[]
  startingLocation: string
  pace: string
  hotelView: string
  transport: string
  comfortLevel: number
}

const hotelViews = [
  {
    id: "sea",
    name: "Sea View",
    description: "Ocean and beach views",
    icon: "🌊",
  },
  {
    id: "hill",
    name: "Hill View",
    description: "Mountain and tea plantation views",
    icon: "🏞️",
  },
  {
    id: "city",
    name: "City View",
    description: "Urban and cultural sites",
    icon: "🏙️",
  },
  {
    id: "jungle",
    name: "Jungle View",
    description: "Wildlife and nature reserves",
    icon: "🌳",
  },
]

const transportOptions = [
  {
    id: "train",
    name: "Train",
    description: "Scenic railway journeys",
    icon: "🚆",
  },
  {
    id: "bus",
    name: "Bus",
    description: "Budget-friendly local transport",
    icon: "🚌",
  },
  {
    id: "car-driver",
    name: "Car + Driver",
    description: "Private car with local driver",
    icon: "🚗",
  },
  {
    id: "self-drive",
    name: "Self Drive",
    description: "Rent a car and drive yourself",
    icon: "🏎️",
  },
]

const startingLocations = [
  {
    id: "colombo",
    name: "Colombo",
    description: "Capital city - International airport gateway",
    region: "Western",
    coordinates: { lat: 6.9271, lng: 79.9612 },
    image: "/colombo.jpg"
  },
  {
    id: "negombo",
    name: "Negombo",
    description: "Beach town near airport - Coastal start",
    region: "Western",
    coordinates: { lat: 7.2084, lng: 79.8398 },
    image: "/negombo.jpg"
  },
  {
    id: "kandy",
    name: "Kandy",
    description: "Cultural capital - Hill country gateway",
    region: "Central",
    coordinates: { lat: 7.2906, lng: 80.6337 },
    image: "/Kandy.jpg"
  },
  {
    id: "galle",
    name: "Galle",
    description: "Southern fort city - Coastal heritage",
    region: "Southern",
    coordinates: { lat: 6.0535, lng: 80.2210 },
    image: "/Galle.jpg"
  },
  {
    id: "trincomalee",
    name: "Trincomalee",
    description: "Eastern port city - Beach & culture",
    region: "Eastern",
    coordinates: { lat: 8.5874, lng: 81.2152 },
    image: "/Trincomalee.jpg"
  },
  {
    id: "jaffna",
    name: "Jaffna",
    description: "Northern cultural hub - Tamil heritage",
    region: "Northern",
    coordinates: { lat: 9.6615, lng: 80.0255 },
    image: "/Jaffna.jpg"
  },
  {
    id: "anuradhapura",
    name: "Anuradhapura",
    description: "Ancient capital - Cultural triangle start",
    region: "North Central",
    coordinates: { lat: 8.3114, lng: 80.4037 },
    image: "/Anuradhapura.jpg"
  },
  {
    id: "ella",
    name: "Ella",
    description: "Hill country gem - Tea plantation views",
    region: "Uva",
    coordinates: { lat: 6.8720, lng: 81.0462 },
    image: "/Ella.jpg"
  }
]

export function PreferencesStep({ onNext, onBack }: PreferencesStepProps) {
  const [zones, setZones] = useState<string[]>([])
  const [startingLocation, setStartingLocation] = useState<string>("")
  const [pace, setPace] = useState<string>("balanced")
  const [hotelView, setHotelView] = useState<string>("")
  const [transport, setTransport] = useState<string>("")
  const [comfortLevel, setComfortLevel] = useState<number[]>([50])


  const handleZoneToggle = (zoneId: string) => {
    setZones((prev) => (prev.includes(zoneId) ? prev.filter((z) => z !== zoneId) : [...prev, zoneId]))
  }

  const handleNext = () => {
    if (zones.length === 0 || !startingLocation || !hotelView || !transport) return

    onNext({
      zones,
      startingLocation,
      pace,
      hotelView,
      transport,
      comfortLevel: comfortLevel[0],
    })
  }

  const isValid = zones.length > 0 && startingLocation && hotelView && transport

  return (
    <Card className="max-w-4xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-5">
        <img
          src="/placeholder.svg?height=200&width=200"
          alt="Cultural Decoration"
          className="w-32 h-32 object-contain"
        />
      </div>
      <CardHeader className="relative z-10">
        <CardTitle className="font-serif text-2xl text-center">Your Travel Preferences</CardTitle>
        <p className="text-center text-slate-600">Tell us what kind of Sri Lankan experience you're looking for</p>
      </CardHeader>
      <CardContent className="space-y-8 relative z-10">
        {/* Zones Selection */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Which areas interest you most?</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {zoneCards.map(zone => (
              <div
                key={zone.id}
                onClick={() => handleZoneToggle(zone.id)}
                className={cn(
                  "relative rounded-xl cursor-pointer overflow-hidden shadow-md border-2 flex flex-col items-center justify-center min-h-[220px] transition-all",
                  zones.includes(zone.id) ? "border-primary ring-2 ring-primary" : "border-slate-200 hover:border-primary/50"
                )}
                style={{
                  backgroundImage: `url(${zone.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0" style={{background: "rgba(0,0,0,0.5)"}}></div>
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-6 py-8 text-center">
                  <h3 className="font-serif text-xl font-bold text-white mb-2 drop-shadow-lg">{zone.name}</h3>
                  <p className="text-white text-sm font-medium mb-1 drop-shadow-lg">{zone.description}</p>
                  <span className="text-slate-400 text-xs font-semibold mb-1 drop-shadow-lg">{zone.count}</span>
                  <span className="text-white text-xs drop-shadow-lg">Key spots: {zone.destinations}</span>
                </div>
                {/* Selected checkmark */}
                {zones.includes(zone.id) && (
                  <div className="absolute top-3 right-3 bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg z-20">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Starting Location Selection - Only show if zones are selected */}
        {zones.length > 0 && (
          <div className="space-y-4">
            <Label className="text-lg font-medium">Where would you like to start your journey?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {startingLocations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => setStartingLocation(location.id)}
                  className={cn(
                    "relative rounded-lg border-2 cursor-pointer transition-all hover:shadow-md overflow-hidden min-h-[140px] flex flex-col justify-center",
                    startingLocation === location.id ? 
                      "border-primary bg-primary/5 shadow-sm" : 
                      "border-slate-200 hover:border-primary/50",
                  )}
                  style={{
                    backgroundImage: `url(${location.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                >
                  {/* Overlay for readability */}
                  <div className="absolute inset-0" style={{background: "rgba(255,255,255,0.5)"}}></div>
                  <div className="relative z-10 flex flex-col gap-2 px-4 pt-4 pb-4 text-left">
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{location.name}</h3>
                    <span className="text-xs font-semibold text-slate-700 mb-1">{location.region} Province</span>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{location.description}</p>
                  </div>
                  {startingLocation === location.id && (
                    <div className="absolute top-3 right-3 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {startingLocation && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-800">
                    Starting Point Selected: {startingLocations.find(loc => loc.id === startingLocation)?.name}
                  </span>
                </div>
                <p className="text-xs text-blue-700">
                  AI will optimize your route starting from this location to minimize travel time and create logical geographic flow.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Travel Pace */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Travel Pace</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "chill", name: "Chill", description: "Relaxed, plenty of downtime" },
              { id: "balanced", name: "Balanced", description: "Mix of activities and rest" },
              { id: "packed", name: "Packed", description: "See as much as possible" },
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => setPace(option.id)}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all",
                  pace === option.id ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/50",
                )}
              >
                <h3 className="font-medium text-slate-900">{option.name}</h3>
                <p className="text-sm text-slate-600">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hotel View Preference */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Preferred Hotel Views</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hotelViews.map((view) => (
              <div
                key={view.id}
                onClick={() => setHotelView(view.id)}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all overflow-hidden",
                  hotelView === view.id ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/50",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl w-16 h-12 flex items-center justify-center rounded bg-slate-100 mr-2">{view.icon}</span>
                  <div>
                    <h3 className="font-medium text-slate-900">{view.name}</h3>
                    <p className="text-sm text-slate-600">{view.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transport Preference */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Preferred Transportation</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {transportOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setTransport(option.id)}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all",
                  transport === option.id ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/50",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl w-12 h-9 flex items-center justify-center rounded bg-slate-100 mr-2">{option.icon}</span>
                  <div>
                    <h3 className="font-medium text-slate-900">{option.name}</h3>
                    <p className="text-sm text-slate-600">{option.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comfort vs Budget Slider */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Comfort vs Budget</Label>
          <div className="px-4">
            <Slider value={comfortLevel} onValueChange={setComfortLevel} max={100} step={10} className="w-full" />
            <div className="flex justify-between text-sm text-slate-600 mt-2">
              <span>Budget-focused</span>
              <span>Balanced</span>
              <span>Comfort-focused</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack} size="lg" className="flex-1 bg-transparent">
            Back to Budget
          </Button>
          <Button onClick={handleNext} disabled={!isValid} className="flex-1 bg-primary hover:bg-primary-700" size="lg">
            Create My Itinerary
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
