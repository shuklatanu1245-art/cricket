import { NextResponse } from "next/server";
import { globalDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get('tournamentId');

    let registrations = globalDb.registrations;
    if (tournamentId) {
      registrations = registrations.filter(r => r.tournamentId === tournamentId);
    }
    
    // Add tournament details to registrations
    const enrichedRegistrations = registrations.map(reg => ({
      ...reg,
      tournament: globalDb.tournaments.find(t => t.id === reg.tournamentId)
    })).sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json(enrichedRegistrations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newReg = {
      id: Math.random().toString(36).substring(7),
      tournamentId: data.tournamentId,
      regType: data.regType,
      teamName: data.teamName || null,
      fullName: data.fullName,
      dob: new Date(data.dob).toISOString(),
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp || null,
      role: data.role,
      battingStyle: data.battingStyle,
      bowlingStyle: data.bowlingStyle,
      emergencyName: data.emergencyName,
      emergencyPhone: data.emergencyPhone,
      profilePhotoUrl: data.profilePhotoUrl,
      govIdUrl: data.govIdUrl,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === "Cash" ? "pending" : "completed",
      createdAt: Date.now(),
    };
    globalDb.registrations.push(newReg);
    return NextResponse.json(newReg);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
