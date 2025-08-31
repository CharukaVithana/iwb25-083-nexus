import { Navbar } from "@/components/navbar"

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece7dc] via-[#307082]/10 to-[#6ca3a2]/20">
      <Navbar />

      <section className="relative py-20 px-4">
        {/* Enhanced Background with Multiple Layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#307082]/10 via-[#6ca3a2]/5 to-[#12212e]/10"></div>
          <div className="absolute inset-0 opacity-40">
            <img
              src="/surper.jpg"
              alt="Sigiriya Rock Fortress"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative gradient overlays */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#307082]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#6ca3a2]/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="container max-w-8xl mx-auto relative z-10">
          {/* Enhanced Header Section */}
          <div className="text-center mb-16">
            <div className="relative inline-block">
              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-[#12212e] via-[#307082] to-[#6ca3a2] bg-clip-text text-transparent mb-8 leading-tight animate-fade-in">
                Explore Sri Lanka
              </h1>
              {/* Decorative underline */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-44 h-1.5 bg-gradient-to-r from-[#307082] to-[#6ca3a2] rounded-full shadow-sm animate-expand"></div>
            </div>

            {/* Enhanced Description with Better Typography */}
            <div className="max-w-4xl mx-auto mb-8 mt-6">
              <p className="text-xl md:text-2xl text-[#12212e] leading-relaxed mb-4">
                Discover the Pearl of the Indian Ocean — from ancient temples and hill country tea plantations
              </p>
              <p className="text-lg md:text-xl text-[#307082] leading-relaxed">
                to pristine beaches and wildlife sanctuaries. Your journey through paradise begins here.
              </p>
            </div>

            {/* Enhanced Stats/Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-8">
              {/* Regions Badge */}
              <div className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#307082]/10 to-[#6ca3a2]/10 rounded-full border border-[#307082]/20 hover:border-[#307082] transition-all duration-300 animate-slide-in-left">
                <div className="w-3 h-3 bg-[#307082] rounded-full animate-pulse"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#12212e]">9</div>
                  <div className="text-xs font-semibold text-[#307082] uppercase tracking-wider">Regions</div>
                </div>
              </div>

              {/* Separator Dot */}
              <div className="w-1 h-1 bg-[#6ca3a2] rounded-full animate-bounce"></div>

              {/* Destinations Badge */}
              <div className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#6ca3a2]/10 to-[#12212e]/10 rounded-full border border-[#6ca3a2]/20 hover:border-[#6ca3a2] transition-all duration-300 animate-slide-in-up">
                <div className="w-3 h-3 bg-[#6ca3a2] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#12212e]">300+</div>
                  <div className="text-xs font-semibold text-[#6ca3a2] uppercase tracking-wider">Destinations</div>
                </div>
              </div>

              {/* Separator Dot */}
              <div className="w-1 h-1 bg-[#12212e] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>

              {/* Experiences Badge */}
              <div className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#12212e]/10 to-[#ea9940]/10 rounded-full border border-[#12212e]/20 hover:border-[#12212e] transition-all duration-300 animate-slide-in-right">
                <div className="w-3 h-3 bg-[#12212e] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#12212e]">∞</div>
                  <div className="text-xs font-semibold text-[#12212e] uppercase tracking-wider">Experiences</div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-10">
              <a href="http://localhost:3000/plan" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#307082] to-[#6ca3a2] hover:from-[#2a6370] hover:to-[#5a8f8e] text-white rounded-full border-0 shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-lg font-semibold">Plan My Trip</span>
              </a>
            </div>
          </div>

          {/* Featured destinations: Beach destinations and iconic landmarks */}
          <div className="mb-12 space-y-6">
            {/* First row: Beach destinations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/bentota.jpg"
                  alt="Bentota"
                  className="w-full h-64 object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h2 className="text-3xl font-bold">Bentota</h2>
                  <p className="mt-1 text-sm max-w-xl">Beautiful beaches, water sports, and riverside relaxation on Sri Lanka's southwest coast.</p>
                  <div className="mt-3">
                    <a href="/explore/bentota" className="inline-block px-4 py-2 bg-[#307082]/80 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-[#307082] transition-colors">Learn more</a>
                  </div>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/beach.jpg"
                  alt="Mirissa"
                  className="w-full h-64 object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h2 className="text-3xl font-bold">Mirissa</h2>
                  <p className="mt-1 text-sm max-w-xl">Whale watching paradise with golden sands, beach cafés, and stunning sunsets.</p>
                  <div className="mt-3">
                    <a href="/explore/mirissa" className="inline-block px-4 py-2 bg-[#307082]/80 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-[#307082] transition-colors">Learn more</a>
                  </div>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/surfer1.jpg"
                  alt="Hikkaduwa"
                  className="w-full h-64 object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h2 className="text-3xl font-bold">Hikkaduwa</h2>
                  <p className="mt-1 text-sm max-w-xl">Surfing hotspot with coral reefs for snorkeling and a vibrant beach atmosphere.</p>
                  <div className="mt-3">
                    <a href="/explore/hikkaduwa" className="inline-block px-4 py-2 bg-[#307082]/80 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-[#307082] transition-colors">Learn more</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Second row: Iconic landmarks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://thesrilankatravelblog.com/wp-content/uploads/2020/04/Adams-Peak-slider-1.jpg"
                  alt="Adam's Peak"
                  className="w-full h-64 object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h2 className="text-3xl font-bold">Adam's Peak (Sri Pada)</h2>
                  <p className="mt-1 text-sm max-w-xl">A spiritual pilgrimage and iconic mountain with breathtaking sunrise views across the island.</p>
                  <div className="mt-3">
                    <a href="/explore/adams-peak" className="inline-block px-4 py-2 bg-[#307082]/80 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-[#307082] transition-colors">Learn more</a>
                  </div>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/ed/85/6b/um-palacio-no-topo-da.jpg?w=900&h=500&s=1"
                  alt="Sigiriya Rock Fortress"
                  className="w-full h-64 object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h2 className="text-3xl font-bold">Sigiriya Rock Fortress</h2>
                  <p className="mt-1 text-sm max-w-xl">Ancient palace ruins and UNESCO World Heritage site with dramatic views from the summit.</p>
                  <div className="mt-3">
                    <a href="/explore/sigiriya" className="inline-block px-4 py-2 bg-[#307082]/80 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-[#307082] transition-colors">Learn more</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
