// Currency conversion utilities and API integration

export interface ExchangeRate {
  base: string
  rates: Record<string, number>
  timestamp: number
}

export interface CurrencyInfo {
  code: string
  symbol: string
  name: string
  flag: string
}

export const currencies: CurrencyInfo[] = [
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee", flag: "🇱🇰" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳" },
]

// Fallback rates in case API fails
const fallbackRates: ExchangeRate = {
  base: "USD",
  rates: {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    LKR: 295.5,
    AUD: 1.35,
    CAD: 1.25,
    JPY: 110.25,
    INR: 74.85,
  },
  timestamp: Date.now(),
}

let cachedRates: ExchangeRate = fallbackRates
let lastFetch = 0
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes cache

// Get API configuration from environment variables
const API_KEY = process.env.EXCHANGE_RATE_API_KEY || ''
const API_URL = process.env.EXCHANGE_RATE_API_URL || 'https://api.exchangerate-api.com/v4'

export async function getExchangeRates(baseCurrency = "USD"): Promise<ExchangeRate> {
  const now = Date.now()

  // Return cached rates if still fresh
  if (now - lastFetch < CACHE_DURATION && cachedRates.base === baseCurrency) {
    return cachedRates
  }

  try {
    // Use free API without authentication
    const response = await fetch(`${API_URL}/latest/${baseCurrency}`)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    // Transform API response to our format
    const rates: Record<string, number> = {}
    Object.entries(data.rates).forEach(([currency, rate]) => {
      // Only include currencies we support
      if (currencies.some(c => c.code === currency)) {
        rates[currency] = rate as number
      }
    })

    const exchangeRate: ExchangeRate = {
      base: data.base,
      rates,
      timestamp: now
    }

    cachedRates = exchangeRate
    lastFetch = now
    return exchangeRate

  } catch (error) {
    console.error("Failed to fetch exchange rates from API:", error)

    // Return cached rates if available, otherwise fallback
    if (cachedRates.base === baseCurrency) {
      return cachedRates
    }

    // Convert fallback rates to requested base currency
    if (baseCurrency !== "USD") {
      const baseRate = fallbackRates.rates[baseCurrency]
      if (baseRate) {
        const convertedRates: Record<string, number> = {}
        Object.entries(fallbackRates.rates).forEach(([currency, rate]) => {
          convertedRates[currency] = rate / baseRate
        })
        return {
          base: baseCurrency,
          rates: convertedRates,
          timestamp: now
        }
      }
    }

    return fallbackRates
  }
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRate,
  addBuffer = false,
): number {
  if (fromCurrency === toCurrency) return amount

  const fromRate = rates.rates[fromCurrency] || 1
  const toRate = rates.rates[toCurrency] || 1

  // Convert to base currency first, then to target currency
  const baseAmount = fromCurrency === rates.base ? amount : amount / fromRate
  const convertedAmount = toCurrency === rates.base ? baseAmount : baseAmount * toRate

  // Add 2% buffer for safety if requested
  const finalAmount = addBuffer ? convertedAmount * 1.02 : convertedAmount

  return Math.round(finalAmount * 100) / 100 // Round to 2 decimal places
}

export function formatCurrency(amount: number, currency: string, showSymbol = true): string {
  const currencyInfo = currencies.find((c) => c.code === currency)
  const symbol = currencyInfo?.symbol || currency

  // Format with appropriate decimal places
  const decimals = currency === "JPY" ? 0 : 2
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return showSymbol ? `${symbol}${formatted}` : formatted
}

export function getCurrencyInfo(code: string): CurrencyInfo | undefined {
  return currencies.find((c) => c.code === code)
}

export function getFriendlyPrice(amount: number, currency: string): number {
  // Round to friendly numbers based on currency
  if (currency === "LKR" || currency === "JPY") {
    // Round to nearest 100 for high-value currencies
    return Math.round(amount / 100) * 100
  } else if (currency === "INR") {
    // Round to nearest 50
    return Math.round(amount / 50) * 50
  } else {
    // Round to nearest 5 for USD, EUR, etc.
    return Math.round(amount / 5) * 5
  }
}
