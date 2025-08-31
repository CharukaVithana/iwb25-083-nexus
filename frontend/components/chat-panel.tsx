"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatBubble, type ChatMessage } from "@/components/chat-bubble"
import { MessageComposer } from "@/components/message-composer"
import { Badge } from "@/components/ui/badge"
import { sendChatMessage } from "@/lib/api"

interface ChatPanelProps {
  onApplyChanges: (changes: any) => void
  budgetData: any
  preferencesData: any
}

export function ChatPanel({ onApplyChanges, budgetData, preferencesData }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I've created your ${budgetData.tripLength}-day Sri Lanka itinerary based on your preferences. You can ask me to modify anything - change activities, adjust budget, swap hotels, or completely restructure days. What would you like to adjust?`,
      timestamp: new Date(),
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAssistantResponse = (userMessage: string): ChatMessage => {
    // Simple simulation of AI responses with changes
    const lowerMessage = userMessage.toLowerCase()

    let response = ""
    let changes = null

    if (lowerMessage.includes("cheaper") || lowerMessage.includes("budget")) {
      response =
        "I've found some budget-friendly alternatives that can save you money while keeping the same great experiences."
      changes = {
        added: ["Budget guesthouse in Galle (Sea view)", "Local bus transport"],
        removed: ["Ocean View Resort", "Private car + driver"],
        costDelta: -150,
        currency: budgetData.currency,
      }
    } else if (lowerMessage.includes("beach")) {
      response = "Great idea! I've added more beach activities and coastal experiences to your itinerary."
      changes = {
        added: ["Surfing lesson in Mirissa", "Sunset beach walk", "Seafood dinner by the ocean"],
        removed: ["City tour"],
        costDelta: 75,
        currency: budgetData.currency,
      }
    } else if (lowerMessage.includes("cultural") || lowerMessage.includes("temple")) {
      response = "I've enhanced your cultural experience with more historical sites and temple visits."
      changes = {
        added: ["Sigiriya Rock Fortress", "Dambulla Cave Temples", "Traditional dance show"],
        removed: ["Beach relaxation day"],
        costDelta: 120,
        currency: budgetData.currency,
      }
    } else if (lowerMessage.includes("rest") || lowerMessage.includes("relax")) {
      response = "I've added some downtime to your itinerary so you can relax and enjoy the destinations."
      changes = {
        added: ["Free morning for relaxation", "Spa treatment", "Leisurely breakfast"],
        removed: ["Early morning city tour"],
        costDelta: 50,
        currency: budgetData.currency,
      }
    } else {
      response =
        "I understand you'd like to modify your itinerary. Let me suggest some changes that align with your request."
      changes = {
        added: ["Custom experience based on your request"],
        removed: [],
        costDelta: 0,
        currency: budgetData.currency,
      }
    }

    return {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: response,
      timestamp: new Date(),
      changes,
    }
  }

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsProcessing(true)

    try {
      // Try to use the Ballerina backend chat endpoint
      const chatResponse = await sendChatMessage(content)
      
      if (chatResponse.success && chatResponse.reply) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: chatResponse.reply,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error(chatResponse.error || "Chat service unavailable")
      }
    } catch (error) {
      console.error("Chat error:", error)
      // Fallback to simulated response if backend is unavailable
      const assistantResponse = simulateAssistantResponse(content)
      setMessages((prev) => [...prev, assistantResponse])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuickAction = (action: string) => {
    handleSendMessage(action)
  }

  const handleApplyChanges = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId)
    if (message?.changes) {
      onApplyChanges(message.changes)

      // Add confirmation message
      const confirmationMessage: ChatMessage = {
        id: `system-${Date.now()}`,
        role: "system",
        content: "Changes applied successfully! Your itinerary has been updated.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, confirmationMessage])
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Chat with Travel Assistant</CardTitle>
          <Badge variant="outline" className="text-xs">
            {isProcessing ? "Thinking..." : "Online"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              onApplyChanges={message.changes ? handleApplyChanges : undefined}
            />
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 mr-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <span className="text-sm text-slate-600">Assistant is typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer */}
        <div className="border-t p-4">
          <MessageComposer
            onSendMessage={handleSendMessage}
            onQuickAction={handleQuickAction}
            disabled={isProcessing}
          />
        </div>
      </CardContent>
    </Card>
  )
}
