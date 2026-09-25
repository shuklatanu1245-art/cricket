"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function StaffDashboardContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(searchParams.get("tournamentId") || "");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchTournaments();
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchRegistrations();
    }
  }, [selectedTournament, status]);

  const fetchTournaments = async () => {
    try {
      const res = await fetch("/api/tournaments");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTournaments(data as never[]);
        if (!selectedTournament && data.length > 0) {
          setSelectedTournament(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const url = selectedTournament ? `/api/registrations?tournamentId=${selectedTournament}` : "/api/registrations";
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setRegistrations(data as never[]);
      } else {
        console.error("API returned an error:", data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const verifyPayment = async (id: string) => {
    if (confirm("Mark this registration as Paid and Verified?")) {
      await fetch(`/api/registrations/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ paymentStatus: "completed" }),
        headers: { "Content-Type": "application/json" }
      });
      fetchRegistrations();
    }
  };

  if (status === "loading") return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Staff <span className="text-digital-blue">Dashboard</span></h1>
        <div className="flex gap-4 items-center w-full md:w-auto">
          <select 
            className="input-field max-w-xs !py-2"
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
          >
            <option value="">All Tournaments</option>
            {tournaments.map((t: any) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button onClick={() => signOut()} className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition-colors">Logout</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-digital-blue"></div>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-2xl rounded-2xl border border-gray-800">
          <table className="w-full text-left bg-digital-card">
            <thead className="bg-gray-900 border-b border-gray-800 text-gray-300">
              <tr>
                <th className="p-5 font-semibold">Name / Team</th>
                <th className="p-5 font-semibold">Type</th>
                <th className="p-5 font-semibold">Contact</th>
                <th className="p-5 font-semibold">Payment Status</th>
                <th className="p-5 font-semibold">Documents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {registrations.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-500">No registrations found.</td></tr>
              ) : (
                registrations.map((reg: any) => (
                  <tr key={reg.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-white text-lg">{reg.fullName}</div>
                      {reg.teamName && <div className="text-sm text-digital-blue font-medium mt-1">Team: {reg.teamName}</div>}
                    </td>
                    <td className="p-5 text-gray-300">{reg.regType}</td>
                    <td className="p-5">
                      <div className="text-white">{reg.phone}</div>
                      <div className="text-sm text-gray-400 mt-1">{reg.email}</div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${reg.paymentMethod === 'Cash' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                          {reg.paymentMethod.toUpperCase()}
                        </span>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`h-2 w-2 rounded-full ${reg.paymentStatus === 'completed' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></span>
                          <span className={`text-sm font-bold ${reg.paymentStatus === 'completed' ? 'text-green-400' : 'text-red-400'}`}>
                            {reg.paymentStatus?.toUpperCase() || 'PENDING'}
                          </span>
                        </div>
                        
                        {reg.paymentStatus !== 'completed' && (
                          <button onClick={() => verifyPayment(reg.id)} className="mt-2 px-4 py-1.5 bg-digital-blue hover:bg-digital-blue-hover text-white text-xs font-bold rounded-md transition-colors shadow-sm">
                            Approve Payment
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-2">
                        <a href={reg.profilePhotoUrl} target="_blank" className="inline-flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700 w-max">
                          👤 Profile
                        </a>
                        <a href={reg.govIdUrl} target="_blank" className="inline-flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700 w-max">
                          🪪 Gov ID
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function StaffDashboard() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading dashboard...</div>}>
      <StaffDashboardContent />
    </Suspense>
  );
}
