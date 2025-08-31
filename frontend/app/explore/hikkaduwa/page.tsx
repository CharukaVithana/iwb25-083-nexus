import { Navbar } from "@/components/navbar"
import Link from "next/link"

export const metadata = {
  title: "Hikkaduwa - Explore Sri Lanka",
  description: "Information, best times to visit and nearby attractions for Hikkaduwa beach destination.",
}

export default function HikkaduwaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navbar />

      <main className="container mx-auto max-w-4xl py-12 px-4">
        <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
          <img
            src="/surfer1.jpg"
            alt="Hikkaduwa Beach"
            className="w-full h-72 object-cover"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Hikkaduwa</h1>
        <p className="text-slate-600 mb-6">
          Hikkaduwa is Sri Lanka's premier surfing destination, famous for its coral reefs, excellent
          snorkeling opportunities, and vibrant beach atmosphere. This lively coastal town offers
          world-class waves for surfers, marine life exploration, and a perfect mix of adventure and relaxation.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Best time to visit</h2>
          <p className="text-slate-600">November to April (dry season) — best surfing conditions and clear waters for snorkeling.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">How to get there</h2>
          <ol className="list-decimal list-inside text-slate-600">
            <li>Fly to Colombo and drive south (3-4 hours) or take a domestic flight to Mattala.</li>
            <li>Take a train from Colombo to Hikkaduwa station (5-6 hours).</li>
            <li>Drive via the Southern Expressway for a scenic coastal drive.</li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Nearby attractions</h2>
          <ul className="list-disc list-inside text-slate-600">
            <li>Hikkaduwa Coral Sanctuary — world-famous snorkeling and diving</li>
            <li>Surfing at Narigama Beach — excellent waves for all levels</li>
            <li>Turtle Hatchery — see baby turtles and conservation efforts</li>
            <li>Beachside bars, restaurants, and lively nightlife</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Suggested hotels</h2>
          <p className="text-slate-600 mb-3">Beachfront resorts and surf-friendly accommodations:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/hotels" className="block p-4 border rounded-lg hover:shadow-md bg-white">
              <h3 className="font-semibold">Citrus Hikkaduwa</h3>
              <p className="text-sm text-slate-600">Beachfront resort with surf lessons and coral reef access.</p>
            </Link>
            <Link href="/hotels" className="block p-4 border rounded-lg hover:shadow-md bg-white">
              <h3 className="font-semibold">Surf Beach Hotel</h3>
              <p className="text-sm text-slate-600">Surf-friendly accommodation with board rentals and lessons.</p>
            </Link>
          </div>
        </section>

        <div className="text-right">
          <Link href="/explore" className="text-sm text-blue-700 hover:underline">← Back to Explore</Link>
        </div>
      </main>
    </div>
  )
}
