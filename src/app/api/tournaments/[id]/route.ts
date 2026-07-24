import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/cloudinaryDb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    const tournament = db.tournaments.find((t: any) => t.id === params.id);
    return NextResponse.json(tournament || null);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tournament" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const db = await getDb();
    const tournament = db.tournaments.find((t: any) => t.id === params.id);
    
    if (tournament) {
      tournament.status = data.status;
      await saveDb(db);
    }
    
    return NextResponse.json(tournament);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tournament status" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    db.tournaments = db.tournaments.filter((t: any) => t.id !== params.id);
    db.registrations = db.registrations.filter((r: any) => r.tournamentId !== params.id);
    await saveDb(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete tournament" }, { status: 500 });
  }
}
