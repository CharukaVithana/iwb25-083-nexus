"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Wallet, Bot, Hotel } from "lucide-react"

export default function HomePage() {
  // Hero images
  const images = [
    "/nine.jpg?height=800&width=1200",
    "/bentota1.jpg?height=800&width=1200",
    "/sigiriya.jpg?height=800&width=1200",
    "/boat.jpg?height=800&width=1200",
    "/surfer1.jpg?height=800&width=1200",
  ]
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  // Features data
  const features = [
  {
    title: "Smart Budget Planning",
    desc: "Set your budget and get real-time cost tracking with live hotel prices and activity costs.",
    icon: <Wallet className="w-12 h-12 text-[#307082]" />,
  },
  {
    title: "Conversational Planning",
    desc: `Chat with our AI to refine your itinerary: "Make day 3 a beach day" or "Keep under $900".`,
    icon: <Bot className="w-12 h-12 text-[#307082]" />,
  },
  {
    title: "Explore Hotels",
    desc: "Discover amazing accommodations across Sri Lanka with detailed information and personalized recommendations.",
    icon: <Hotel className="w-12 h-12 text-[#307082]" />,
  },
]

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-[#307082] to-[#12212E] overflow-hidden">
        <div className="absolute inset-0">
          {images.map((img, index) => (
            <img
              key={index}
              src={img || "/placeholder.svg"}
              alt={`Sri Lanka Adventure ${index}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div className="container max-w-4xl mx-auto text-center relative z-10">
          <h1 className=" text-4xl md:text-6xl font-bold font-sans text-white mb-6">
            Plan Your Perfect
            <span className="text-white block font-sans">Sri Lanka Adventure</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 mt-10 max-w-2xl mx-auto leading-relaxed">
            Smart, budget-aware trip planning with live hotel prices, conversational itinerary building, and local
            insights for the Pearl of the Indian Ocean.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plan">
              <Button size="lg" className="bg-[#EA9940] hover:bg-[#d88a36] text-white px-8 py-3">
                Plan My Trip
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                size="lg"
                className="border-[#ECE7DC] text-[#307082] font-bold hover:bg-[#ECE7DC]/90 px-8 py-3 bg-[#ECE7DC]"
              >
                Explore Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative bg-gradient-to-b from-[#ECE7DC] to-white">
        <div className="container max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl font-bold text-[#12212E] mb-14"
          >
            Why Choose <span className="text-[#307082]">Travel Helper?</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="border-[#6CA3A2] shadow-md hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden group">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-[#6CA3A2]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>

                    <h3 className="font-semibold text-xl mb-3 text-[#12212E] group-hover:text-[#307082] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[#12212E]/70 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#307082] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/bentota1.jpg?height=400&width=1200" alt="Tea" className="w-full h-full object-cover" />
        </div>
        <div className="container max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-serif text-3xl font-bold mb-4">Ready to Explore Sri Lanka?</h2>
          <p className="text-lg mb-8 text-white/90">
            Join thousands of travelers who've planned their perfect Sri Lankan adventure with us.
          </p>
          <Link href="/plan">
            <Button size="lg" className="bg-[#EA9940] text-white hover:bg-[#d88a36] px-8 py-3">
              Start Planning Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#12212E] text-slate-400 relative">
        <div className="absolute bottom-4 right-4 opacity-10">
          <img src="/bentota.jpg?height=80&width=80" alt="Sri Lankan Elephant" className="w-12 h-12 object-contain" />
        </div>
        <div className="container max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-6 w-6 rounded-full bg-[#307082] flex items-center justify-center">
                <span className="text-white font-bold text-xs">TH</span>
              </div>
              <span className="font-serif font-bold text-white">Travel Helper</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/legal/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/legal/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/auth" className="hover:text-white transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
