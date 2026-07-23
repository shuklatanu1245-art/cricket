import { NextResponse } from "next/server";
import { globalDb } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const tournament = globalDb.tournaments.find(t => t.id === params.id);
    if (tournament) {
      tournament.status = data.status;
    }
    return NextResponse.json(tournament);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tournament status" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    globalDb.tournaments = globalDb.tournaments.filter(t => t.id !== params.id);
    globalDb.registrations = globalDb.registrations.filter(r => r.tournamentId !== params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete tournament" }, { status: 500 });
  }
}
