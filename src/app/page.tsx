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
      <section className="min-h-[70vh] flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-transparent to-[#0B0F19]">
        <div className="max-w-4xl mx-auto backdrop-blur-sm bg-black/30 p-10 rounded-2xl border border-gray-800 shadow-2xl">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-white">
            Dominate The <span className="text-digital-blue">Pitch</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light max-w-2xl mx-auto">
            The ultimate platform for professional cricket leagues. Register your team, track your stats, and conquer the tournament.
          </p>
          <a href="#tournaments" className="inline-block bg-digital-blue hover:bg-digital-blue-hover text-white font-bold px-10 py-4 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            Explore Tournaments
          </a>
        </div>
      </section>

      {/* Tournaments Section */}
      <section id="tournaments" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-16 tracking-tight text-white">
          Active <span className="text-digital-blue">Tournaments</span>
        </h2>
        
        {tournaments.length === 0 ? (
          <div className="text-center text-gray-400 py-10 bg-digital-card rounded-2xl border border-gray-800">
            No active tournaments available for registration at the moment. Check back later!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="solid-card rounded-2xl group flex flex-col hover:-translate-y-2 transition-transform duration-300">
                <div 
                  className="h-56 bg-gray-800 relative bg-cover bg-center border-b border-gray-800 group-hover:brightness-110 transition-all"
                  style={{ backgroundImage: `url(${getTournamentThumbnail(tournament.id)})` }}
                >
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    REGISTRATION OPEN
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-4 text-white line-clamp-1" title={tournament.name}>{tournament.name}</h3>
                  <div className="space-y-3 mb-8 text-gray-400 text-sm flex-grow">
                    <p className="flex items-center gap-2"><span className="text-xl">🏟️</span> <span className="truncate">{tournament.venue}</span></p>
                    <p className="flex items-center gap-2"><span className="text-xl">📅</span> {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</p>
                    <p className="flex items-center gap-2"><span className="text-xl">🏆</span> Prize: <span className="text-white font-bold">{tournament.prizePool}</span></p>
                    <p className="flex items-center gap-2"><span className="text-xl">🎟️</span> Entry Fee: <span className="text-digital-blue font-bold text-lg">₹{tournament.registrationFee}</span></p>
                  </div>
                  <Link href={`/tournament/${tournament.id}/register`} className="block text-center w-full bg-white text-black hover:bg-digital-blue hover:text-white font-bold py-3.5 rounded-lg transition-colors shadow-md">
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
