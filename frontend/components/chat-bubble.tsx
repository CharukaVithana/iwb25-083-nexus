"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  changes?: {
    added: string[]
    removed: string[]
    costDelta: number
    currency: string
  }
}

interface ChatBubbleProps {
  message: ChatMessage
  onApplyChanges?: (messageId: string) => void
}

export function ChatBubble({ message, onApplyChanges }: ChatBubbleProps) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "Rs"
    return `${symbol}${Math.abs(amount)}`
  }

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[80%]", isUser ? "order-2" : "order-1")}>
        <div
          className={cn(
            "rounded-lg px-4 py-3 text-sm",
            isUser
              ? "bg-primary text-white ml-4"
              : isSystem
                ? "bg-slate-100 text-slate-700 mr-4"
                : "bg-white border border-slate-200 mr-4",
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>

          {/* Show changes preview for assistant messages */}
          {message.changes && !isUser && (
            <Card className="mt-3 bg-slate-50">
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-slate-900">Proposed Changes</h4>
                    <Badge variant={message.changes.costDelta >= 0 ? "destructive" : "default"} className="text-xs">
                      {message.changes.costDelta >= 0 ? "+" : ""}
                      {formatCurrency(message.changes.costDelta, message.changes.currency)}
                    </Badge>
                  </div>

                  {message.changes.added.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-green-700 mb-1">Added:</p>
                      <ul className="text-xs text-green-600 space-y-1">
                        {message.changes.added.map((item, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="text-green-500">+</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {message.changes.removed.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-red-700 mb-1">Removed:</p>
                      <ul className="text-xs text-red-600 space-y-1">
                        {message.changes.removed.map((item, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="text-red-500">-</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {onApplyChanges && (
                    <div className="pt-2 border-t">
                      <button
                        onClick={() => onApplyChanges(message.id)}
                        className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary-700 transition-colors"
                      >
                        Apply Changes
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className={cn("text-xs text-slate-500 mt-1 px-1", isUser ? "text-right" : "text-left")}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  )
}
