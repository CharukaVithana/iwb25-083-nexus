"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BudgetBar } from "@/components/budget-bar"
import { DayCard, type DayItem } from "@/components/day-card"
import { ModernChatPopup } from "@/components/modern-chat-popup"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/hooks/use-auth"
import { generateAITravelPlan, type AITravelPlanRequest } from "@/lib/api"
import type { BudgetData } from "@/components/budget-step"
import type { PreferencesData } from "@/components/preferences-step"
import { Save, Share, FileDown, Loader2 } from "lucide-react"

interface ItineraryPlannerProps {
  budgetData: BudgetData
  preferencesData: PreferencesData
}

// Sample itinerary data based on user preferences
const generateSampleItinerary = (budgetData: BudgetData, preferencesData: PreferencesData): DayItem[][] => {
  const dailyBudget = budgetData.budget / budgetData.tripLength
  const isCoastal = preferencesData.zones.includes("coastal")
  const isHillCountry = preferencesData.zones.includes("hill-country")
  const isCultural = preferencesData.zones.includes("cultural-triangle")
  const isNorthern = preferencesData.zones.includes("northern")
  const isSouthern = preferencesData.zones.includes("southern")
  const isEastern = preferencesData.zones.includes("eastern")

  const sampleData: DayItem[][] = []

  for (let day = 1; day <= budgetData.tripLength; day++) {
    const dayItems: DayItem[] = []

    // Add accommodation based on zones and preferences
    if (day === 1 || day === Math.ceil(budgetData.tripLength / 2) || day === budgetData.tripLength) {
      const hotelPrice = dailyBudget * 0.4 // 40% of daily budget for accommodation
      let hotelName = "Comfort Hotel"
      let location = "Colombo"

      // Filter hotel location based on selected zones
      if (isCoastal && (day <= 3 || day === budgetData.tripLength)) {
        hotelName = preferencesData.hotelView === "sea" ? "Ocean View Resort" : "Beach Hotel"
        location = day <= 2 ? "Galle" : day === budgetData.tripLength ? "Bentota" : "Mirissa"
      } else if (isHillCountry && (day > 3 || day === Math.ceil(budgetData.tripLength / 2))) {
        hotelName = preferencesData.hotelView === "hill" ? "Hill Country Lodge" : "Tea Plantation Hotel"
        location = day === Math.ceil(budgetData.tripLength / 2) ? "Kandy" : "Nuwara Eliya"
      } else if (isCultural && day > 1) {
        hotelName = "Heritage Hotel"
        location = day === 2 ? "Anuradhapura" : "Polonnaruwa"
      } else if (isNorthern && day > 2) {
        hotelName = "Northern Heritage Resort"
        location = "Jaffna"
      } else if (isSouthern && day <= 2) {
        hotelName = "Southern Beach Resort"
        location = "Matara"
      } else if (isEastern && day > 1) {
        hotelName = "Eastern Coastal Hotel"
        location = "Trincomalee"
      }

      dayItems.push({
        id: `stay-${day}`,
        type: "stay",
        name: hotelName,
        location,
        price: Math.round(hotelPrice),
        currency: budgetData.currency,
        description: `${preferencesData.hotelView} view accommodation in ${location}`,
      })
    }

    // Add activities based on zones - improved filtering
    if (isCoastal && (day <= 3 || day === budgetData.tripLength)) {
      const coastalActivities = [
        { name: "Galle Fort Tour", location: "Galle", desc: "Historic Dutch fort exploration" },
        { name: "Whale Watching", location: "Mirissa", desc: "Marine life observation" },
        { name: "Beach Relaxation", location: "Bentota", desc: "Relaxing beach time" },
        { name: "Surfing Lesson", location: "Hikkaduwa", desc: "Water sports activity" },
        { name: "Snorkeling", location: "Unawatuna", desc: "Underwater exploration" }
      ]
      const activityIndex = (day - 1) % coastalActivities.length
      const activity = coastalActivities[activityIndex]

      dayItems.push({
        id: `activity-${day}-1`,
        type: "activity",
        name: activity.name,
        location: activity.location,
        duration: "3-4 hours",
        price: Math.round(dailyBudget * 0.3),
        currency: budgetData.currency,
        description: activity.desc,
      })
    } else if (isHillCountry && (day > 3 || day === Math.ceil(budgetData.tripLength / 2))) {
      const hillActivities = [
        { name: "Tea Factory Visit", location: "Kandy", desc: "Learn about tea production" },
        { name: "Temple of the Tooth", location: "Kandy", desc: "Sacred Buddhist temple" },
        { name: "Botanical Gardens", location: "Peradeniya", desc: "Tropical plant collection" },
        { name: "Hiking in Knuckles", location: "Matale", desc: "Mountain trekking" },
        { name: "Waterfall Visit", location: "Nuwara Eliya", desc: "Scenic waterfall exploration" }
      ]
      const activityIndex = (day - 1) % hillActivities.length
      const activity = hillActivities[activityIndex]

      dayItems.push({
        id: `activity-${day}-1`,
        type: "activity",
        name: activity.name,
        location: activity.location,
        duration: "2-3 hours",
        price: Math.round(dailyBudget * 0.25),
        currency: budgetData.currency,
        description: activity.desc,
      })
    } else if (isCultural && day > 1) {
      const culturalActivities = [
        { name: "Ancient City Tour", location: "Anuradhapura", desc: "UNESCO World Heritage site" },
        { name: "Sigiriya Rock Fortress", location: "Sigiriya", desc: "Ancient palace ruins" },
        { name: "Polonnaruwa Ancient City", location: "Polonnaruwa", desc: "Medieval capital ruins" },
        { name: "Dambulla Cave Temple", location: "Dambulla", desc: "Buddhist cave paintings" },
        { name: "Mihintale Monastery", location: "Mihintale", desc: "Ancient Buddhist monastery" }
      ]
      const activityIndex = (day - 1) % culturalActivities.length
      const activity = culturalActivities[activityIndex]

      dayItems.push({
        id: `activity-${day}-1`,
        type: "activity",
        name: activity.name,
        location: activity.location,
        duration: "Full day",
        price: Math.round(dailyBudget * 0.35),
        currency: budgetData.currency,
        description: activity.desc,
      })
    } else if (isNorthern && day > 2) {
      const northernActivities = [
        { name: "Jaffna Fort Tour", location: "Jaffna", desc: "Dutch colonial fort" },
        { name: "Nallur Temple Visit", location: "Jaffna", desc: "Hindu temple complex" },
        { name: "Point Pedro Lighthouse", location: "Point Pedro", desc: "Scenic coastal views" },
        { name: "Delft Island Tour", location: "Delft", desc: "Wildlife sanctuary" },
        { name: "Nagadeepa Temple", location: "Nagadeepa", desc: "Ancient Buddhist temple" }
      ]
      const activityIndex = (day - 1) % northernActivities.length
      const activity = northernActivities[activityIndex]

      dayItems.push({
        id: `activity-${day}-1`,
        type: "activity",
        name: activity.name,
        location: activity.location,
        duration: "Half day",
        price: Math.round(dailyBudget * 0.3),
        currency: budgetData.currency,
        description: activity.desc,
      })
    } else if (isSouthern && day <= 2) {
      const southernActivities = [
        { name: "Yala Safari", location: "Yala", desc: "Wildlife safari experience" },
        { name: "Tangalle Beach", location: "Tangalle", desc: "Secluded beach exploration" },
        { name: "Mulkirigala Rock", location: "Mulkirigala", desc: "Ancient monastery ruins" },
        { name: "Whale Watching", location: "Mirissa", desc: "Marine mammal observation" },
        { name: "Stilt Fishing", location: "Koggala", desc: "Traditional fishing method" }
      ]
      const activityIndex = (day - 1) % southernActivities.length
      const activity = southernActivities[activityIndex]

      dayItems.push({
        id: `activity-${day}-1`,
        type: "activity",
        name: activity.name,
        location: activity.location,
        duration: "4-5 hours",
        price: Math.round(dailyBudget * 0.35),
        currency: budgetData.currency,
        description: activity.desc,
      })
    } else if (isEastern && day > 1) {
      const easternActivities = [
        { name: "Trincomalee Harbour", location: "Trincomalee", desc: "Natural deep-water harbour" },
        { name: "Pigeon Island", location: "Nilaveli", desc: "Marine national park" },
        { name: "Koneswaram Temple", location: "Trincomalee", desc: "Ancient Hindu temple" },
        { name: "Batticaloa Lagoon", location: "Batticaloa", desc: "Beautiful lagoon views" },
        { name: "Pasikuda Beach", location: "Pasikuda", desc: "Golden sand beach" }
      ]
      const activityIndex = (day - 1) % easternActivities.length
      const activity = easternActivities[activityIndex]

      dayItems.push({
        id: `activity-${day}-1`,
        type: "activity",
        name: activity.name,
        location: activity.location,
        duration: "3-4 hours",
        price: Math.round(dailyBudget * 0.3),
        currency: budgetData.currency,
        description: activity.desc,
      })
    } else {
      // Default activities for mixed zones or when no specific zone matches
      const defaultActivities = [
        { name: "Colombo City Tour", location: "Colombo", desc: "Urban exploration" },
        { name: "Local Market Visit", location: "Local Area", desc: "Cultural immersion" },
        { name: "Scenic Drive", location: "Highway", desc: "Landscape photography" },
        { name: "Local Cuisine Experience", location: "Restaurant", desc: "Food tasting" },
        { name: "Nature Walk", location: "Nearby Park", desc: "Light outdoor activity" }
      ]
      const activityIndex = (day - 1) % defaultActivities.length
      const activity = defaultActivities[activityIndex]

      dayItems.push({
        id: `activity-${day}-1`,
        type: "activity",
        name: activity.name,
        location: activity.location,
        duration: "2-3 hours",
        price: Math.round(dailyBudget * 0.25),
        currency: budgetData.currency,
        description: activity.desc,
      })
    }

    // Add transport based on preferences and zones
    if (day > 1) {
      let transportName = "Local Transport"
      let transportPrice = dailyBudget * 0.1
      let transportDesc = "Local transportation"

      if (preferencesData.transport === "train") {
        transportName = "Scenic Train Journey"
        transportPrice = dailyBudget * 0.15
        transportDesc = "Enjoy scenic railway views"
      } else if (preferencesData.transport === "car-driver") {
        transportName = "Private Car with Driver"
        transportPrice = dailyBudget * 0.25
        transportDesc = "Comfortable and convenient travel"
      } else if (preferencesData.transport === "self-drive") {
        transportName = "Self-Drive Rental Car"
        transportPrice = dailyBudget * 0.2
        transportDesc = "Freedom to explore at your own pace"
      } else {
        // Local transport varies by zone
        if (isCoastal) {
          transportName = "Coastal Road Transfer"
          transportDesc = "Scenic coastal route"
        } else if (isHillCountry) {
          transportName = "Mountain Road Journey"
          transportDesc = "Winding mountain roads"
        } else if (isCultural) {
          transportName = "Heritage Route Transfer"
          transportDesc = "Through ancient landscapes"
        } else {
          transportName = "Local Bus/Transfer"
          transportDesc = "Reliable local transportation"
        }
      }

      dayItems.push({
        id: `transport-${day}`,
        type: "transport",
        name: transportName,
        duration: "2-3 hours",
        price: Math.round(transportPrice),
        currency: budgetData.currency,
        description: transportDesc,
      })
    }

    sampleData.push(dayItems)
  }

  return sampleData
}

export function ItineraryPlanner({ budgetData, preferencesData }: ItineraryPlannerProps) {
  const [itinerary, setItinerary] = useState<DayItem[][]>([])
  const [isGenerating, setIsGenerating] = useState(true)
  const [aiPlan, setAiPlan] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, savePlan } = useAuth()

  // Generate AI travel plan on component mount
  useEffect(() => {
    generateItinerary()
  }, [budgetData, preferencesData])

  // Comprehensive JSON cleaner and fixer
  const cleanAndFixJSON = (jsonStr: string): string => {
    try {
      // Remove markdown code blocks and other formatting
      let cleaned = jsonStr
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .replace(/^\s*\*\*.*?\*\*\s*/gm, '') // Remove markdown headers
        .trim()

      // Fix common JSON issues
      cleaned = cleaned
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Fix unquoted keys
        .replace(/:\s*'([^']*)'/g, ': "$1"') // Convert single quotes to double quotes
        .replace(/\\'/g, "'") // Fix escaped single quotes
        .replace(/\n/g, ' ') // Replace newlines with spaces
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/,\s*}/g, '}') // Remove trailing commas before closing braces
        .replace(/,\s*]/g, ']') // Remove trailing commas before closing brackets

      return cleaned
    } catch (error) {
      console.error('Error cleaning JSON:', error)
      return jsonStr
    }
  }

  // Smart JSON parser that tries multiple strategies
  const safeJSONParse = (jsonStr: string): any => {
    const strategies = [
      // Strategy 1: Direct parse
      () => JSON.parse(jsonStr),
      
      // Strategy 2: Clean and parse
      () => JSON.parse(cleanAndFixJSON(jsonStr)),
      
      // Strategy 3: Extract array content
      () => {
        const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          return JSON.parse(cleanAndFixJSON(arrayMatch[0]));
        }
        throw new Error('No array found');
      },
      
      // Strategy 4: Extract object content
      () => {
        const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          return JSON.parse(cleanAndFixJSON(objectMatch[0]));
        }
        throw new Error('No object found');
      },
      
      // Strategy 5: Manual parsing for simple structures
      () => {
        const manualParse = (str: string) => {
          // Try to manually extract day objects
          const dayMatches = str.match(/\{\s*"day":\s*\d+[\s\S]*?\}/g);
          if (dayMatches) {
            return dayMatches.map(dayStr => {
              const cleanDay = cleanAndFixJSON(dayStr);
              return JSON.parse(cleanDay);
            });
          }
          throw new Error('Manual parsing failed');
        };
        return manualParse(jsonStr);
      }
    ];

    for (let i = 0; i < strategies.length; i++) {
      try {
        console.log(`Trying JSON parsing strategy ${i + 1}`);
        const result = strategies[i]();
        console.log(`Strategy ${i + 1} succeeded:`, result);
        return result;
      } catch (error) {
        console.log(`Strategy ${i + 1} failed:`, error instanceof Error ? error.message : 'Unknown error');
        continue;
      }
    }

    throw new Error('All JSON parsing strategies failed');
  }

  // Enhanced AI response parser with multiple fallbacks
  const parseAIResponse = (aiText: string): DayItem[][] => {
    console.log("=== PARSING AI RESPONSE ===");
    console.log("Raw AI Response:", aiText);
    
    try {
      // Extract different sections from the response
      const extractSection = (text: string, startMarker: string, endMarker?: string): string => {
        const startIndex = text.indexOf(startMarker);
        if (startIndex === -1) return '';
        
        const contentStart = startIndex + startMarker.length;
        const endIndex = endMarker ? text.indexOf(endMarker, contentStart) : text.length;
        
        return text.substring(contentStart, endIndex === -1 ? text.length : endIndex).trim();
      };

      // Try to extract the daily_itinerary section
      let dailySection = extractSection(aiText, '**daily_itinerary**', '**budget_breakdown**');
      if (!dailySection) {
        dailySection = extractSection(aiText, 'daily_itinerary', 'budget_breakdown');
      }
      if (!dailySection) {
        dailySection = aiText; // Use full text as fallback
      }

      console.log("Extracted daily section:", dailySection);

      // Try parsing the extracted section
      const parsedData = safeJSONParse(dailySection);
      console.log("Successfully parsed data:", parsedData);

      // Convert parsed data to itinerary format
      return convertToItinerary(parsedData);

    } catch (error) {
      console.error("All parsing strategies failed:", error);
      
      // Final fallback: text-based parsing
      return parseAsText(aiText);
    }
  }

  // Convert parsed JSON data to DayItem format
  const convertToItinerary = (data: any): DayItem[][] => {
    console.log("Converting data to itinerary:", data);
    
    const itineraryDays: DayItem[][] = [];

    try {
      // Handle the actual API response format: {day1: {morning: {...}, afternoon: {...}, evening: {...}}, day2: {...}}
      if (data.day1 || data.day2 || data.day3) {
        console.log("Processing day1/day2/day3 format");
        
        for (let dayIndex = 0; dayIndex < budgetData.tripLength; dayIndex++) {
          const dayKey = `day${dayIndex + 1}`;
          const dayData = data[dayKey];
          const dayItems: DayItem[] = [];

          if (dayData) {
            // Process morning, afternoon, evening activities
            ['morning', 'afternoon', 'evening'].forEach((timeOfDay) => {
              const timeData = dayData[timeOfDay];
              if (timeData && timeData.activity && timeData.location) {
                const activityType = determineActivityType(timeData.activity, timeData.location);
                
                dayItems.push({
                  id: `ai-${dayIndex + 1}-${timeOfDay}`,
                  type: activityType,
                  name: timeData.activity,
                  location: timeData.location,
                  duration: timeData.time || timeOfDay,
                  price: Math.round(timeData.cost || 0),
                  currency: budgetData.currency,
                  description: `${timeData.time || timeOfDay}: ${timeData.activity} at ${timeData.location}`,
                });
              }
            });
          }

          // Add default activity if no activities found
          if (dayItems.length === 0) {
            dayItems.push({
              id: `ai-default-${dayIndex + 1}`,
              type: "activity",
              name: `Day ${dayIndex + 1} - Free Day`,
              location: "Sri Lanka",
              duration: "Full day",
              price: 0,
              currency: budgetData.currency,
              description: "Free day for exploration",
            });
          }

          itineraryDays.push(dayItems);
        }
      }
      // Handle array format like in your original message
      else if (Array.isArray(data)) {
        console.log("Processing array format");
        
        for (let dayIndex = 0; dayIndex < budgetData.tripLength; dayIndex++) {
          const dayData = data[dayIndex] || data[data.length - 1]; // Use last entry for extra days
          const dayItems: DayItem[] = [];

          if (dayData) {
            // Handle different object structures
            if (dayData.morning || dayData.afternoon || dayData.evening) {
              // Time-based structure
              ['morning', 'afternoon', 'evening'].forEach((timeOfDay, index) => {
                const timeData = dayData[timeOfDay];
                if (timeData) {
                  dayItems.push({
                    id: `ai-${dayIndex + 1}-${timeOfDay}`,
                    type: determineActivityType(timeData.activity || timeData.name || '', timeData.location || ''),
                    name: timeData.activity || timeData.name || `${timeOfDay} Activity`,
                    location: timeData.location || 'Sri Lanka',
                    duration: timeData.time || timeOfDay,
                    price: Math.round(timeData.cost || timeData.price || 0),
                    currency: budgetData.currency,
                    description: `${timeOfDay}: ${timeData.activity || timeData.name} at ${timeData.location}`,
                  });
                }
              });
            } else if (dayData.activities && Array.isArray(dayData.activities)) {
              // Activities array structure
              dayData.activities.forEach((activity: any, index: number) => {
                dayItems.push({
                  id: `ai-${dayIndex + 1}-${index}`,
                  type: determineActivityType(activity.name || activity.activity || '', activity.location || ''),
                  name: activity.name || activity.activity || `Activity ${index + 1}`,
                  location: activity.location || 'Sri Lanka',
                  duration: activity.duration || activity.time || '2 hours',
                  price: Math.round(activity.price || activity.cost || 0),
                  currency: budgetData.currency,
                  description: activity.description || `${activity.name} at ${activity.location}`,
                });
              });
            } else {
              // Single activity structure
              dayItems.push({
                id: `ai-${dayIndex + 1}-0`,
                type: determineActivityType(dayData.activity || dayData.name || '', dayData.location || ''),
                name: dayData.activity || dayData.name || `Day ${dayIndex + 1} Activity`,
                location: dayData.location || 'Sri Lanka',
                duration: dayData.time || dayData.duration || 'Full day',
                price: Math.round(dayData.cost || dayData.price || 0),
                currency: budgetData.currency,
                description: dayData.description || `${dayData.activity || dayData.name} at ${dayData.location}`,
              });
            }
          }

          // Add default activity if no activities found
          if (dayItems.length === 0) {
            dayItems.push({
              id: `ai-default-${dayIndex + 1}`,
              type: "activity",
              name: `Day ${dayIndex + 1} - Explore`,
              location: "Sri Lanka",
              duration: "Full day",
              price: 0,
              currency: budgetData.currency,
              description: "Free day for exploration",
            });
          }

          itineraryDays.push(dayItems);
        }
      }

      // Fill remaining days if needed
      while (itineraryDays.length < budgetData.tripLength) {
        const dayNum = itineraryDays.length + 1;
        itineraryDays.push([{
          id: `ai-extra-${dayNum}`,
          type: "activity",
          name: `Day ${dayNum} - Free Day`,
          location: "Sri Lanka",
          duration: "Full day",
          price: 0,
          currency: budgetData.currency,
          description: "Additional exploration day",
        }]);
      }

      console.log("Converted itinerary:", itineraryDays);
      return itineraryDays;

    } catch (error) {
      console.error("Error converting to itinerary:", error);
      return [];
    }
  }

  // Text-based parsing as final fallback
  const parseAsText = (text: string): DayItem[][] => {
    console.log("Using text-based parsing");
    
    const itineraryDays: DayItem[][] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentDay: DayItem[] = [];
    let currentDayNum = 1;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Look for day indicators
      if (trimmedLine.match(/day\s*\d+/i) || trimmedLine.match(/\d+\./)) {
        if (currentDay.length > 0) {
          itineraryDays.push(currentDay);
          currentDay = [];
          currentDayNum++;
        }
      }
      
      // Look for activities (lines with locations or times)
      if (trimmedLine.match(/\d{1,2}:\d{2}/) || 
          trimmedLine.toLowerCase().includes('sigiriya') ||
          trimmedLine.toLowerCase().includes('galle') ||
          trimmedLine.toLowerCase().includes('colombo') ||
          trimmedLine.toLowerCase().includes('resort') ||
          trimmedLine.toLowerCase().includes('restaurant')) {
        
        currentDay.push({
          id: `text-${currentDayNum}-${currentDay.length}`,
          type: "activity",
          name: trimmedLine.substring(0, 50) + (trimmedLine.length > 50 ? '...' : ''),
          location: "Sri Lanka",
          duration: "2 hours",
          price: 25,
          currency: budgetData.currency,
          description: trimmedLine,
        });
      }
    });
    
    // Add the last day
    if (currentDay.length > 0) {
      itineraryDays.push(currentDay);
    }
    
    // Fill up to required number of days
    while (itineraryDays.length < budgetData.tripLength) {
      const dayNum = itineraryDays.length + 1;
      itineraryDays.push([{
        id: `text-default-${dayNum}`,
        type: "activity", 
        name: `Day ${dayNum} - Explore`,
        location: "Sri Lanka",
        duration: "Full day",
        price: 0,
        currency: budgetData.currency,
        description: "Free exploration day",
      }]);
    }
    
    return itineraryDays;
  }

  // Parse the new daily_itinerary format from the console output
  const parseDailyItineraryFormat = (jsonStr: string): DayItem[][] => {
    try {
      // Clean up the JSON string - remove trailing commas and fix formatting
      let cleanJson = jsonStr
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/\n/g, ' ')          // Replace newlines with spaces
        .replace(/\s+/g, ' ')         // Normalize whitespace
      
      const data = JSON.parse(cleanJson)
      const itineraryDays: DayItem[][] = []
      
      if (data.daily_itinerary && Array.isArray(data.daily_itinerary)) {
        for (let dayIndex = 0; dayIndex < budgetData.tripLength; dayIndex++) {
          const dayData = data.daily_itinerary[dayIndex]
          const dayItems: DayItem[] = []
          
          if (dayData && dayData.timing && Array.isArray(dayData.timing)) {
            dayData.timing.forEach((timingItem: any[], index: number) => {
              if (Array.isArray(timingItem) && timingItem.length >= 3) {
                const [time, location, activity] = timingItem
                const activityType = determineActivityType(activity, location)
                
                // Calculate cost based on activity type and budget
                let cost = 0
                if (data.budget_breakdown) {
                  if (activityType === "stay") {
                    cost = Math.round((data.budget_breakdown.accommodation || 0) / budgetData.tripLength)
                  } else if (location.toLowerCase().includes("restaurant") || 
                           activity.toLowerCase().includes("dinner") || 
                           activity.toLowerCase().includes("lunch") ||
                           activity.toLowerCase().includes("breakfast")) {
                    cost = Math.round((data.budget_breakdown.food || 60) / 6) // Assume 2-3 meals per day
                  } else {
                    cost = Math.round((data.budget_breakdown.activities || 50) / 4) // Distribute activities
                  }
                }
                
                dayItems.push({
                  id: `ai-day${dayIndex + 1}-${index}`,
                  type: activityType,
                  name: activity,
                  location: location,
                  duration: time,
                  price: cost,
                  currency: budgetData.currency,
                  description: `${time}: ${activity} at ${location}`,
                })
              }
            })
          }
          
          // If no activities found for this day, add a placeholder
          if (dayItems.length === 0) {
            dayItems.push({
              id: `ai-default-${dayIndex + 1}`,
              type: "activity",
              name: `Day ${dayIndex + 1} - Free Day`,
              location: "Sri Lanka",
              duration: "Full day",
              price: 0,
              currency: budgetData.currency,
              description: "Free day for personal exploration",
            })
          }
          
          itineraryDays.push(dayItems)
        }
      }
      
      // Fill remaining days if needed
      while (itineraryDays.length < budgetData.tripLength) {
        const dayNum = itineraryDays.length + 1
        itineraryDays.push([{
          id: `ai-extra-${dayNum}`,
          type: "activity",
          name: `Day ${dayNum} - Explore`,
          location: "Sri Lanka",
          duration: "Full day",
          price: 0,
          currency: budgetData.currency,
          description: "Additional exploration day",
        }])
      }
      
      return itineraryDays
    } catch (error) {
      console.error("Error parsing daily_itinerary format:", error)
      return []
    }
  }

  // Parse the newest array format with day objects
  const parseNewArrayFormat = (jsonStr: string): DayItem[][] => {
    try {
      const dailyData = JSON.parse(jsonStr)
      const itineraryDays: DayItem[][] = []
      
      if (Array.isArray(dailyData)) {
        for (let dayIndex = 0; dayIndex < budgetData.tripLength; dayIndex++) {
          const dayData = dailyData[dayIndex] || dailyData[dailyData.length - 1] // Use last entry for remaining days
          const dayItems: DayItem[] = []

          if (dayData) {
            // Parse morning activities
            if (dayData.morning) {
              dayItems.push({
                id: `ai-${dayIndex + 1}-morning`,
                type: determineActivityType(dayData.morning.activity || "", dayData.morning.location || ""),
                name: dayData.morning.activity || "Morning Activity",
                location: dayData.morning.location || "Sri Lanka",
                duration: dayData.morning.time || "Morning",
                price: Math.round(dayData.morning.cost || 0),
                currency: budgetData.currency,
                description: `Morning: ${dayData.morning.activity} at ${dayData.morning.location}`,
              })
            }

            // Parse afternoon activities
            if (dayData.afternoon) {
              dayItems.push({
                id: `ai-${dayIndex + 1}-afternoon`,
                type: determineActivityType(dayData.afternoon.activity || "", dayData.afternoon.location || ""),
                name: dayData.afternoon.activity || "Afternoon Activity",
                location: dayData.afternoon.location || "Sri Lanka",
                duration: dayData.afternoon.time || "Afternoon",
                price: Math.round(dayData.afternoon.cost || 0),
                currency: budgetData.currency,
                description: `Afternoon: ${dayData.afternoon.activity} at ${dayData.afternoon.location}`,
              })
            }

            // Parse evening activities
            if (dayData.evening) {
              dayItems.push({
                id: `ai-${dayIndex + 1}-evening`,
                type: determineActivityType(dayData.evening.activity || "", dayData.evening.location || ""),
                name: dayData.evening.activity || "Evening Activity",
                location: dayData.evening.location || "Sri Lanka",
                duration: dayData.evening.time || "Evening",
                price: Math.round(dayData.evening.cost || 0),
                currency: budgetData.currency,
                description: `Evening: ${dayData.evening.activity} at ${dayData.evening.location}`,
              })
            }
          }

          // If no activities found, add default
          if (dayItems.length === 0) {
            dayItems.push({
              id: `ai-default-${dayIndex + 1}`,
              type: "activity",
              name: `Day ${dayIndex + 1} - Free Day`,
              location: "Sri Lanka",
              duration: "Full day",
              price: 0,
              currency: budgetData.currency,
              description: "Free day for personal exploration",
            })
          }

          itineraryDays.push(dayItems)
        }
      }

      return itineraryDays
    } catch (error) {
      console.error("Error parsing new array format:", error)
      return []
    }
  }

  // Parse JSON array format: [{"date": "Day 1", "time": "9:00 AM", ...}, ...]
  const parseJSONArrayFormat = (jsonStr: string): DayItem[][] => {
    try {
      const activities = JSON.parse(jsonStr)
      const dailyBudget = budgetData.budget / budgetData.tripLength
      
      // Group activities by day
      const dayGroups: { [key: string]: any[] } = {}
      activities.forEach((activity: any) => {
        const day = activity.date || "Day 1"
        if (!dayGroups[day]) {
          dayGroups[day] = []
        }
        dayGroups[day].push(activity)
      })

      // Convert to DayItem[][] format
      const itineraryDays: DayItem[][] = []
      
      for (let day = 1; day <= budgetData.tripLength; day++) {
        const dayKey = `Day ${day}`
        const dayActivities = dayGroups[dayKey] || []
        const dayItems: DayItem[] = []

        dayActivities.forEach((activity, index) => {
          const activityType = determineActivityType(activity.activity, activity.location)
          
          dayItems.push({
            id: `ai-${day}-${index}`,
            type: activityType,
            name: activity.activity,
            location: activity.location,
            duration: activity.time || "Flexible",
            price: Math.round(activity.cost || 0),
            currency: budgetData.currency,
            description: `${activity.activity} at ${activity.location}`,
          })
        })

        if (dayItems.length === 0) {
          dayItems.push({
            id: `ai-default-${day}`,
            type: "activity",
            name: `Day ${day} - Explore`,
            location: "Sri Lanka",
            duration: "Full day",
            price: Math.round(dailyBudget * 0.3),
            currency: budgetData.currency,
            description: "Flexible day for exploration",
          })
        }

        itineraryDays.push(dayItems)
      }

      return itineraryDays
    } catch (error) {
      console.error("Error parsing JSON array format:", error)
      return []
    }
  }

  // Parse daily object format: {"day1": {"morning": {"attraction": ..., "time": ..., "cost": ...}, ...}, ...}
  const parseDailyObjectFormat = (jsonStr: string): DayItem[][] => {
    try {
      const dailyData = JSON.parse(jsonStr)
      const itineraryDays: DayItem[][] = []
      
      for (let day = 1; day <= budgetData.tripLength; day++) {
        const dayKey = `day${day}`
        const dayData = dailyData[dayKey]
        const dayItems: DayItem[] = []

        if (dayData) {
          // Parse morning activities
          if (dayData.morning && dayData.morning.attraction) {
            dayItems.push({
              id: `ai-${day}-morning`,
              type: determineActivityType(dayData.morning.attraction, ""),
              name: dayData.morning.attraction,
              location: extractLocationFromText(dayData.morning.attraction),
              duration: dayData.morning.time || "Morning",
              price: Math.round(dayData.morning.cost || 0),
              currency: budgetData.currency,
              description: `Morning: ${dayData.morning.attraction}`,
            })
          }

          // Parse afternoon activities
          if (dayData.afternoon && dayData.afternoon.attraction) {
            dayItems.push({
              id: `ai-${day}-afternoon`,
              type: determineActivityType(dayData.afternoon.attraction, ""),
              name: dayData.afternoon.attraction,
              location: extractLocationFromText(dayData.afternoon.attraction),
              duration: dayData.afternoon.time || "Afternoon",
              price: Math.round(dayData.afternoon.cost || 0),
              currency: budgetData.currency,
              description: `Afternoon: ${dayData.afternoon.attraction}`,
            })
          }

          // Parse evening activities
          if (dayData.evening && dayData.evening.attraction) {
            dayItems.push({
              id: `ai-${day}-evening`,
              type: determineActivityType(dayData.evening.attraction, ""),
              name: dayData.evening.attraction,
              location: extractLocationFromText(dayData.evening.attraction),
              duration: dayData.evening.time || "Evening",
              price: Math.round(dayData.evening.cost || 0),
              currency: budgetData.currency,
              description: `Evening: ${dayData.evening.attraction}`,
            })
          }

          // Parse hotel/accommodation
          if (dayData.hotel) {
            dayItems.push({
              id: `ai-${day}-hotel`,
              type: "stay",
              name: dayData.hotel.name || "Recommended Hotel",
              location: dayData.hotel.location || "Sri Lanka",
              price: Math.round(dayData.hotel.cost || 0),
              currency: budgetData.currency,
              description: dayData.hotel.description || "Accommodation",
            })
          }
        }

        // If no activities found, add default
        if (dayItems.length === 0) {
          dayItems.push({
            id: `ai-default-${day}`,
            type: "activity",
            name: `Day ${day} - Free Day`,
            location: "Sri Lanka",
            duration: "Full day",
            price: 0,
            currency: budgetData.currency,
            description: "Free day for personal exploration",
          })
        }

        itineraryDays.push(dayItems)
      }

      return itineraryDays
    } catch (error) {
      console.error("Error parsing daily object format:", error)
      return []
    }
  }

  // Parse text format when no JSON is found
  const parseTextFormat = (aiText: string): DayItem[][] => {
    const dailyBudget = budgetData.budget / budgetData.tripLength
    const itineraryDays: DayItem[][] = []

    // Extract any quoted attractions or locations
    const attractions: string[] = []
    const quotedMatches = aiText.match(/"([^"]+)"/g)
    if (quotedMatches) {
      quotedMatches.forEach(match => {
        const item = match.replace(/"/g, '')
        if (item.length > 3) {
          attractions.push(item)
        }
      })
    }

    for (let day = 1; day <= budgetData.tripLength; day++) {
      const dayItems: DayItem[] = []
      
      if (attractions.length > 0) {
        const attractionIndex = (day - 1) % attractions.length
        dayItems.push({
          id: `ai-text-${day}`,
          type: "activity",
          name: attractions[attractionIndex],
          location: extractLocationFromText(attractions[attractionIndex]),
          duration: "Half day",
          price: Math.round(dailyBudget * 0.3),
          currency: budgetData.currency,
          description: `Recommended: ${attractions[attractionIndex]}`,
        })
      } else {
        dayItems.push({
          id: `ai-fallback-${day}`,
          type: "activity",
          name: `Day ${day} Experience`,
          location: "Sri Lanka",
          duration: "Full day",
          price: Math.round(dailyBudget * 0.3),
          currency: budgetData.currency,
          description: "AI-curated experience",
        })
      }

      itineraryDays.push(dayItems)
    }

    return itineraryDays
  }

  // Extract location from text - Enhanced with all 317 destinations
  const extractLocationFromText = (text: string): string => {
    const locations = [
      // Major cities and towns
      'Colombo', 'Kandy', 'Galle', 'Anuradhapura', 'Polonnaruwa', 'Sigiriya', 
      'Dambulla', 'Nuwara Eliya', 'Ella', 'Bentota', 'Mirissa', 'Unawatuna',
      'Negombo', 'Trincomalee', 'Arugam Bay', 'Hikkaduwa', 'Matara', 'Ratnapura',
      'Jaffna', 'Mannar', 'Vavuniya', 'Batticaloa', 'Badulla', 'Hatton', 'Chilaw',
      'Kalpitiya', 'Kurunegala', 'Puttalam', 'Gampaha', 'Kalutara', 'Hambantota',
      
      // Hill country locations
      'Haputale', 'Bandarawela', 'Diyatalawa', 'Ohiya', 'Nanu Oya', 'Talawakele',
      'Ginigathhena', 'Belihuloya', 'Ramboda', 'Gampola', 'Peradeniya', 'Matale',
      
      // Coastal areas - comprehensive coverage
      'Koggala', 'Ahangama', 'Tangalle', 'Weligama', 'Dickwella', 'Pasikuda',
      'Kalkudah', 'Nilaveli', 'Bundala', 'Ambalangoda', 'Beruwala', 'Hiriketiya',
      'Wadduwa', 'Ahungalla', 'Kosgoda', 'Aluthgama', 'Habaraduwa', 'Thalpe',
      'Talalla', 'Rekawa', 'Kirinda', 'Tissamaharama', 'Mulkirigala',
      
      // Northern region
      'Kilinochchi', 'Mullaitivu', 'Point Pedro', 'Delft Island', 'Nagadeepa',
      'Nainativu', 'Karainagar', 'Kayts', 'Punkudutivu', 'Analativu',
      
      // Eastern coast extensions
      'Kallady', 'Kattankudy', 'Chenkalady', 'Vakaneri', 'Kokkilai', 'Nilaweli',
      'Kuchchaveli', 'Somawathiya', 'Seruwila', 'Muttur', 'Kantalai',
      
      // Adventure and nature spots
      'Kitulgala', 'Sinharaja', 'Horton Plains', 'Adams Peak', 'Knuckles Range',
      'Riverston', 'Wilpattu', 'Yala', 'Udawalawe', 'Minneriya', 'Kaudulla',
      'Wasgamuwa', 'Somawathiya', 'Flood Plains', 'Maduru Oya', 'Galoya',
      
      // Central highlands extended
      'Welimada', 'Passara', 'Lunugala', 'Mahiyanganaya', 'Bibila', 'Monaragala',
      'Wellawaya', 'Buttala', 'Kataragama', 'Embilipitiya', 'Suriyawewa',
      
      // Western Province extensions
      'Mount Lavinia', 'Dehiwala', 'Moratuwa', 'Panadura', 'Kalutara', 'Beruwala',
      'Aluthgama', 'Bentota', 'Induruwa', 'Kosgoda', 'Balapitiya', 'Ambalangoda',
      
      // Cultural and archaeological sites
      'Mihintale', 'Ritigala', 'Medirigiriya', 'Nalanda Gedige', 'Yapahuwa',
      'Dambadeniya', 'Kurunegala', 'Panduwasnuwara', 'Avukana', 'Sasseru',
      
      // Remote and newly accessible areas
      'Mullaitivu', 'Mankulam', 'Cheddikulam', 'Oddusuddan', 'Nedunkeni',
      'Welioya', 'Maradankadawala', 'Kekirawa', 'Galenbindunuwewa', 'Thirappane',
      
      // Island destinations
      'Delft', 'Neduntivu', 'Karaitivu', 'Mandativu', 'Kayts', 'Punkudutivu',
      'Eluvaitivu', 'Nainativu', 'Nagadeepa', 'Analativu',
      
      // Emerging destinations
      'Mannar Island', 'Wilpattu Buffer Zone', 'Puttalam Lagoon', 'Kalpitiya Peninsula',
      'Dutch Bay', 'Portugal Bay', 'Bar Reef', 'Dolphin Point', 'Whale Point'
    ]
    
    for (const location of locations) {
      if (text.toLowerCase().includes(location.toLowerCase())) {
        return location
      }
    }
    
    return "Sri Lanka"
  }

  // Helper function to determine activity type based on content - improved filtering
  const determineActivityType = (activity: string, location: string): DayItem["type"] => {
    const activityLower = activity.toLowerCase()
    const locationLower = location.toLowerCase()

    // Stay/accommodation indicators - expanded list
    const stayKeywords = [
      "check-in", "hotel", "resort", "accommodation", "stay", "lodge", "boutique",
      "guesthouse", "villa", "apartment", "homestay", "bungalow", "cottage",
      "inn", "hostel", "motel", "suite", "room", "overnight", "camping"
    ]

    // Transport indicators - expanded list
    const transportKeywords = [
      "travel", "transport", "drive", "flight", "bus", "train", "taxi", "transfer",
      "journey", "ride", "ferry", "boat", "ship", "airport", "station", "terminal",
      "pickup", "drop-off", "commute", "route", "highway", "road", "railway"
    ]

    // Activity indicators - expanded list
    const activityKeywords = [
      "tour", "visit", "explore", "sightseeing", "hiking", "trekking", "walking",
      "surfing", "diving", "snorkeling", "fishing", "safari", "wildlife", "birdwatching",
      "photography", "shopping", "market", "museum", "temple", "church", "mosque",
      "fort", "palace", "garden", "park", "beach", "swimming", "spa", "massage",
      "cooking", "workshop", "class", "lesson", "adventure", "sports", "game",
      "festival", "ceremony", "ritual", "meditation", "yoga", "excursion", "outing"
    ]

    // Check for stay keywords first (most specific)
    for (const keyword of stayKeywords) {
      if (activityLower.includes(keyword) || locationLower.includes(keyword)) {
        return "stay"
      }
    }

    // Check for transport keywords
    for (const keyword of transportKeywords) {
      if (activityLower.includes(keyword) || locationLower.includes(keyword)) {
        return "transport"
      }
    }

    // Check for activity keywords
    for (const keyword of activityKeywords) {
      if (activityLower.includes(keyword) || locationLower.includes(keyword)) {
        return "activity"
      }
    }

    // Location-based determination
    if (locationLower.includes("hotel") || locationLower.includes("resort") ||
        locationLower.includes("lodge") || locationLower.includes("guesthouse")) {
      return "stay"
    }

    if (locationLower.includes("airport") || locationLower.includes("station") ||
        locationLower.includes("terminal") || locationLower.includes("bus stand")) {
      return "transport"
    }

    // Default to activity if nothing matches
    return "activity"
  }

  // Convert backend itinerary format to frontend DayItem format
  const convertBackendItinerary = (backendItinerary: any[]): DayItem[][] => {
    const convertedDays: DayItem[][] = []
    
    for (let dayIndex = 0; dayIndex < budgetData.tripLength; dayIndex++) {
      const dayData = backendItinerary[dayIndex]
      const dayItems: DayItem[] = []
      
      if (dayData && dayData.activities && Array.isArray(dayData.activities)) {
        dayData.activities.forEach((activity: any, index: number) => {
          // Determine activity type from backend type or content
          let activityType: DayItem["type"] = "activity"
          
          if (activity.activityType === "accommodation" || 
              activity.title?.toLowerCase().includes("hotel") ||
              activity.title?.toLowerCase().includes("resort") ||
              activity.title?.toLowerCase().includes("accommodation")) {
            activityType = "stay"
          } else if (activity.activityType === "transport" ||
                     activity.title?.toLowerCase().includes("transport") ||
                     activity.title?.toLowerCase().includes("travel") ||
                     activity.title?.toLowerCase().includes("flight") ||
                     activity.title?.toLowerCase().includes("bus") ||
                     activity.title?.toLowerCase().includes("train")) {
            activityType = "transport"
          } else if (activity.activityType === "meal" ||
                     activity.title?.toLowerCase().includes("breakfast") ||
                     activity.title?.toLowerCase().includes("lunch") ||
                     activity.title?.toLowerCase().includes("dinner") ||
                     activity.title?.toLowerCase().includes("restaurant")) {
            activityType = "activity" // Treat meals as activities for now
          }
          
          dayItems.push({
            id: `backend-${dayIndex + 1}-${index}`,
            type: activityType,
            name: activity.title || activity.name || `Activity ${index + 1}`,
            location: dayData.destination || 'Sri Lanka',
            duration: activity.duration || activity.time || 'Flexible',
            price: Math.round(activity.cost || 0),
            currency: budgetData.currency,
            description: activity.note || activity.description || `${activity.title} in ${dayData.destination}`,
          })
        })
      }
      
      // Add default activity if no activities found
      if (dayItems.length === 0) {
        dayItems.push({
          id: `backend-default-${dayIndex + 1}`,
          type: "activity",
          name: `Day ${dayIndex + 1} - Explore`,
          location: dayData?.destination || "Sri Lanka",
          duration: "Full day",
          price: Math.round((budgetData.budget / budgetData.tripLength) * 0.3),
          currency: budgetData.currency,
          description: "Free day for exploration",
        })
      }
      
      convertedDays.push(dayItems)
    }
    
    return convertedDays
  }

  const generateItinerary = async () => {
    setIsGenerating(true)
    try {
      // Map preferences to actual destination IDs from expanded database (317 destinations)
      const destinationMap: Record<string, string[]> = {
        // COASTAL destinations (beaches, sea views, water activities) - Enhanced with new destinations
        "coastal": [
          "d2", "d4", "d6", "d8", "d16", "d17", "d28", "d29", "d30", "d35", "d36", "d37", "d38", 
          "d39", "d41", "d42", "d49", "d52", "d53", "d54", "d55", "d72", "d74", "d75", "d76", 
          "d96", "d97", "d98", "d99", "d100", "d400", "d401", "d402", "d403", "d404", "d405", 
          "d406", "d407", "d408", "d409", "d410", "d411", "d412", "d413", "d414", "d415", "d416", 
          "d417", "d418", "d419", "d420", "d421", "d422", "d423", "d424", "d425", "d426", "d427", 
          "d428", "d429", "d430", "d431", "d432", "d433", "d434", "d435", "d436", "d437", "d438", 
          "d439", "d440", "d441", "d442", "d443", "d444", "d445", "d446", "d447", "d448", "d449"
        ], // All coastal areas including remote beaches, fishing villages, surf spots

        // HILL COUNTRY destinations (mountains, tea estates, cool climate) - Expanded coverage
        "hill-country": [
          "d1", "d3", "d5", "d7", "d19", "d23", "d24", "d26", "d27", "d33", "d47", "d65", "d66", 
          "d67", "d68", "d69", "d70", "d81", "d82", "d83", "d84", "d85", "d450", "d451", "d452", 
          "d453", "d454", "d455", "d456", "d457", "d458", "d459", "d460", "d461", "d462", "d463", 
          "d464", "d465", "d466", "d467", "d468", "d469", "d470", "d471", "d472", "d473", "d474", 
          "d475", "d476", "d477", "d478", "d479"
        ], // Tea estates, mountain peaks, cool climate retreats, waterfalls

        // CULTURAL TRIANGLE destinations (ancient cities, temples, heritage sites) - Enhanced heritage sites
        "cultural-triangle": [
          "d1", "d10", "d13", "d14", "d21", "d22", "d77", "d78", "d79", "d95", "d101", "d102", 
          "d103", "d104", "d107", "d108", "d109", "d110", "d111", "d115", "d116", "d480", "d481", 
          "d482", "d483", "d484", "d485", "d486", "d487", "d488", "d489", "d490", "d491", "d492", 
          "d493", "d494", "d495", "d496", "d497", "d498", "d499"
        ], // Ancient cities, archaeological sites, Buddhist temples, historical monuments

        // NORTHERN destinations - Expanded northern coverage
        "northern": [
          "d15", "d59", "d60", "d61", "d62", "d480", "d481", "d482", "d483", "d484", "d485", 
          "d486", "d487", "d488", "d489"
        ], // Northern Province including Jaffna Peninsula, islands, cultural sites

        // SOUTHERN destinations (comprehensive south coast) - All southern areas
        "southern": [
          "d2", "d4", "d6", "d8", "d16", "d28", "d29", "d30", "d35", "d36", "d37", "d38", "d49", 
          "d51", "d52", "d53", "d54", "d55", "d72", "d74", "d75", "d76", "d96", "d97", "d98", 
          "d99", "d100", "d112", "d400", "d401", "d402", "d403", "d404", "d405", "d406", "d407", 
          "d408", "d409", "d410", "d411", "d412", "d413", "d414", "d415", "d416", "d417", "d418", 
          "d419", "d420", "d421", "d422", "d423", "d424", "d425", "d426", "d427", "d428", "d429", 
          "d430", "d431", "d432", "d433", "d434", "d435", "d436", "d437", "d438", "d439"
        ], // Complete Southern Province coverage

        // EASTERN destinations - Enhanced eastern coast
        "eastern": [
          "d9", "d17", "d39", "d40", "d41", "d42", "d114", "d440", "d441", "d442", "d443", "d444", 
          "d445", "d446", "d447", "d448", "d449"
        ], // Eastern coast including remote beaches and cultural sites

        // WESTERN destinations (Colombo area, urban, business) - Greater Colombo region
        "western": [
          "d11", "d12", "d56", "d71", "d73", "d86", "d87", "d88", "d89", "d90", "d91", "d92", 
          "d93", "d94", "d105", "d450", "d451", "d452", "d453", "d454", "d455"
        ], // Western Province including urban areas and suburbs

        // WILDLIFE & NATURE destinations - Expanded nature experiences
        "wildlife": [
          "d8", "d20", "d21", "d22", "d23", "d43", "d48", "d50", "d52", "d81", "d95", "d456", 
          "d457", "d458", "d459", "d460", "d461", "d462", "d463", "d464", "d465", "d466", "d467", 
          "d468", "d469", "d470", "d471", "d472", "d473", "d474", "d475"
        ], // National parks, nature reserves, wildlife sanctuaries, forest areas

        // ADVENTURE destinations (hiking, surfing, extreme sports) - Adventure hotspots
        "adventure": [
          "d5", "d17", "d23", "d24", "d25", "d47", "d55", "d81", "d82", "d476", "d477", "d478", 
          "d479", "d480", "d481", "d482", "d483", "d484", "d485", "d486", "d487", "d488", "d489", 
          "d490", "d491", "d492", "d493", "d494", "d495", "d496", "d497", "d498", "d499"
        ], // Adventure sports, hiking trails, extreme activities, water sports

        // NORTH WESTERN destinations - Enhanced northwestern region
        "north-western": [
          "d18", "d34", "d43", "d45", "d58", "d101", "d102", "d103", "d456", "d457", "d458", 
          "d459", "d460", "d461", "d462", "d463", "d464", "d465"
        ], // North Western Province including coastal and inland areas

        // CENTRAL destinations - Heart of Sri Lanka
        "central": [
          "d1", "d3", "d5", "d7", "d19", "d23", "d24", "d26", "d27", "d33", "d47", "d65", "d66", 
          "d67", "d68", "d69", "d70", "d450", "d451", "d452", "d453", "d454", "d455", "d470", 
          "d471", "d472", "d473", "d474", "d475", "d476", "d477", "d478", "d479"
        ], // Central highlands, tea country, ancient capitals

        // UVA destinations - Uva Province
        "uva": [
          "d5", "d24", "d26", "d27", "d68", "d69", "d70", "d475", "d476", "d477", "d478", "d479", 
          "d490", "d491", "d492", "d493", "d494", "d495"
        ], // Uva Province including Ella, Badulla, Monaragala areas

        // SABARAGAMUWA destinations
        "sabaragamuwa": [
          "d25", "d33", "d47", "d82", "d83", "d84", "d85", "d466", "d467", "d468", "d469", "d470", 
          "d471", "d472", "d473", "d474"
        ] // Sabaragamuwa Province including Ratnapura, Kegalle areas
      }

      // Smart destination selection based on preferences and trip length - Enhanced for 317 destinations
      let selectedDestinations: string[] = []
      const allRequestedDestinations = preferencesData.zones.flatMap(zone => destinationMap[zone] || [])
      
      // Map starting location to destination ID - improved mapping
      const startingLocationMap: Record<string, string> = {
        "colombo": "d11",      // Colombo
        "negombo": "d12",      // Negombo
        "kandy": "d3",         // Kandy
        "galle": "d4",         // Galle
        "trincomalee": "d9",   // Trincomalee
        "jaffna": "d15",       // Jaffna
        "anuradhapura": "d13", // Anuradhapura
        "ella": "d5",          // Ella
        "bentota": "d6",       // Bentota
        "mirissa": "d8",       // Mirissa
        "nuwara-eliya": "d7",  // Nuwara Eliya
        "sigiriya": "d1",      // Sigiriya
        "polonnaruwa": "d14",  // Polonnaruwa
        "batticaloa": "d9",    // Batticaloa
        "matara": "d16",       // Matara
        "hikkaduwa": "d17",    // Hikkaduwa
        "arugam-bay": "d17",   // Arugam Bay
        "pasikuda": "d39",     // Pasikuda
        "tangalle": "d28",     // Tangalle
        "unawatuna": "d29",    // Unawatuna
        "weligama": "d30",     // Weligama
        "ahangama": "d35",     // Ahangama
        "induruwa": "d36",     // Induruwa
        "aluthgama": "d37",    // Aluthgama
        "beruwala": "d38",     // Beruwala
        "kalutara": "d39",     // Kalutara
        "amabalangoda": "d40", // Ambalangoda
        "hiriketiya": "d41",   // Hiriketiya
        "wadduwa": "d42",      // Wadduwa
        "kosgoda": "d49",      // Kosgoda
        "balapitiya": "d52",   // Balapitiya
        "rekawa": "d53",       // Rekawa
        "kirinda": "d54",      // Kirinda
        "tissamaharama": "d55" // Tissamaharama
      }
      
      const startingDestinationId = startingLocationMap[preferencesData.startingLocation] || "d11"
      
      // Significantly increase destination pool for better AI variety - leverage full database
      const maxDestinations = Math.min(
        budgetData.tripLength * 5, // Send 5x more options per day for better variety (7 days = 35 destinations)
        50 // Send up to 50 destinations for maximum AI choice flexibility
      )
      
      // ALWAYS start with the selected starting location
      selectedDestinations.push(startingDestinationId)
      console.log(`Starting location: ${preferencesData.startingLocation} (${startingDestinationId})`)
      
      // Priority destinations with broader coverage across all zones (excluding starting location)
      const priorityDestinations = [
        "d11", "d3", "d1", "d4", // Core: Colombo, Kandy, Sigiriya, Galle
        "d5", "d17", "d23", "d24", // Adventure: Ella, Arugam Bay, Horton Plains, Adam's Peak
        "d8", "d20", "d21", "d22", // Wildlife: Yala, Udawalawe, Minneriya, Kaudulla
        "d10", "d13", "d14", // Cultural: Dambulla, Anuradhapura, Polonnaruwa
        "d15", "d18", // Regional: Jaffna, Kalpitiya
        "d400", "d401", "d402", "d403", "d404", // New coastal gems
        "d450", "d451", "d452", "d453", "d454", // New hill country spots
        "d480", "d481", "d482", "d483", "d484", // New cultural sites
        "d490", "d491", "d492", "d493", "d494"  // New adventure locations
      ]
      
      // Add priority destinations first if they match preferences (excluding starting location)
      for (const dest of priorityDestinations) {
        if (allRequestedDestinations.includes(dest) && 
            dest !== startingDestinationId && 
            selectedDestinations.length < maxDestinations) {
          selectedDestinations.push(dest)
        }
      }
      
      // Add zone-specific destinations for better variety (excluding starting location)
      preferencesData.zones.forEach(zone => {
        const zoneDestinations = destinationMap[zone] || []
        // Take more destinations per zone for enhanced variety
        const zoneLimit = Math.min(15, Math.ceil(maxDestinations / preferencesData.zones.length))
        
        for (const dest of zoneDestinations) {
          if (!selectedDestinations.includes(dest) && 
              dest !== startingDestinationId && 
              selectedDestinations.length < maxDestinations) {
            selectedDestinations.push(dest)
            if (selectedDestinations.filter(d => zoneDestinations.includes(d)).length >= zoneLimit) {
              break
            }
          }
        }
      })
      
      // Fill remaining slots with high-rated destinations from expanded database
      const highQualityDestinations = [
        // Coastal excellence
        "d406", "d407", "d408", "d409", "d410", "d411", "d412", "d413", "d414", "d415",
        // Hill country gems  
        "d455", "d456", "d457", "d458", "d459", "d460", "d461", "d462", "d463", "d464",
        // Cultural treasures
        "d485", "d486", "d487", "d488", "d489", "d490", "d491", "d492", "d493", "d494",
        // Adventure hotspots
        "d495", "d496", "d497", "d498", "d499"
      ]
      
      for (const dest of highQualityDestinations) {
        if (!selectedDestinations.includes(dest) && selectedDestinations.length < maxDestinations) {
          selectedDestinations.push(dest)
        }
      }
      
      // Always include Colombo if not already included (as entry/exit point)
      if (!selectedDestinations.includes("d11") && selectedDestinations.length < maxDestinations) {
        selectedDestinations.unshift("d11")
      }
      
      // Fallback to diverse popular destinations if none selected
      if (selectedDestinations.length === 0) {
        selectedDestinations = ["d11", "d3", "d1", "d4", "d5", "d8", "d17", "d23"] // Core destinations
      }
      const travelStyle = preferencesData.pace === "relaxed" ? "comfort" : 
                         preferencesData.pace === "moderate" ? "balanced" : "active"
      
      const interests: string[] = []
      if (preferencesData.zones.includes("cultural-triangle")) interests.push("culture", "history")
      if (preferencesData.zones.includes("coastal")) interests.push("nature", "beaches")
      if (preferencesData.zones.includes("hill-country")) interests.push("nature", "tea-culture")
      
      const request: AITravelPlanRequest = {
        destinations: selectedDestinations,
        budget: budgetData.budget,
        days: budgetData.tripLength,
        travelStyle: travelStyle,
        interests: interests.length > 0 ? interests : ["culture", "nature"]
      }

      console.log("Calling AI API with:", request)
  console.log('AI Travel Plan Request:', JSON.stringify(request, null, 2))
      // Ensure startingLocation is included in the request
      if (!request.startingLocation && preferencesData.startingLocation) {
        request.startingLocation = preferencesData.startingLocation;
        console.warn('Added missing startingLocation to AI request:', preferencesData.startingLocation);
      }
      const aiResponse = await generateAITravelPlan(request)
      console.log("AI Response received:", aiResponse)
      console.log("AI Response success field:", aiResponse.success)
      
      if (aiResponse.success) {
        // Handle the actual Ballerina backend response format
        if (aiResponse.itinerary && Array.isArray(aiResponse.itinerary)) {
          console.log("Using direct itinerary from backend:", aiResponse.itinerary)
          
          // Convert backend itinerary format to frontend format
          const convertedItinerary = convertBackendItinerary(aiResponse.itinerary)
          setItinerary(convertedItinerary)
          
          // Set AI plan text for display
          const summaryText = `🧠 ${aiResponse.intelligenceLevel || 'AI'} Travel Plan Generated Successfully!

🎯 Trip Summary:
• ${aiResponse.summary?.days || budgetData.tripLength} days in Sri Lanka
• ${aiResponse.summary?.travelStyle || aiResponse.summary?.style || 'comfort'} travel style
• Budget: ${aiResponse.summary?.budget || budgetData.budget} ${budgetData.currency}
• Daily Budget: ${aiResponse.summary?.dailyBudget || Math.round(budgetData.budget / budgetData.tripLength)} ${budgetData.currency}
• Destinations: ${aiResponse.summary?.destinationNames?.join(' → ') || aiResponse.summary?.destinations?.join(', ') || 'Multiple locations'}
• Interests: ${aiResponse.summary?.interests?.join(', ') || 'Culture & Nature'}

💰 Smart Budget Breakdown:
${aiResponse.budgetBreakdown ? `• Accommodation (${Math.round((aiResponse.budgetBreakdown.accommodation / aiResponse.budgetBreakdown.total) * 100)}%): ${aiResponse.budgetBreakdown.accommodation} ${budgetData.currency}
• Food & Dining (${Math.round((aiResponse.budgetBreakdown.food / aiResponse.budgetBreakdown.total) * 100)}%): ${aiResponse.budgetBreakdown.food} ${budgetData.currency}
• Activities & Tours (${Math.round((aiResponse.budgetBreakdown.activities / aiResponse.budgetBreakdown.total) * 100)}%): ${aiResponse.budgetBreakdown.activities} ${budgetData.currency}
• Transportation (${Math.round((aiResponse.budgetBreakdown.transport / aiResponse.budgetBreakdown.total) * 100)}%): ${aiResponse.budgetBreakdown.transport} ${budgetData.currency}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• TOTAL: ${aiResponse.budgetBreakdown.total} ${budgetData.currency}` : 'Budget breakdown unavailable'}

🗓️ Intelligent Itinerary Overview:
${aiResponse.itinerary.map((day: any) => {
  const activities = day.activities?.filter((act: any) => !act.activityType || act.activityType === 'activity') || [];
  const hotels = day.activities?.filter((act: any) => act.activityType === 'accommodation') || [];
  const meals = day.activities?.filter((act: any) => act.activityType === 'meal') || [];
  const transport = day.activities?.filter((act: any) => act.activityType === 'transport') || [];
  
  let dayText = `🌟 Day ${day.day} - ${day.destination}`;
  if (day.location && day.location !== day.destination) {
    dayText += ` (${day.location})`;
  }
  dayText += ` [~${day.estimatedCost || 0} ${budgetData.currency}]`;
  
  if (day.description) {
    dayText += `\n   📍 ${day.description}`;
  }
  
  if (activities.length > 0) {
    dayText += `\n   🎯 Experiences: ${activities.map((act: any) => act.title).join(' • ')}`;
  }
  if (hotels.length > 0) {
    dayText += `\n   🏨 Stay: ${hotels[0].title}`;
  }
  if (meals.length > 0) {
    dayText += `\n   🍽️ Dining: ${meals.length} carefully selected meals`;
  }
  if (transport.length > 0) {
    dayText += `\n   🚗 Transport: ${transport[0].title}`;
  }
  if (day.weather) {
    dayText += `\n   🌤️ Weather: ${day.weather}`;
  }
  if (day.tips) {
    dayText += `\n   💡 Tips: ${day.tips}`;
  }
  
  return dayText;
}).join('\n\n')}

� AI Intelligence Features:
• Real destination data from database
• Actual hotel recommendations with ratings
• Authentic restaurant selections
• Smart budget optimization by travel style
• Weather and local tips integration
• Activity timing and logistics planning

🤖 Generated by: ${aiResponse.aiProvider || 'Ballerina Super Planner'} on ${aiResponse.generatedAt || new Date().toLocaleDateString()}`
          
          setAiPlan(summaryText)
        } else if (aiResponse.ai_response_text) {
          // Fallback to text parsing if available
          setAiPlan(aiResponse.ai_response_text)
          const parsedItinerary = parseAIResponse(aiResponse.ai_response_text)
          
          if (parsedItinerary.length > 0) {
            console.log("Successfully parsed AI text response:", parsedItinerary)
            setItinerary(parsedItinerary)
          } else {
            console.log("Failed to parse AI text response, using sample data")
            setItinerary(generateSampleItinerary(budgetData, preferencesData))
          }
        } else {
          console.log("Backend returned success but no itinerary data, using sample")
          setAiPlan("✅ AI service responded successfully")
          setItinerary(generateSampleItinerary(budgetData, preferencesData))
        }
      } else {
        const errorMessage = aiResponse.error || aiResponse.message || "Unknown error"
        console.error("AI failed:", errorMessage)
        console.log("Full AI Response:", JSON.stringify(aiResponse, null, 2))
        setAiPlan(`❌ AI service error: ${errorMessage} - using sample itinerary`)
        setItinerary(generateSampleItinerary(budgetData, preferencesData))
      }
    } catch (error) {
      console.error("Network error connecting to backend:", error)
      
      // Check if backend is running by testing health endpoint
      try {
        const healthResponse = await fetch('http://localhost:9091/travelhelper/health')
        if (healthResponse.ok) {
          setAiPlan("🔧 Backend connected but AI endpoint failed - using sample itinerary with your preferences")
        } else {
          setAiPlan("🔌 Backend service unavailable - using sample itinerary (start backend with 'bal run')")
        }
      } catch (healthError) {
        setAiPlan("🔌 Backend not running - using sample itinerary (start backend with 'bal run')")
      }
      
      setItinerary(generateSampleItinerary(budgetData, preferencesData))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEditItem = (itemId: string) => {
    // TODO: Open edit modal
    console.log("Edit item:", itemId)
  }

  const handleDeleteItem = (itemId: string) => {
    setItinerary((prev) => prev.map((dayItems) => dayItems.filter((item) => item.id !== itemId)))
  }

  const handleAddItem = (day: number, type: DayItem["type"]) => {
    // TODO: Open add item modal
    console.log("Add item:", { day, type })
  }

  const handleApplyChanges = (changes: any) => {
    // This is a simplified implementation - in a real app, this would apply the actual changes
    console.log("Applying changes:", changes)

    // For demo purposes, we'll just show that changes were applied
    // In a real implementation, this would modify the itinerary based on the changes
  }

  // Calculate spending totals
  const calculateSpending = () => {
    const totals = { lodging: 0, activities: 0, transport: 0 }

    itinerary.flat().forEach((item) => {
      switch (item.type) {
        case "stay":
          totals.lodging += item.price
          break
        case "activity":
          totals.activities += item.price
          break
        case "transport":
          totals.transport += item.price
          break
      }
    })

    return totals
  }

  const spending = calculateSpending()

  const handleSavePlan = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    const planName = `Sri Lanka ${budgetData.tripLength}-Day Trip`
    savePlan({
      name: planName,
      destination: preferencesData.zones.join(", "),
      budget: budgetData.budget,
      currency: budgetData.currency,
      tripLength: budgetData.tripLength,
      travelers: budgetData.travelers,
      itinerary: itinerary,
    })

    alert("Plan saved successfully!")
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        {/* Enhanced Header Section with Animations */}
        <div className="text-center mb-6">
          {/* Main Title with Different Gradient and Animation */}
          <div className="relative inline-block">
            <h1 className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#12212E] via-[#307082] to-[#12212E] bg-clip-text text-transparent mb-4 animate-fade-in">
              {isGenerating ? "✨ Crafting Your Perfect Journey..." : "Your Sri Lanka Itinerary"}
            </h1>
            {/* Decorative underline with different color */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#307082] to-[#12212E] rounded-full animate-expand"></div>
          </div>

          {/* Trip Details with Staggered Animation */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6">
            {/* Days Badge */}
            <div className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#307082]/10 to-[#6CA3A2]/10 rounded-full border border-[#6CA3A2]/20 hover:border-[#6CA3A2] transition-all duration-300 animate-slide-in-left">
              <div className="w-2 h-2 bg-[#307082] rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-[#307082]">{budgetData.tripLength} days</span>
            </div>

            {/* Separator Dot */}
            <div className="w-1 h-1 bg-[#EA9940] rounded-full animate-bounce"></div>

            {/* Travelers Badge */}
            <div className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#EA9940]/10 to-[#307082]/10 rounded-full border border-[#EA9940]/20 hover:border-[#EA9940] transition-all duration-300 animate-slide-in-up">
              <svg className="w-4 h-4 text-[#EA9940]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className="text-sm font-semibold text-[#EA9940]">{budgetData.travelers} travelers</span>
            </div>

            {/* Separator Dot */}
            <div className="w-1 h-1 bg-[#6CA3A2] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>

            {/* Budget Badge */}
            <div className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6CA3A2]/10 to-[#EA9940]/10 rounded-full border border-[#6CA3A2]/20 hover:border-[#6CA3A2] transition-all duration-300 animate-slide-in-right">
              <svg className="w-4 h-4 text-[#6CA3A2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
              <span className="text-sm font-semibold text-[#6CA3A2]">
                {budgetData.currency} {budgetData.budget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Loading Indicator */}
          {isGenerating && (
            <div className="mt-4 flex items-center justify-center gap-2 animate-fade-in">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#EA9940] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#307082] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-[#6CA3A2] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-sm text-slate-600 ml-2">AI is crafting your perfect trip...</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div></div> {/* Spacer for alignment */}
          <div className="flex items-center gap-4">
            {/* Enhanced Regenerate with AI Button */}
            {!isGenerating && (
              <button
                onClick={generateItinerary}
                className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-[#EA9940] via-[#307082] to-[#6CA3A2] text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#6CA3A2] via-[#EA9940] to-[#307082] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-1000 group-hover:translate-x-full"></div>
                
                {/* Button content */}
                <div className="relative flex items-center gap-2">
                  <div className="relative">
                    <svg 
                      className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13 3L15 5L9 11L7 9L5 11L9 15L11 13L17 7L19 9H21ZM4.5 17.5C4.5 17.5 6.5 14.5 12 14.5S19.5 17.5 19.5 17.5V19H4.5V17.5Z"/>
                    </svg>
                    {/* Pulsing dot */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium">Regenerate with AI</span>
                </div>
              </button>
            )}

            {/* Enhanced Chat Bot Button - Hide during generation */}
            {false && !isGenerating && (
              <button
                onClick={() => setShowChat(!showChat)}
                className={`group relative p-4 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  showChat 
                    ? 'bg-gradient-to-br from-[#307082] to-[#6CA3A2] shadow-lg shadow-[#307082]/30' 
                    : 'bg-gradient-to-br from-slate-100 to-white border-2 border-slate-200 hover:border-[#6CA3A2] shadow-md'
                }`}
              >
                {/* Animated background for active state */}
                {showChat && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6CA3A2] to-[#307082] opacity-20 animate-pulse"></div>
                )}
                
                {/* Chat icon with animation */}
                <div className="relative">
                  <svg 
                    className={`w-6 h-6 transition-all duration-300 ${
                      showChat ? 'text-white rotate-12' : 'text-[#307082] group-hover:text-[#6CA3A2]'
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                    />
                  </svg>
                  
                  {/* Status indicator */}
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-300 ${
                    showChat 
                      ? 'bg-[#EA9940] animate-bounce' 
                      : 'bg-green-400 animate-pulse'
                  }`}>
                    <div className="absolute inset-0 rounded-full bg-current opacity-50 animate-ping"></div>
                  </div>
                </div>

                {/* Fixed Tooltip - positioned above the button */}
                <div className={`absolute -top-14 left-1/2 transform -translate-x-1/2 px-3 py-2 text-xs font-medium text-white bg-[#12212E] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 ${
                  showChat ? 'hidden' : ''
                }`}>
                  Chat Assistant
                  {/* Arrow pointing down */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#12212E] rotate-45"></div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">AI is planning your perfect trip</h3>
            <p className="text-slate-600">
              Analyzing destinations, optimizing budget, and crafting personalized experiences...
            </p>
          </div>
        </div>
      )}



      {/* Dashboard Cards - Stylish horizontal layout */}
      {!isGenerating && (
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Budget Tracker - Takes 6 columns (equal size) */}
            <div className="lg:col-span-6 min-h-[600px] flex flex-col">
              <div className="relative min-h-[600px] flex-1">
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-[#EA9940] to-[#307082] rounded-full opacity-60"></div>
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-br from-[#6CA3A2] to-[#EA9940] rounded-full opacity-40"></div>
                <BudgetBar totalBudget={budgetData.budget} currency={budgetData.currency} spent={spending} />
              </div>
            </div>

            {/* Trip Summary - Takes 6 columns (equal size) */}
            <div className="lg:col-span-6 min-h-[600px] flex flex-col">
              {/* Trip Summary - Enhanced with gradient background */}
              <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 min-h-[600px] flex flex-col flex-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-400/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-tr-full"></div>

                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-xl flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    Trip Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Zones */}
                    <div className="group p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/30 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">Zones</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-800">{preferencesData.zones.length}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {preferencesData.zones.join(", ").length > 20
                          ? preferencesData.zones.join(", ").substring(0, 20) + "..."
                          : preferencesData.zones.join(", ")}
                      </div>
                    </div>

                    {/* Pace */}
                    <div className="group p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200/30 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500 rounded-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Pace</span>
                      </div>
                      <div className="text-2xl font-bold text-emerald-800 capitalize">{preferencesData.pace}</div>
                      <div className="text-xs text-emerald-600 mt-1">
                        {preferencesData.pace === "relaxed" ? "Take it easy" :
                         preferencesData.pace === "moderate" ? "Balanced pace" : "Fast-paced adventure"}
                      </div>
                    </div>

                    {/* Transport */}
                    <div className="group p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/30 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">Transport</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-800 capitalize">
                        {preferencesData.transport.replace("-", " ")}
                      </div>
                      <div className="text-xs text-purple-600 mt-1">
                        {preferencesData.transport === "self-drive" ? "Freedom to explore" :
                         preferencesData.transport === "car-driver" ? "Convenient & safe" :
                         preferencesData.transport === "train" ? "Scenic journeys" : "Flexible travel"}
                      </div>
                    </div>

                    {/* Hotel View */}
                    <div className="group p-4 bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-xl border border-rose-200/30 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-rose-500 rounded-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">Hotel View</span>
                      </div>
                      <div className="text-2xl font-bold text-rose-800 capitalize">
                        {preferencesData.hotelView.replace("-", " ")}
                      </div>
                      <div className="text-xs text-rose-600 mt-1">
                        {preferencesData.hotelView === "sea" ? "Ocean views" :
                         preferencesData.hotelView === "hill" ? "Mountain vistas" :
                         preferencesData.hotelView === "city" ? "Urban landscape" : "Comfortable stay"}
                      </div>
                    </div>
                  </div>

                  {/* Additional trip insights */}
                  <div className="pt-4 border-t border-slate-200/50">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg">
                        <div className="text-lg font-bold text-slate-700">{budgetData.tripLength}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Days</div>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg">
                        <div className="text-lg font-bold text-slate-700">{budgetData.travelers}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Travelers</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Featured Sigiriya tile (AAM) */}
      {!isGenerating && (
        <div className="mb-8">
          <div className="relative rounded-lg overflow-hidden shadow-md">
            <img
              src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/ed/85/6b/um-palacio-no-topo-da.jpg?w=900&h=500&s=1"
              alt="Sigiriya Rock Fortress"
              className="w-full h-44 object-cover"
            />
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold">Sigiriya Rock Fortress</h3>
              <p className="text-sm text-slate-600">Ancient palace ruins and UNESCO World Heritage site — an essential cultural stop.</p>
              <div className="mt-3">
                <a href="/explore/sigiriya" className="text-sm text-blue-700 hover:underline">Learn more →</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isGenerating && (
        <>
          {/* Main Itinerary */}
          <div className="space-y-4">
            {itinerary.map((dayItems, index) => (
              <DayCard
                key={index + 1}
                day={index + 1}
                items={dayItems}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onAddItem={handleAddItem}
              />
            ))}

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={handleSavePlan} className="flex-1 bg-primary hover:bg-primary-700">
                    <Save className="w-4 h-4 mr-2" />
                    {user ? "Save Itinerary" : "Sign In to Save"}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Share className="w-4 h-4 mr-2" />
                    Share Plan
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <FileDown className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modern Chat Popup */}
          <ModernChatPopup
            isOpen={showChat}
            onClose={() => setShowChat(false)}
            onApplyChanges={handleApplyChanges}
            budgetData={budgetData}
            preferencesData={preferencesData}
            // pass current itinerary so chat backend can use it
            currentPlan={{ itinerary, budgetData, preferencesData }}
          />
        </>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
