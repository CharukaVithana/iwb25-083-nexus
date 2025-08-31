"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X, MessageSquare, Send, Loader2, RotateCcw, Move, Maximize2, Minimize2 } from "lucide-react"
import type { BudgetData } from "@/components/budget-step"
import type { PreferencesData } from "@/components/preferences-step"
import { sendChatMessage } from "@/lib/api"

interface ModernChatPopupProps {
  isOpen: boolean
  onClose: () => void
  onApplyChanges: (changes: any) => void
  budgetData: BudgetData
  preferencesData: PreferencesData
  currentPlan?: any
}

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface Position {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

export function ModernChatPopup({ 
  isOpen, 
  onClose, 
  onApplyChanges, 
  budgetData, 
  preferencesData 
  , currentPlan
}: ModernChatPopupProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: `🌟 Hey there! I'm your AI travel companion and I've crafted your ${budgetData.tripLength}-day Sri Lankan adventure based on your preferences.

I can help you:
✨ Modify activities & experiences
🏠 Adjust budget allocations  
🏨 Swap hotels & accommodations
🗺️ Restructure your entire itinerary
🍽️ Add dining recommendations

What would you like to explore or change?`,
      sender: "ai",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [typingResponse, setTypingResponse] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 50 })
  const [size, setSize] = useState<Size>({ width: 480, height: 600 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  
  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)

  // Initialize position to right side when component mounts
  useEffect(() => {
    if (isOpen) {
      const rightPosition = window.innerWidth - 500 // 480 width + 20 margin
      setPosition({ x: Math.max(rightPosition, 20), y: 50 })
    }
  }, [isOpen])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Scroll to top when chat opens to show welcome message
  useEffect(() => {
    if (isOpen && chatRef.current) {
      const messagesContainer = chatRef.current.querySelector('.overflow-y-auto')
      if (messagesContainer) {
        messagesContainer.scrollTop = 0
      }
    }
  }, [isOpen])

  // Handle mouse events for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && chatRef.current) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        
        // Keep within viewport bounds
        const maxX = window.innerWidth - size.width
        const maxY = window.innerHeight - size.height
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        })
      }
      
      if (isResizing && chatRef.current) {
        const newWidth = Math.max(300, e.clientX - position.x)
        const newHeight = Math.max(400, e.clientY - position.y)
        
        // Keep within viewport bounds
        const maxWidth = window.innerWidth - position.x
        const maxHeight = window.innerHeight - position.y
        
        setSize({
          width: Math.min(newWidth, maxWidth),
          height: Math.min(newHeight, maxHeight)
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragOffset, position, size])

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (headerRef.current && chatRef.current) {
      const rect = chatRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
  }

  const resetPosition = () => {
    const rightPosition = window.innerWidth - 500 // 480 width + 20 margin
    setPosition({ x: Math.max(rightPosition, 20), y: 50 })
    setSize({ width: 480, height: 600 })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Try backend first
    setIsLoading(true)
    try {
      // Include the last assistant message as a hint so backend can process confirmations like "Yes"
      let planToSend = currentPlan as any | undefined
      try {
        if (currentPlan) {
          // shallow copy and attach pendingSuggestion if last message is from AI
          planToSend = { ...currentPlan }
          const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null
          if (lastMsg && lastMsg.sender === 'ai') {
            ;(planToSend as any).pendingSuggestion = lastMsg.content
          }
        }
      } catch (e) {
        // ignore copying errors and fall back to sending original currentPlan
        planToSend = currentPlan as any
      }

      const chatResp = await sendChatMessage(userMessage.content, planToSend)
      setIsLoading(false)

      if (chatResp.success && chatResp.reply) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: chatResp.reply,
          sender: "ai",
          timestamp: new Date(),
        }

        // attach changes if provided
        if ((chatResp as any).changes) {
          ;(assistantMessage as any).changes = (chatResp as any).changes
        }

        setMessages(prev => [...prev, assistantMessage])
        return
      }
    } catch (err) {
      console.error('Backend chat failed, falling back to local:', err)
    }

    // Fallback to local simulation with typing animation
    setIsLoading(false)
    setIsTyping(true)
    const fullResponse = getAIResponse(userMessage.content)
    let currentText = ""
    let currentIndex = 0
    const typeText = () => {
      if (currentIndex < fullResponse.length) {
        currentText += fullResponse[currentIndex]
        setTypingResponse(currentText)
        currentIndex++
        const delay = fullResponse[currentIndex - 1] === ' ' ? 50 : fullResponse[currentIndex - 1] === '.' ? 200 : fullResponse[currentIndex - 1] === '\n' ? 100 : 30
        setTimeout(typeText, delay)
      } else {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: fullResponse,
          sender: "ai",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
        setIsTyping(false)
        setTypingResponse("")
      }
    }
    setTimeout(typeText, 400)
  }

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes("make it cheaper") || input.includes("budget") || input.includes("cost") || input.includes("money")) {
      return `💰 I can help reduce your ${budgetData.currency} ${budgetData.budget} budget! Here are some smart ways to save:

🏨 Switch to budget-friendly guesthouses (save 30-50%)
🚌 Use public transport instead of private cars
🍛 Try local street food and small restaurants
🎯 Focus on free attractions like beaches and temples
🛍️ Shop at local markets instead of tourist shops

Which area would you like me to optimize first?`
    }
    
    if (input.includes("add beach day") || input.includes("beach") || input.includes("coastal")) {
      return `🏖️ Perfect! Sri Lanka has amazing beaches. I can add a beautiful beach day to your itinerary:

🌅 **South Coast Options:**
• Unawatuna - Perfect for swimming & snorkeling
• Mirissa - Whale watching & stunning sunsets  
• Tangalle - Pristine & less crowded

🌊 **West Coast Options:**
• Bentota - Water sports & luxury resorts
• Hikkaduwa - Surfing & coral reefs
• Negombo - Close to airport, great seafood

Which region would you prefer for your beach day?`
    }
    
    if (input.includes("more cultural sites") || input.includes("cultural") || input.includes("temple") || input.includes("history")) {
      return `🏛️ Excellent choice! Sri Lanka is rich in cultural treasures. I can add these amazing sites:

🕌 **Ancient Cities:**
• Sigiriya Rock Fortress - UNESCO World Heritage
• Anuradhapura - Ancient capital with sacred stupas
• Polonnaruwa - Medieval capital ruins

⛩️ **Sacred Temples:**
• Temple of the Tooth (Kandy) - Buddha's sacred relic
• Dambulla Cave Temple - Ancient cave paintings
• Golden Temple of Dambulla

Which cultural experience interests you most?`
    }
    
    if (input.includes("add rest day") || input.includes("rest") || input.includes("relax")) {
      return `😌 Great idea! Rest days make trips more enjoyable. I can add a relaxing day to your itinerary:

🧘 **Hill Country Relaxation:**
• Spa day in Kandy with traditional Ayurveda
• Tea plantation walks in Nuwara Eliya
• Peaceful lake views and meditation

🏖️ **Coastal Relaxation:**
• Beach day with massage and yoga
• Sunset watching and seafood dinners
• Swimming and reading by the ocean

Where would you like your rest day - hills or coast?`
    }
    
    if (input.includes("include food tour") || input.includes("food") || input.includes("restaurant") || input.includes("dining")) {
      return `🍽️ Delicious choice! Sri Lankan cuisine is incredible. I can organize amazing food experiences:

🌶️ **Street Food Adventures:**
• Galle Face Green - Famous for isso vadai & kottu
• Pettah Market - Authentic hoppers & roti
• Local "hotels" - Rice & curry for breakfast

🥥 **Cooking Experiences:**
• Spice garden tours with cooking classes
• Traditional village meals with families
• Fresh seafood preparation by the coast

🍛 **Must-Try Dishes:**
• Hoppers with egg curry
• Kottu roti (stir-fried roti)
• Fresh king coconut water

Which food experience sounds most appealing?`
    }
    
    if (input.includes("hotel") || input.includes("accommodation") || input.includes("stay")) {
      return `🏨 I can recommend different accommodations based on your ${preferencesData.hotelView} view preference:

🌊 **Luxury Options:**
• Boutique hotels with infinity pools
• Heritage properties in historic buildings
• Eco-resorts in nature settings

💰 **Budget-Friendly:**
• Clean guesthouses with local charm
• Homestays with authentic experiences
• Backpacker hostels with social vibes

What's your priority - luxury comfort or authentic local experience?`
    }
    
    if (input.includes("transport") || input.includes("travel") || input.includes("getting around")) {
      return `🚗 Your current transport preference is ${preferencesData.transport}. Here are all options:

🚂 **Scenic Train Rides:**
• Kandy to Ella - Most beautiful train journey
• Colombo to Galle - Coastal route along beaches

🚌 **Budget Public Transport:**
• Local buses - Very affordable, authentic experience
• AC express buses - Comfortable for longer distances

🚖 **Private Options:**
• Tuk-tuk for short distances and fun experiences
• Private car with driver - Most convenient & flexible

Would you like me to optimize your transport for cost or comfort?`
    }
    
    return `🤖 I'm here to make your Sri Lankan adventure perfect! I can help with:

✨ **Itinerary Changes:** Add, remove, or modify any activities
🏠 **Budget Optimization:** Find ways to save money without compromising fun  
🏨 **Accommodation:** Switch between luxury, mid-range, or budget options
🗺️ **Route Planning:** Optimize travel between destinations
🍽️ **Food Experiences:** Add authentic dining and cooking experiences
🎯 **Special Interests:** Cultural sites, beaches, adventure activities, wildlife

What aspect of your trip would you like to enhance?`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Chat Window - Dark theme */}
      <div
        ref={chatRef}
        className="fixed bg-slate-900/98 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden z-50 animate-chat-slide-in"
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
        }}
      >
        {/* Header - Draggable - Fixed positioning */}
        <div
          ref={headerRef}
          className="sticky top-0 z-10 bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 cursor-move select-none border-b border-slate-700"
          onMouseDown={handleHeaderMouseDown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Travel Assistant</h3>
                <p className="text-gray-300 text-sm">Your personal trip planner</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetPosition}
                className="text-gray-300 hover:text-white hover:bg-white/10 p-2"
                title="Reset position"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-300 hover:text-white hover:bg-white/10 p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area - Dark theme with proper scrolling */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-slate-900" style={{ height: size.height - 220 }}>
          {messages.map((message, index) => (
            <div key={message.id} className={index === 0 ? "mt-2" : ""}>
              <div
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-message-slide-in`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-slate-800 text-slate-100 border border-slate-700"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === "user" ? "text-blue-100" : "text-slate-400"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              {/* Apply Button after AI responses */}
              {message.sender === "ai" && index > 0 && (
                <div className="flex justify-start mt-2 ml-2">
                  <Button
                    onClick={() => onApplyChanges({ 
                      action: "apply_suggestion", 
                      message: message.content,
                      messageId: message.id 
                    })}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs px-3 py-1.5 rounded-full"
                    size="sm"
                  >
                    ✨ Apply to Plan
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Animation */}
          {isTyping && (
            <div className="flex justify-start animate-message-slide-in">
              <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 max-w-[85%]">
                <p className="text-sm leading-relaxed text-slate-100 whitespace-pre-line">
                  {typingResponse}
                  <span className="inline-block w-2 h-4 bg-slate-400 ml-1 animate-pulse">|</span>
                </p>
                <p className="text-xs mt-2 text-slate-400">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-start animate-message-slide-in">
              <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Dark theme */}
        <div className="border-t border-slate-700 p-4 bg-slate-800/80 backdrop-blur-sm min-h-[100px]">
          <div className="flex gap-2 mb-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your trip..."
              className="flex-1 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              disabled={isLoading || isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading || isTyping}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2">
            {[
              "Make it cheaper", 
              "Add beach day", 
              "More cultural sites", 
              "Add rest day",
              "Include food tour"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="text-xs px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-full hover:bg-slate-600 hover:border-blue-500 transition-all duration-200 text-slate-300 font-medium"
                disabled={isLoading || isTyping}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Resize Handle - Fixed positioning in bottom right corner */}
        <div
          ref={resizeRef}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-slate-600/70 hover:bg-slate-500 transition-colors rounded-tl-md"
          onMouseDown={handleResizeMouseDown}
          title="Resize"
        >
          <div className="absolute bottom-0.5 right-0.5 flex flex-col gap-0.5">
            <div className="flex gap-0.5 justify-end">
              <div className="w-0.5 h-0.5 bg-slate-300 rounded-full"></div>
            </div>
            <div className="flex gap-0.5 justify-end">
              <div className="w-0.5 h-0.5 bg-slate-300 rounded-full"></div>
              <div className="w-0.5 h-0.5 bg-slate-300 rounded-full"></div>
            </div>
            <div className="flex gap-0.5 justify-end">
              <div className="w-0.5 h-0.5 bg-slate-300 rounded-full"></div>
              <div className="w-0.5 h-0.5 bg-slate-300 rounded-full"></div>
              <div className="w-0.5 h-0.5 bg-slate-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
