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
  const [format, setFormat] = useState("T20");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [venue, setVenue] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
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
    const res = await fetch("/api/tournaments");
    const data = await res.json();
    setTournaments(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerFile) return alert("Please upload a banner image");
    
    setUploading(true);
    
    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(bannerFile);
    reader.onloadend = async () => {
      const base64data = reader.result;
      
      // Upload to Cloudinary
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ file: base64data }),
        headers: { "Content-Type": "application/json" }
      });
      const { url } = await uploadRes.json();
      
      // Create Tournament
      await fetch("/api/tournaments", {
        method: "POST",
        body: JSON.stringify({
          name, format, startDate, endDate, venue, prizePool, bannerImage: url
        }),
        headers: { "Content-Type": "application/json" }
      });
      
      setUploading(false);
      fetchTournaments();
    };
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
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 glass-panel p-6 rounded-2xl h-fit">
          <h2 className="text-2xl font-bold mb-6 text-electric-blue">Add Tournament</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input type="text" placeholder="Tournament Name" className="input-field" required onChange={e => setName(e.target.value)} />
            <input type="text" placeholder="Format (e.g., T20, Tennis Ball)" className="input-field" required onChange={e => setFormat(e.target.value)} />
            <input type="date" className="input-field" required onChange={e => setStartDate(e.target.value)} />
            <input type="date" className="input-field" required onChange={e => setEndDate(e.target.value)} />
            <input type="text" placeholder="Venue" className="input-field" required onChange={e => setVenue(e.target.value)} />
            <input type="text" placeholder="Prize Pool (e.g. ₹50,000)" className="input-field" required onChange={e => setPrizePool(e.target.value)} />
            
            <div>
              <label className="input-label">Banner Image</label>
              <input type="file" accept="image/*" required onChange={e => setBannerFile(e.target.files?.[0] || null)} className="input-field" />
            </div>

            <button disabled={uploading} type="submit" className="w-full bg-electric-blue text-navy font-bold py-3 rounded-lg hover:bg-neon-green transition">
              {uploading ? "Creating..." : "Create Tournament"}
            </button>
          </form>
        </div>

        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold mb-6">Manage Tournaments</h2>
          {tournaments.length === 0 ? (
            <p className="text-gray-400">No tournaments created yet.</p>
          ) : (
            tournaments.map((t: any) => (
              <div key={t.id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
                <img src={t.bannerImage} alt={t.name} className="w-32 h-32 object-cover rounded-xl" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-electric-blue">{t.name}</h3>
                  <p className="text-sm text-gray-300">{t.format} • {t.venue}</p>
                  <p className="text-sm text-gray-300">Prize: {t.prizePool}</p>
                  <p className="mt-2 font-semibold">
                    Status: <span className={t.status === "open" ? "text-green-400" : "text-red-400"}>{t.status.toUpperCase()}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => toggleStatus(t.id, t.status)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded">
                    {t.status === "open" ? "Close Registration" : "Open Registration"}
                  </button>
                  <button onClick={() => router.push(`/staff?tournamentId=${t.id}`)} className="px-4 py-2 bg-electric-blue text-navy font-bold rounded">
                    View Registrations
                  </button>
                  <button onClick={() => deleteTournament(t.id)} className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded">
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
