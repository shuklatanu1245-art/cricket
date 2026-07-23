import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const updated = await prisma.tournament.update({
      where: { id: params.id },
      data: { status: data.status },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tournament status" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Delete associated registrations first
    await prisma.registration.deleteMany({
      where: { tournamentId: params.id },
    });
    
    // Delete the tournament
    await prisma.tournament.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete tournament" }, { status: 500 });
  }
}
