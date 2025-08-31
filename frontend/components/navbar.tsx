"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CurrencyPicker } from "@/components/currency-picker"
import { AuthModal } from "@/components/auth-modal"
import { Badge } from "@/components/ui/badge"
import { useCurrency } from "@/hooks/use-currency"
import { useAuth } from "@/hooks/use-auth"
import { User, LogOut } from "lucide-react"
import { LiveRatesModal } from "@/components/live-rates-modal"

export function Navbar() {
  const { isLoading, lastUpdated } = useCurrency()
  const { user, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative pl-10">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-5">
        <img src="/placeholder.svg?height=60&width=200" alt="Cultural Border" className="h-4 w-32 object-contain" />
      </div>
    <div className="container flex h-16 items-center justify-between relative z-10">
        <Link href="/" className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-full bg-[#307082] flex items-center justify-center relative overflow-hidden">
            <span className="text-white font-bold text-sm relative z-10">TH</span>
            <div className="absolute inset-0 opacity-20">
              <img src="/placeholder.svg?height=32&width=32" alt="Lotus" className="w-full h-full object-contain" />
            </div>
          </div>
      <span className="font-serif font-bold text-xl text-foreground">Travel Helper</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/explore" className="text-sm font-medium text-foreground hover:text-[#307082] transition-colors">
            Explore
          </Link>
          <Link href="/hotels" className="text-sm font-medium text-foreground hover:text-[#307082] transition-colors">
            Hotels
          </Link>
          <Link href="/saved" className="text-sm font-medium text-foreground hover:text-[#307082] transition-colors">
            Saved Plans
          </Link>
        </div>

        <div className="flex items-center space-x-4">
      <div className="hidden sm:flex items-center space-x-2">
            <div className="w-32">
              <CurrencyPicker />
            </div>
            {lastUpdated && (
              <LiveRatesModal>
                <Badge
                  variant="outline"
                  className="text-xs border-border text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  {isLoading ? "Updating..." : "Live rates"}
                </Badge>
              </LiveRatesModal>
            )}
          </div>

          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-foreground hover:text-[#307082] hover:bg-[#6CA3A2]/10"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user.name}</span>
              </Button>

              {showUserMenu && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/saved"
          className="block px-4 py-2 text-sm text-foreground hover:bg-[#6CA3A2]/10"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Saved Plans
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setShowUserMenu(false)
                    }}
          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-[#6CA3A2]/10 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
        onClick={() => setShowAuthModal(true)}
        className="text-foreground hover:text-[#307082] hover:bg-[#6CA3A2]/10"
            >
              Sign In
            </Button>
          )}

      <Button size="sm" className="bg-[#EA9940] hover:bg-[#307082] text-white">
            <Link href="/plan">Plan Trip</Link>
          </Button>
        </div>
      </div>

  <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </nav>
  )
}
