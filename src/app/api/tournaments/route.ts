import { NextResponse } from "next/server";
import { globalDb } from "@/lib/db";

export async function GET() {
  return NextResponse.json(globalDb.tournaments.sort((a, b) => b.createdAt - a.createdAt));
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newTournament = {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      format: data.format,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      venue: data.venue,
      prizePool: data.prizePool,
      bannerImage: data.bannerImage,
      status: "open",
      createdAt: Date.now(),
    };
    globalDb.tournaments.push(newTournament);
    return NextResponse.json(newTournament);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tournament" }, { status: 500 });
  }
}
