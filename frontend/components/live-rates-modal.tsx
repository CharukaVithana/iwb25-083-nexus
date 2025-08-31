"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCurrency } from "@/hooks/use-currency"
import { currencies, formatCurrency } from "@/lib/currency"
import { RefreshCw, Clock } from "lucide-react"

interface LiveRatesModalProps {
  children: React.ReactNode
}

export function LiveRatesModal({ children }: LiveRatesModalProps) {
  const { exchangeRates, isLoading, lastUpdated, refreshRates, selectedCurrency } = useCurrency()
  const [open, setOpen] = useState(false)

  const formatLastUpdated = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  const handleRefresh = async () => {
    await refreshRates()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Live Exchange Rates</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Base Currency Info */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Base Currency:</span>
              <span className="text-sm">{selectedCurrency}</span>
            </div>
            {lastUpdated && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Updated {formatLastUpdated(lastUpdated)}</span>
              </div>
            )}
          </div>

          {/* Exchange Rates List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {exchangeRates ? (
              currencies
                .filter(currency => currency.code !== selectedCurrency)
                .map((currency) => {
                  const rate = exchangeRates.rates[currency.code]
                  if (!rate) return null

                  return (
                    <div
                      key={currency.code}
                      className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span className="text-sm font-medium">{currency.code}</span>
                        <span className="text-xs text-muted-foreground">({currency.symbol})</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono">
                          {formatCurrency(rate, selectedCurrency, false)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          1 {selectedCurrency} = {formatCurrency(rate, currency.code, false)} {currency.code}
                        </div>
                      </div>
                    </div>
                  )
                })
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {isLoading ? "Loading rates..." : "No rates available"}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Rates are updated every 10 minutes. Click refresh to get latest rates.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
