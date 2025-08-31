"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { currencies } from "@/lib/currency"
import { useCurrency } from "@/hooks/use-currency"
import { formatCurrency } from "@/lib/currency"

export function CurrencyPicker() {
  const { selectedCurrency, setSelectedCurrency, exchangeRates } = useCurrency()
  const selectedCurrencyInfo = currencies.find((c) => c.code === selectedCurrency)

  return (
    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
      <SelectTrigger className="w-full">
        <SelectValue>
          {selectedCurrencyInfo && (
            <div className="flex items-center gap-2">
              <span>{selectedCurrencyInfo.flag}</span>
              <span>{selectedCurrencyInfo.code}</span>
              <span className="text-muted-foreground">({selectedCurrencyInfo.symbol})</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => {
          const rate = exchangeRates?.rates[currency.code]
          const displayRate = rate ? `1 ${selectedCurrency} = ${formatCurrency(rate, currency.code, false)} ${currency.code}` : ""

          return (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span>{currency.flag}</span>
                  <span>{currency.name}</span>
                  <span className="text-muted-foreground">({currency.symbol})</span>
                </div>
                {displayRate && (
                  <span className="text-xs text-muted-foreground ml-6">
                    {displayRate}
                  </span>
                )}
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
