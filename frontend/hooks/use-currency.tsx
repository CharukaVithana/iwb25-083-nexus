"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getExchangeRates, type ExchangeRate } from "@/lib/currency"

interface CurrencyContextType {
  selectedCurrency: string
  setSelectedCurrency: (currency: string) => void
  exchangeRates: ExchangeRate | null
  isLoading: boolean
  lastUpdated: Date | null
  refreshRates: () => Promise<void>
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refreshRates = async () => {
    setIsLoading(true)
    try {
      const rates = await getExchangeRates(selectedCurrency)
      setExchangeRates(rates)
      setLastUpdated(new Date(rates.timestamp))
    } catch (error) {
      console.error("Failed to refresh exchange rates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshRates()
  }, [selectedCurrency])

  // Auto-refresh rates every 5 minutes
  useEffect(() => {
    const interval = setInterval(refreshRates, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        exchangeRates,
        isLoading,
        lastUpdated,
        refreshRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
