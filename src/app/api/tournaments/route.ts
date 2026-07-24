import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/cloudinaryDb";

export async function GET() {
  try {
    const db = await getDb();
    const tournaments = db.tournaments.sort((a: any, b: any) => b.createdAt - a.createdAt);
    return NextResponse.json(tournaments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const db = await getDb();
    
    const newTournament = {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      format: data.format,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      venue: data.venue,
      prizePool: data.prizePool,
      registrationFee: data.registrationFee,
      bannerImage: data.bannerImage,
      status: "open",
      createdAt: Date.now(),
    };
    
    db.tournaments.push(newTournament);
    await saveDb(db);
    
    return NextResponse.json(newTournament);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tournament" }, { status: 500 });
  }
}
