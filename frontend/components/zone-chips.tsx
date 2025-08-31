export interface Zone {
  id: string;
  name: string;
  description: string;
  destinations: string;
  count: string;
  image: string;
}

export interface ZoneChipsProps {
  selectedZones: string[];
  onZoneToggle: (zoneId: string) => void;
}
"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export const zones = [
  { 
    id: "coastal", 
    name: "Coastal Paradise", 
    description: "Golden beaches, world-class surfing, vibrant fishing villages, and unforgettable sunsets.", 
    destinations: "Bentota, Galle, Mirissa, Arugam Bay, Hikkaduwa, Tangalle, Unawatuna",
    count: "75+ destinations",
    image: "/coastal_paradise.jpg"
  },
  { 
    id: "hill", 
    name: "Hill Country", 
    description: "Lush Tea plantations, misty peaks, cascading waterfalls, and cool escapes.", 
    destinations: "Ella, Nuwara Eliya, Kandy, Haputale, Bandarawela, Horton Plains",
    count: "50+ destinations",
    image: "/hill_country.jpg"
  },
  { 
    id: "cultural", 
    name: "Cultural Triangle", 
    description: "Sri Lanka’s historic core, Ancient capitals, cave temples, and heritage sites.", 
    destinations: "Sigiriya, Anuradhapura, Polonnaruwa, Dambulla, Mihintale",
    count: "40+ destinations",
    image: "/Cultural-Triangle.jpg"
  },
  { 
    id: "wildlife", 
    name: "Wildlife & Nature", 
    description: "Safari adventures, rare wildlife, tropical rainforests, and untouched reserves.", 
    destinations: "Yala, Udawalawe, Minneriya, Wilpattu, Sinharaja, Knuckles",
    count: "35+ destinations",
    image: "/wildlife&nature.jpg"
  },
  { 
    id: "adventure", 
    name: "Adventure Sports", 
    description: "Thrilling hikes, white-water rafting, surfing hotspots, and adrenaline-packed trails.", 
    destinations: "Kitulgala, Adam's Peak, Ella Rock, Little Adam's Peak",
    count: "45+ destinations",
    image: "/adventure_sports.jpg"
  },
  { 
    id: "northern", 
    name: "Northern Frontier", 
    description: "Unique Tamil heritage, remote islands, lagoons, and hidden wilderness.", 
    destinations: "Jaffna, Mannar, Delft Island, Nagadeepa, Point Pedro",
    count: "25+ destinations",
    image: "/northern_frontier.jpg"
  },
  { 
    id: "eastern", 
    name: "Eastern Coast", 
    description: "Tranquil bays, coral reefs, historic temples, and crystal-clear waters.", 
    destinations: "Trincomalee, Pasikuda, Kalkudah, Nilaveli, Batticaloa",
    count: "20+ destinations",
    image: "/eastern_coast.jpg"
  },
  { 
    id: "western", 
    name: "Western Gateway", 
    description: "Bustling Colombo, beach resorts, shopping, nightlife, and urban culture.", 
    destinations: "Colombo, Negombo, Mount Lavinia, Kalutara, Gampaha",
    count: "25+ destinations",
    image: "/western_gateway.jpg"
  },
]
export function ZoneChips({ selectedZones, onZoneToggle }: ZoneChipsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => {
          const isSelected = selectedZones.includes(zone.id)
          return (
            <div
              key={zone.id}
              onClick={() => onZoneToggle(zone.id)}
              className={cn(
                "p-5 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-slate-200 hover:border-primary/50",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900">{zone.name}</h3>
                {isSelected && <Badge className="bg-primary text-white">Selected</Badge>}
              </div>
              <p className="text-sm text-slate-600 mb-3">{zone.description}</p>
              <div className="space-y-2">
                <div className="text-xs font-medium text-primary">{zone.count}</div>
                <div className="text-xs text-slate-500 leading-relaxed">
                  Key spots: {zone.destinations}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {selectedZones.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">
              {selectedZones.length} zone{selectedZones.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <p className="text-xs text-green-700">
            AI will choose from {selectedZones.reduce((total, zoneId) => {
              const zone = zones.find(z => z.id === zoneId)
              return total + (zone ? parseInt(zone.count.split('+')[0]) : 0)
            }, 0)}+ destinations across your selected zones to create the perfect itinerary.
          </p>
        </div>
      )}
    </div>
  )
}
