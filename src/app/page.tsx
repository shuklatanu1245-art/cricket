import Link from "next/link";
import { getDb } from "@/lib/cloudinaryDb";
import { getTournamentThumbnail } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let tournaments: any[] = [];
  try {
    const db = await getDb();
    tournaments = db.tournaments
      .filter((t: any) => t.status === "open")
      .sort((a: any, b: any) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Failed to load tournaments from Cloudinary DB:", error);
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-transparent to-[#050914]">
        <div className="max-w-5xl mx-auto p-10">
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tighter text-white drop-shadow-2xl">
            Dominate The <span className="text-transparent bg-clip-text bg-gradient-to-r from-digital-accent to-digital-blue">Pitch</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
            The ultimate platform for professional cricket leagues. Register your team, track your stats, and conquer the tournament.
          </p>
          <a href="#tournaments" className="inline-block bg-digital-blue hover:bg-digital-blue-hover text-white font-bold px-12 py-5 rounded-full transition-all hover:scale-105 shadow-neon text-lg tracking-wide uppercase">
            Explore Tournaments
          </a>
        </div>
      </section>

      {/* Tournaments Section */}
      <section id="tournaments" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Active <span className="text-digital-blue">Tournaments</span>
          </h2>
          <div className="h-1 w-24 bg-digital-blue rounded-full"></div>
        </div>
        
        {tournaments.length === 0 ? (
          <div className="text-center text-gray-400 py-16 bg-digital-card rounded-3xl border border-gray-800 shadow-xl">
            <span className="text-5xl block mb-4">🏆</span>
            <p className="text-xl">No active tournaments available for registration at the moment.<br/>Check back later!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="solid-card rounded-3xl group flex flex-col hover:-translate-y-3">
                <div 
                  className="h-64 bg-gray-800 relative bg-cover bg-center border-b border-gray-800 group-hover:brightness-110 transition-all duration-500"
                  style={{ backgroundImage: `url(${getTournamentThumbnail(tournament.id)})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent opacity-80"></div>
                  <div className="absolute top-4 right-4 bg-digital-blue text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wider uppercase">
                    OPEN
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow relative -mt-10 z-10">
                  <h3 className="text-3xl font-black mb-6 text-white line-clamp-2 leading-tight" title={tournament.name}>{tournament.name}</h3>
                  <div className="space-y-4 mb-8 text-gray-400 text-sm flex-grow font-medium">
                    <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800/50">
                      <span className="text-xl">📍</span> 
                      <span className="truncate text-gray-300">{tournament.venue}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800/50">
                      <span className="text-xl">📅</span> 
                      <span className="text-gray-300">{new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800/50">
                      <span className="text-xl">🏆</span> 
                      <span className="text-gray-300">Prize Pool: <span className="text-white font-bold ml-1">{tournament.prizePool}</span></span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800/50">
                      <span className="text-xl">🎟️</span> 
                      <span className="text-gray-300">Entry Fee: <span className="text-digital-accent font-black text-lg ml-1">₹{tournament.registrationFee}</span></span>
                    </div>
                  </div>
                  <Link href={`/tournament/${tournament.id}/register`} className="block text-center w-full bg-white text-black hover:bg-digital-blue hover:text-white hover:shadow-neon font-black py-4 rounded-xl transition-all duration-300 text-lg uppercase tracking-wide">
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
