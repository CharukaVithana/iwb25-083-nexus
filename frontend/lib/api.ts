const API_BASE_URL = 'http://localhost:9091';

export interface Region {
  id: string;
  name: string;
  description: string;
  image_url: string;
  highlights: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  image_url: string;
  location: string;
  highlights: string;
  latitude: number;
  longitude: number;
  province?: string;
  type?: string;
  rating?: number;
  tags?: string[];
  attractions?: Attraction[];
  hotels?: Hotel[];
  restaurants?: Restaurant[];
}

export interface Attraction {
  id: string;
  destination_id: string;
  name: string;
  description: string;
  type: string;
  recommended_time_minutes: number;
  activities: string;
  latitude: number;
  longitude: number;
  cost: number;
  rating: number;
  time_required_minutes: number;
  tags: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price_range: string;
  rating: number;
  destination_id: string;
  destination_name?: string;
  amenities?: string | string[];
  room_types?: string | string[];
  latitude: number;
  longitude: number;
  cost_per_night: number;
  features?: string | string[];
  address: string;
  contact_number: string;
  website: string;
  check_in_time: string;
  check_out_time: string;
}

export interface Restaurant {
  id: string;
  destination_id: string;
  name: string;
  description: string;
  cuisine: string;
  price_level: string;
  rating: number;
  latitude: number;
  longitude: number;
  tags: string;
  cost: number;
  opening_hours: string;
}

export async function getAllRegions(): Promise<Region[]> {
  const response = await fetch(`${API_BASE_URL}/destinations`);
  if (!response.ok) {
    throw new Error('Failed to fetch regions');
  }
  return response.json();
}

export async function getRegion(id: string): Promise<Region> {
  const response = await fetch(`${API_BASE_URL}/destinations/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch region ${id}`);
  }
  return response.json();
}

export async function getAllDestinations(): Promise<Destination[]> {
  const response = await fetch(`${API_BASE_URL}/destinations`);
  if (!response.ok) {
    throw new Error('Failed to fetch destinations');
  }
  return response.json();
}

export async function getDestination(id: string): Promise<Destination> {
  const response = await fetch(`${API_BASE_URL}/destinations/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch destination ${id}`);
  }
  return response.json();
}

// Get destinations by zone/region for frontend filtering
export async function getDestinationsByZone(zone: string): Promise<Destination[]> {
  const response = await fetch(`${API_BASE_URL}/destinations/zone/${zone}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch destinations for zone ${zone}`);
  }
  return response.json();
}

// Get destinations by province for geographic clustering
export async function getDestinationsByProvince(province: string): Promise<Destination[]> {
  const response = await fetch(`${API_BASE_URL}/destinations/province/${province}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch destinations for province ${province}`);
  }
  return response.json();
}

// Get random destinations for variety
export async function getRandomDestinations(count: number = 10, exclude?: string[]): Promise<Destination[]> {
  const params = new URLSearchParams();
  params.append('count', count.toString());
  if (exclude && exclude.length > 0) {
    params.append('exclude', exclude.join(','));
  }
  
  const response = await fetch(`${API_BASE_URL}/destinations/random?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch random destinations');
  }
  return response.json();
}

// Search destinations by name, description, or tags
export async function searchDestinations(query: string): Promise<Destination[]> {
  const params = new URLSearchParams();
  params.append('q', query);
  
  const response = await fetch(`${API_BASE_URL}/destinations/search?${params}`);
  if (!response.ok) {
    throw new Error('Failed to search destinations');
  }
  return response.json();
}

// Get destinations within radius of coordinates (for geographic clustering)
export async function getDestinationsNearby(
  latitude: number, 
  longitude: number, 
  radius: number = 50
): Promise<Destination[]> {
  const params = new URLSearchParams();
  params.append('lat', latitude.toString());
  params.append('lng', longitude.toString());
  params.append('radius', radius.toString());
  
  const response = await fetch(`${API_BASE_URL}/destinations/nearby?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch nearby destinations');
  }
  return response.json();
}

// Enhanced attraction APIs
export async function getAttractionsByDestination(destinationId: string): Promise<Attraction[]> {
  const response = await fetch(`${API_BASE_URL}/attractions/destination/${destinationId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch attractions for destination ${destinationId}`);
  }
  return response.json();
}

export async function getAllAttractions(): Promise<Attraction[]> {
  const response = await fetch(`${API_BASE_URL}/attractions`);
  if (!response.ok) {
    throw new Error('Failed to fetch attractions');
  }
  return response.json();
}

// Enhanced restaurant APIs  
export async function getRestaurantsByDestination(destinationId: string): Promise<Restaurant[]> {
  const response = await fetch(`${API_BASE_URL}/restaurants/destination/${destinationId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch restaurants for destination ${destinationId}`);
  }
  return response.json();
}

export async function getAllRestaurants(): Promise<Restaurant[]> {
  const response = await fetch(`${API_BASE_URL}/restaurants`);
  if (!response.ok) {
    throw new Error('Failed to fetch restaurants');
  }
  return response.json();
}

export async function getAllHotels(): Promise<Hotel[]> {
  const response = await fetch(`${API_BASE_URL}/hotels`);
  if (!response.ok) {
    throw new Error('Failed to fetch hotels');
  }
  return response.json();
}

export async function getHotelsByDestination(destinationId: string): Promise<Hotel[]> {
  const response = await fetch(`${API_BASE_URL}/hotels/${destinationId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch hotels for destination ${destinationId}`);
  }
  return response.json();
}

// Hotels search with filters - directly calling Ballerina backend
export async function searchHotels(filters: {
  destination?: string;
  rating?: number;
  amenities?: string[];
}): Promise<Hotel[]> {
  const params = new URLSearchParams();
  
  if (filters.destination) {
    params.append('destination', filters.destination);
  }
  if (filters.rating) {
    params.append('rating', filters.rating.toString());
  }
  if (filters.amenities && filters.amenities.length > 0) {
    params.append('amenities', filters.amenities.join(','));
  }

  const response = await fetch(`${API_BASE_URL}/hotels/search?${params}`);
  if (!response.ok) {
    throw new Error('Failed to search hotels');
  }
  return response.json();
}
// AI Travel Planning Interface - Enhanced for 317 destinations database
export interface AITravelPlanRequest {
  destinations: string[]; // Now supports up to 50 destination IDs from expanded database
  budget: number;
  days: number;
  travelStyle: string;
  interests: string[];
  startingLocation?: string;
}

export interface AITravelPlan {
  success: boolean;
  ai_response_text?: string;
  error?: string;
  message?: string;
  totalBudget?: number; // Enhanced budget tracking
  destinationCount?: number; // Track how many destinations are being visited
  summary?: {
    budget: number;
    days: number;
    style: string;
    interests: string[];
    destinations: string[];
    dailyBudget?: number;
    destinationNames?: string[];
    destinationDetails?: Array<{
      id: string;
      name: string;
      location?: string;
      description?: string;
      highlights?: string;
    }>; // Enhanced destination information
    travelStyle?: string;
    tripType?: string; // e.g., 'cultural', 'adventure', 'relaxation', 'mixed'
    coverageArea?: string; // e.g., 'southern-coast', 'hill-country', 'cultural-triangle'
  };
  itinerary?: Array<{
    day: number;
    destination: string;
    destinationId?: string;
    destinationName?: string; // Enhanced destination info
    location?: string;
    description?: string;
    highlights?: string;
    dailyBudget?: number;
    estimatedCost?: number;
    weather?: string;
    tips?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }; // Geographic information for mapping
    activities: Array<{
      id?: string; // Activity ID from database
      title: string;
      note: string;
      cost?: number;
      duration?: string;
      time?: string;
      activityType?: string; // 'accommodation', 'transport', 'meal', 'activity', 'attraction'
      location?: string;
      category?: string;
      attractionId?: string; // Reference to attractions table
      hotelId?: string; // Reference to hotels table
      restaurantId?: string; // Reference to restaurants table
      coordinates?: {
        latitude: number;
        longitude: number;
      };
      rating?: number; // Activity/attraction rating
      tags?: string[]; // Activity tags for filtering
    }>;
  }>;
  budgetBreakdown?: {
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
    total: number;
    dailyBreakdown?: {
      accommodation: number;
      food: number;
      activities: number;
      transport: number;
    };
    categoryPercentages?: {
      accommodation: number;
      food: number;
      activities: number;
      transport: number;
    }; // Percentage breakdown for visualization
  };
  intelligenceLevel?: string; // AI intelligence level indicator
  generatedAt?: string;
  aiProvider?: string;
  routeOptimization?: {
    totalDistance?: number;
    estimatedTravelTime?: string;
    optimizationApplied?: boolean;
    routeEfficiency?: number; // 0-100 score
  }; // Enhanced route planning
  metadata?: {
    ai_provider: string;
    generated_at: string;
    note?: string;
    database_version?: string; // Track database version used
    destination_pool_size?: number; // How many destinations were available for selection
    repetition_prevention?: boolean; // Whether anti-repetition logic was applied
    geographic_clustering?: boolean; // Whether geographic clustering was used
    budget_optimization?: boolean; // Whether budget optimization was applied
  };
}

export async function generateAITravelPlan(request: AITravelPlanRequest): Promise<AITravelPlan> {
  try {
    const response = await fetch(`${API_BASE_URL}/travelhelper/plans/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        message: data.message || data.error || 'Failed to generate travel plan'
      };
    }
    
    return data;
  } catch (error) {
    console.error('Network error in generateAITravelPlan:', error);
    return {
      success: false,
      error: 'Network error',
      message: error instanceof Error ? error.message : 'Failed to connect to backend'
    };
  }
}

// Chat Interface
export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  success: boolean;
  reply?: string;
  changes?: any;
  error?: string;
}
export async function sendChatMessage(message: string, plan?: any): Promise<ChatResponse> {
  const body: any = { message };
  if (plan !== undefined) body.plan = plan;

  const response = await fetch(`${API_BASE_URL}/travelhelper/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to send chat message: ${response.statusText}`);
  }

  return response.json();
}




export async function checkBackendHealth(): Promise<{ status: string; service: string }> {
  const response = await fetch(`${API_BASE_URL}/travelhelper/health`);
  if (!response.ok) {
    throw new Error('Backend health check failed');
  }
  return response.json();
}
