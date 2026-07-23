import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let tournaments: any[] = [];
  try {
    tournaments = await prisma.tournament.findMany({
      where: { status: "open" },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database connection failed. Vercel build might be missing DATABASE_URL:", error);
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-bg min-h-[60vh] flex flex-col justify-center items-center text-center p-6 border-b border-slate-700">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
          Step Up to the <span className="text-neon-green">Crease</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl font-light">
          Register for the biggest cricket tournaments. Show your skills, win massive prizes, and become a legend.
        </p>
      </section>

      {/* Tournaments Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-electric-blue">Upcoming Tournaments</h2>
        
        {tournaments.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No active tournaments available for registration at the moment.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="glass-panel rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-xl group">
                <div className="h-64 overflow-hidden relative">
                  <img src={tournament.bannerImage} alt={tournament.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                  <div className="absolute top-4 right-4 bg-neon-green text-navy font-bold px-3 py-1 rounded-full text-sm">
                    {tournament.format}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{tournament.name}</h3>
                  <div className="space-y-2 mb-6 text-gray-300">
                    <p>🏟️ {tournament.venue}</p>
                    <p>📅 {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</p>
                    <p>💰 Prize Pool: <span className="text-electric-blue font-bold">{tournament.prizePool}</span></p>
                    <p>🎫 Entry Fee: <span className="text-neon-green font-bold">{tournament.registrationFee}</span></p>
                  </div>
                  <Link href={`/tournament/${tournament.id}/register`} className="block text-center w-full bg-electric-blue hover:bg-neon-green text-navy font-bold py-3 rounded-lg transition-colors">
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
