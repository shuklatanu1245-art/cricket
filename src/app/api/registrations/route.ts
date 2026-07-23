import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get('tournamentId');

    const registrations = await prisma.registration.findMany({
      where: tournamentId ? { tournamentId } : undefined,
      include: { tournament: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const registration = await prisma.registration.create({
      data: {
        tournamentId: data.tournamentId,
        regType: data.regType,
        teamName: data.teamName || null,
        fullName: data.fullName,
        dob: new Date(data.dob),
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
      },
    });
    return NextResponse.json(registration);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
