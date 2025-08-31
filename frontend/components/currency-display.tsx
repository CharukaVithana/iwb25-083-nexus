"use client"

import { useState } from "react"
import { convertCurrency, formatCurrency, getFriendlyPrice } from "@/lib/currency"
import { useCurrency } from "@/hooks/use-currency"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"

interface CurrencyDisplayProps {
  amount: number
  originalCurrency: string
  showLKR?: boolean
  showBuffer?: boolean
  className?: string
  lkrClassName?: string
}

export function CurrencyDisplay({
  amount,
  originalCurrency,
  showLKR = true,
  showBuffer = false,
  className = "",
  lkrClassName = "text-sm text-slate-500",
}: CurrencyDisplayProps) {
  const { selectedCurrency, exchangeRates, isLoading, lastUpdated } = useCurrency()
  const [showDetails, setShowDetails] = useState(false)

  if (!exchangeRates) {
    return <span className={className}>{formatCurrency(amount, originalCurrency)}</span>
  }

  const convertedAmount = convertCurrency(amount, originalCurrency, selectedCurrency, exchangeRates, showBuffer)

  const friendlyAmount = getFriendlyPrice(convertedAmount, selectedCurrency)
  const lkrAmount = selectedCurrency !== "LKR" ? convertCurrency(amount, originalCurrency, "LKR", exchangeRates) : null

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="font-medium">{formatCurrency(friendlyAmount, selectedCurrency)}</span>

      {showLKR && lkrAmount && selectedCurrency !== "LKR" && (
        <span
          className={`${lkrClassName} cursor-help`}
          onMouseEnter={() => setShowDetails(true)}
          onMouseLeave={() => setShowDetails(false)}
        >
          (≈ {formatCurrency(lkrAmount, "LKR")})
        </span>
      )}

      {showBuffer && (
        <Badge variant="outline" className="text-xs">
          +2% buffer
        </Badge>
      )}

      {isLoading && <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />}

      {showDetails && lastUpdated && (
        <div className="absolute z-10 bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
          Rate: 1 {originalCurrency} = {exchangeRates.rates[selectedCurrency]?.toFixed(4)} {selectedCurrency}
          <br />
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}
