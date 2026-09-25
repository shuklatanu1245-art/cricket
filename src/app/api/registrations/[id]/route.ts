import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/cloudinaryDb";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const db = await getDb();
    
    if (!db.registrations) db.registrations = [];
    
    const registration = db.registrations.find((r: any) => r.id === params.id);
    if (registration) {
      registration.paymentStatus = data.paymentStatus;
      await saveDb(db);
    }
    
    return NextResponse.json(registration);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 });
  }
}
