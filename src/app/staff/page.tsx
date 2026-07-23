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
    const res = await fetch("/api/tournaments");
    const data = await res.json();
    setTournaments(data);
    if (!selectedTournament && data.length > 0) {
      setSelectedTournament(data[0].id);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    const url = selectedTournament ? `/api/registrations?tournamentId=${selectedTournament}` : "/api/registrations";
    const res = await fetch(url);
    const data = await res.json();
    setRegistrations(data);
    setLoading(false);
  };

  if (status === "loading") return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Staff Dashboard - Registrations</h1>
        <div className="flex gap-4 items-center">
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
          <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
        </div>
      </div>

      {loading ? (
        <p>Loading registrations...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left glass-panel rounded-xl overflow-hidden">
            <thead className="bg-slate-800 text-electric-blue">
              <tr>
                <th className="p-4">Name / Team</th>
                <th className="p-4">Type</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Documents</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center">No registrations found.</td></tr>
              ) : (
                registrations.map((reg: any) => (
                  <tr key={reg.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                    <td className="p-4">
                      <div className="font-bold">{reg.fullName}</div>
                      {reg.teamName && <div className="text-sm text-gray-400">Team: {reg.teamName}</div>}
                    </td>
                    <td className="p-4">{reg.regType}</td>
                    <td className="p-4">
                      <div>{reg.phone}</div>
                      <div className="text-sm text-gray-400">{reg.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${reg.paymentMethod === 'Cash' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                        {reg.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4">
                      <a href={reg.profilePhotoUrl} target="_blank" className="text-electric-blue underline text-sm block">Profile</a>
                      <a href={reg.govIdUrl} target="_blank" className="text-electric-blue underline text-sm block">Gov ID</a>
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
