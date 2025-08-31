"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  preferences?: {
    currency: string
    defaultTripLength: number
    favoriteDestinations: string[]
  }
}

export interface SavedPlan {
  id: string
  name: string
  destination: string
  budget: number
  currency: string
  tripLength: number
  travelers: number
  createdAt: Date
  updatedAt: Date
  itinerary: any[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => void
  savedPlans: SavedPlan[]
  savePlan: (plan: Omit<SavedPlan, "id" | "createdAt" | "updatedAt">) => void
  deletePlan: (planId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    name: "John Smith",
    preferences: {
      currency: "USD",
      defaultTripLength: 7,
      favoriteDestinations: ["Galle", "Kandy", "Ella"],
    },
  },
]

const mockSavedPlans: SavedPlan[] = [
  {
    id: "1",
    name: "Sri Lanka Adventure",
    destination: "Multi-city",
    budget: 2000,
    currency: "USD",
    tripLength: 10,
    travelers: 2,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    itinerary: [],
  },
  {
    id: "2",
    name: "Beach & Hills Combo",
    destination: "Galle & Kandy",
    budget: 1500,
    currency: "USD",
    tripLength: 7,
    travelers: 2,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    itinerary: [],
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([])

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would check for a valid session/token
        const savedUser = localStorage.getItem("travel-helper-user")
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          // Load user's saved plans
          const userPlans = mockSavedPlans.filter(() => true) // In real app, filter by user ID
          setSavedPlans(userPlans)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication - in real app, this would validate credentials
      const foundUser = mockUsers.find((u) => u.email === email)
      if (!foundUser) {
        throw new Error("Invalid credentials")
      }

      setUser(foundUser)
      localStorage.setItem("travel-helper-user", JSON.stringify(foundUser))

      // Load user's saved plans
      setSavedPlans(mockSavedPlans)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        preferences: {
          currency: "USD",
          defaultTripLength: 7,
          favoriteDestinations: [],
        },
      }

      setUser(newUser)
      localStorage.setItem("travel-helper-user", JSON.stringify(newUser))
      setSavedPlans([])
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    setSavedPlans([])
    localStorage.removeItem("travel-helper-user")
  }

  const savePlan = (planData: Omit<SavedPlan, "id" | "createdAt" | "updatedAt">) => {
    const newPlan: SavedPlan = {
      ...planData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setSavedPlans((prev) => [newPlan, ...prev])
  }

  const deletePlan = (planId: string) => {
    setSavedPlans((prev) => prev.filter((plan) => plan.id !== planId))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        savedPlans,
        savePlan,
        deletePlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
