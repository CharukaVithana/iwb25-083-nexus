import { Navbar } from "@/components/navbar"
import Link from "next/link"

export const metadata = {
  title: "Adam's Peak (Sri Pada) - Explore",
  description: "Information, best times to visit and nearby attractions for Adam's Peak (Sri Pada).",
}

export default function AdamsPeakPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navbar />

      <main className="container mx-auto max-w-4xl py-12 px-4">
        <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
          <img
            src="https://thesrilankatravelblog.com/wp-content/uploads/2020/04/Adams-Peak-slider-1.jpg"
            alt="Adam's Peak"
            className="w-full h-72 object-cover"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Adam's Peak (Sri Pada)</h1>
        <p className="text-slate-600 mb-6">
          Adam's Peak, locally known as Sri Pada, is a conical mountain and pilgrimage site famous for the
          "sacred footprint" rock formation and spectacular sunrise views. The climb is a rewarding cultural and
          natural experience enjoyed by pilgrims and hikers alike.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Best time to visit</h2>
          <p className="text-slate-600">December to April (dry season) — clear skies and more comfortable trekking conditions.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">How to get there</h2>
          <ol className="list-decimal list-inside text-slate-600">
            <li>Travel to Hatton or Nallathanniya by train or road.</li>
            <li>Start the climb from Dalhousie (Nallathanniya) for the shorter ascent (~5-7 hours round trip).</li>
            <li>Begin the climb late night to reach the summit at sunrise.</li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Nearby attractions</h2>
          <ul className="list-disc list-inside text-slate-600">
            <li>Hatton — gateway town with tea estates</li>
            <li>Nuwara Eliya — hill station with gardens and colonial architecture</li>
            <li>Tea factory visits and scenic train rides through the highlands</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Suggested hotels</h2>
          <p className="text-slate-600 mb-3">Nearby hill-country stays — choose one as a base for the climb:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/hotels" className="block p-4 border rounded-lg hover:shadow-md bg-white">
              <h3 className="font-semibold">Hill Country Hotel</h3>
              <p className="text-sm text-slate-600">Comfortable stay with easy access to Hatton and Nallathanniya.</p>
            </Link>
            <Link href="/hotels" className="block p-4 border rounded-lg hover:shadow-md bg-white">
              <h3 className="font-semibold">Tea Estate Bungalow</h3>
              <p className="text-sm text-slate-600">Stay on a tea estate for a tranquil pre-climb night.</p>
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
