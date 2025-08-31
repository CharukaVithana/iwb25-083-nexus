import { Navbar } from "@/components/navbar"
import Link from "next/link"

export const metadata = {
  title: "Sigiriya Rock Fortress - Explore",
  description: "Visitor guide, best times to visit and nearby attractions for Sigiriya Rock Fortress.",
}

export default function SigiriyaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navbar />

      <main className="container mx-auto max-w-4xl py-12 px-4">
        <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
          <img
            src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/ed/85/6b/um-palacio-no-topo-da.jpg?w=900&h=500&s=1"
            alt="Sigiriya Rock Fortress"
            className="w-full h-72 object-cover"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Sigiriya Rock Fortress</h1>
        <p className="text-slate-600 mb-6">
          Sigiriya is an ancient rock fortress and palace built on a massive column of rock nearly 200 metres high.
          It's a UNESCO World Heritage site famous for its frescoes, landscaped gardens and panoramic views from the summit.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Visitor tips</h2>
          <ul className="list-disc list-inside text-slate-600">
            <li>Start early in the morning to avoid heat and crowds; sunrise visits are beautiful.</li>
            <li>Wear sturdy shoes—the climb includes many steps and narrow passages.</li>
            <li>Bring water, sun protection, and modest clothing for cultural respect.</li>
            <li>Entry fee applies; check local sites for current ticket prices and hours.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Nearby attractions</h2>
          <p className="text-slate-600 mb-3">Dambulla Cave Temple, Pidurangala Rock (great alternative sunrise view), and local village experiences.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Suggested hotels</h2>
          <p className="text-slate-600 mb-3">Stay in nearby Dambulla or Sigiriya for quick morning access to the site.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/hotels" className="block p-4 border rounded-lg hover:shadow-md bg-white">
              <h3 className="font-semibold">Sigiriya Village Hotel</h3>
              <p className="text-sm text-slate-600">Comfortable base close to the fortress and local attractions.</p>
            </Link>
            <Link href="/hotels" className="block p-4 border rounded-lg hover:shadow-md bg-white">
              <h3 className="font-semibold">Dambulla Eco Lodge</h3>
              <p className="text-sm text-slate-600">Eco-friendly stay with easy access to Sigiriya and Dambulla caves.</p>
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
