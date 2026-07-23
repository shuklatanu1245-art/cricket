import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tournaments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newTournament = await prisma.tournament.create({
      data: {
        name: data.name,
        format: data.format,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        venue: data.venue,
        prizePool: data.prizePool,
        bannerImage: data.bannerImage,
      },
    });
    return NextResponse.json(newTournament);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tournament" }, { status: 500 });
  }
}
