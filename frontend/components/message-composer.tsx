"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Send } from "lucide-react"

interface MessageComposerProps {
  onSendMessage: (message: string) => void
  onQuickAction: (action: string) => void
  disabled?: boolean
}

const quickActions = [
  "Make it cheaper",
  "Add beach day",
  "More cultural sites",
  "Reduce travel time",
  "Add rest day",
  "Find better hotels",
  "Include wildlife safari",
  "Add train journeys",
]

export function MessageComposer({ onSendMessage, onQuickAction, disabled }: MessageComposerProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleQuickAction = (action: string) => {
    if (!disabled) {
      onQuickAction(action)
    }
  }

  return (
    <div className="space-y-3">
      {/* Quick Action Chips */}
      <div className="flex flex-wrap gap-2">
        <p className="text-sm text-slate-600 w-full mb-1">Quick suggestions:</p>
        {quickActions.map((action) => (
          <Badge
            key={action}
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
            onClick={() => handleQuickAction(action)}
          >
            {action}
          </Badge>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me to modify your itinerary... (e.g., 'Make day 3 a beach day' or 'Keep total under $900')"
          className="flex-1 min-h-[60px] resize-none"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <Button type="submit" disabled={!message.trim() || disabled} className="bg-primary hover:bg-primary-700">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
