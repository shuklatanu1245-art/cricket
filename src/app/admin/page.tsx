"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [venue, setVenue] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [registrationFee, setRegistrationFee] = useState("");
  const [upiId, setUpiId] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user && (session.user as any).role !== "admin") {
      router.push("/staff");
    } else if (status === "authenticated") {
      fetchTournaments();
    }
  }, [status, session, router]);

  const fetchTournaments = async () => {
    try {
      const res = await fetch("/api/tournaments");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTournaments(data as never[]);
      } else {
        console.error("API returned an error:", data);
        alert("Failed to load tournaments. Please check if your DATABASE_URL is correct in Vercel.");
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.includes("@")) return alert("Please enter a valid UPI ID (e.g., number@ybl)");
    
    setUploading(true);
    
    // Create Tournament
    try {
      const res = await fetch("/api/tournaments", {
        method: "POST",
        body: JSON.stringify({
          name, startDate, endDate, venue, prizePool, registrationFee, upiId
        }),
        headers: { "Content-Type": "application/json" }
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert("Failed to create tournament: " + (data.details || data.error || "Unknown error"));
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
    
    setUploading(false);
    fetchTournaments();
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "open" ? "closed" : "open";
    await fetch(`/api/tournaments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
      headers: { "Content-Type": "application/json" }
    });
    fetchTournaments();
  };

  const deleteTournament = async (id: string) => {
    if(confirm("Are you sure you want to delete this tournament? All registrations will be lost.")) {
      await fetch(`/api/tournaments/${id}`, { method: "DELETE" });
      fetchTournaments();
    }
  };

  if (loading || status === "loading") return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Admin <span className="text-digital-blue">Dashboard</span></h1>
        <button onClick={() => signOut()} className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-lg transition-colors shadow-md">Logout</button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 solid-card p-6 rounded-2xl h-fit">
          <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-4">Add Tournament</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input type="text" placeholder="Tournament Name" className="input-field" required onChange={e => setName(e.target.value)} />
            <input type="date" className="input-field" required onChange={e => setStartDate(e.target.value)} />
            <input type="date" className="input-field" required onChange={e => setEndDate(e.target.value)} />
            <input type="text" placeholder="Venue" className="input-field" required onChange={e => setVenue(e.target.value)} />
            <input type="text" placeholder="Winning Prize Pool (e.g. ₹150,000)" className="input-field" required onChange={e => setPrizePool(e.target.value)} />
            <input type="number" placeholder="Registration Fee Amount (e.g. 500)" className="input-field" required onChange={e => setRegistrationFee(e.target.value)} />
            
            <div className="pt-2">
              <label className="input-label text-digital-blue">Admin UPI ID (for receiving payments)</label>
              <input type="text" placeholder="e.g. 9876543210@ybl" required onChange={e => setUpiId(e.target.value)} className="input-field" />
              <p className="text-xs text-gray-400 mt-2">We will automatically generate a dynamic QR code for this UPI ID with the exact fee amount.</p>
            </div>

            <button disabled={uploading} type="submit" className="w-full bg-digital-blue text-white font-bold py-3.5 rounded-lg hover:bg-digital-blue-hover transition-colors shadow-md mt-4">
              {uploading ? "Creating..." : "Create Tournament"}
            </button>
          </form>
        </div>

        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-4">Manage Tournaments</h2>
          {tournaments.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-digital-card rounded-2xl border border-gray-800">No tournaments created yet.</div>
          ) : (
            tournaments.map((t: any) => (
              <div key={t.id} className="solid-card p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center hover:border-gray-700 transition-colors">
                <div className="w-32 h-32 bg-gray-800 rounded-xl flex flex-col items-center justify-center p-2 text-center border border-gray-700 overflow-hidden relative">
                  <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400&auto=format&fit=crop)` }}></div>
                  <span className="text-3xl mb-2 relative z-10">🏏</span>
                  <span className="text-xs font-bold text-gray-300 max-w-full break-all relative z-10">{t.upiId}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{t.name}</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-400 mt-3">
                    <p>Venue: <span className="text-gray-200">{t.venue}</span></p>
                    <p>Prize: <span className="text-gray-200">{t.prizePool}</span></p>
                    <p>Fee: <span className="text-digital-blue font-bold">₹{t.registrationFee}</span></p>
                    <p>Status: <span className={`font-bold ${t.status === "open" ? "text-green-500" : "text-red-500"}`}>{t.status.toUpperCase()}</span></p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <button onClick={() => toggleStatus(t.id, t.status)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium text-sm rounded-lg border border-gray-700 transition-colors w-full">
                    {t.status === "open" ? "Close Registration" : "Open Registration"}
                  </button>
                  <button onClick={() => router.push(`/staff?tournamentId=${t.id}`)} className="px-4 py-2 bg-digital-blue hover:bg-digital-blue-hover text-white font-bold text-sm rounded-lg transition-colors shadow-sm w-full">
                    View Registrations
                  </button>
                  <button onClick={() => deleteTournament(t.id)} className="px-4 py-2 border border-red-900/50 text-red-400 hover:bg-red-900/30 font-medium text-sm rounded-lg transition-colors w-full">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
