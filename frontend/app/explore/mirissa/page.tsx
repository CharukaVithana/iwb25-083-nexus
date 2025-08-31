import { Navbar } from "@/components/navbar"
import Link from "next/link"

export const metadata = {
  title: "Mirissa - Explore Sri Lanka",
  description: "Information, best times to visit and nearby attractions for Mirissa beach destination.",
}

export default function MirissaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navbar />

      <main className="container mx-auto max-w-4xl py-12 px-4">
        <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
          <img
            src="/beach.jpg"
            alt="Mirissa Beach"
            className="w-full h-72 object-cover"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Mirissa</h1>
        <p className="text-slate-600 mb-6">
          Mirissa is a charming coastal town famous for its whale watching tours, golden sandy beaches,
          and laid-back beachside cafés. This picturesque destination offers stunning sunsets, excellent
          surfing conditions, and a perfect blend of relaxation and adventure on Sri Lanka's southern coast.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Best time to visit</h2>
          <p className="text-slate-600">November to April (dry season) — prime time for whale watching and beach activities.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">How to get there</h2>
          <ol className="list-decimal list-inside text-slate-600">
            <li>Fly to Colombo and drive south (4-5 hours) or take a domestic flight to Mattala.</li>
            <li>Take a train from Colombo to Mirissa station (6-7 hours).</li>
            <li>Drive via the Southern Expressway for a comfortable journey.</li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Nearby attractions</h2>
          <ul className="list-disc list-inside text-slate-600">
            <li>Whale watching tours — see blue whales and dolphins</li>
            <li>Mirissa Beach — perfect for swimming and sunbathing</li>
            <li>Secret Beach — hidden cove accessible by boat</li>
            <li>Surfing at nearby spots and beachside cafés</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Suggested hotels</h2>
          <p className="text-slate-600 mb-3">Beachfront stays and boutique accommodations:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/hotels" className="block p-4 border rounded-lg hover:shadow-md bg-white">
              <h3 className="font-semibold">Paradise Beach Club</h3>
              <p className="text-sm text-slate-600">Beachfront resort with whale watching packages.</p>
            </Link>
            <Link href="/hotels" className="block p-4 border rounded-lg hover:shadow-md bg-white">
              <h3 className="font-semibold">Mirissa Beach Hotel</h3>
              <p className="text-sm text-slate-600">Comfortable stay with ocean views and local dining.</p>
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
