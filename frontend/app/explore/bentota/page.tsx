import { Navbar } from "@/components/navbar"
import Link from "next/link"

export const metadata = {
  title: "Bentota - Explore Sri Lanka",
  description: "Information, best times to visit and nearby attractions for Bentota beach destination.",
}

export default function BentotaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navbar />

      <main className="container mx-auto max-w-4xl py-12 px-4">
        <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
          <img
            src="/bentota.jpg"
            alt="Bentota Beach"
            className="w-full h-72 object-cover"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Bentota</h1>
        <p className="text-slate-600 mb-6">
          Bentota is a stunning coastal paradise known for its pristine golden beaches, world-class water sports,
          and riverside relaxation. Located on Sri Lanka's southwest coast, it offers the perfect blend of adventure
          and tranquility with luxury resorts, ancient temples, and vibrant marine life.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Best time to visit</h2>
          <p className="text-slate-600">November to April (dry season) — ideal weather for water sports and beach activities.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">How to get there</h2>
          <ol className="list-decimal list-inside text-slate-600">
            <li>Fly to Colombo Bandaranaike International Airport (2 hours drive).</li>
            <li>Take a train to Bentota station from Colombo Fort (3-4 hours).</li>
            <li>Drive via the Southern Expressway for a scenic coastal journey.</li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Nearby attractions</h2>
          <ul className="list-disc list-inside text-slate-600">
            <li>Bentota River — boat safaris and riverside walks</li>
            <li>Ancient temples and colonial architecture</li>
            <li>Water sports including jet skiing, parasailing, and banana boat rides</li>
            <li>Brief Garden — beautiful landscaped gardens</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Suggested hotels</h2>
          <p className="text-slate-600 mb-3">Luxury beachfront resorts and boutique stays:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/hotels" className="block p-4 border rounded-lg hover:shadow-md bg-white">
              <h3 className="font-semibold">Heritance Ahungalla</h3>
              <p className="text-sm text-slate-600">Luxury beach resort with spa and water sports facilities.</p>
            </Link>
            <Link href="/hotels" className="block p-4 border rounded-lg hover:shadow-md bg-white">
              <h3 className="font-semibold">Club Bentota</h3>
              <p className="text-sm text-slate-600">Beachfront hotel with river views and adventure activities.</p>
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
