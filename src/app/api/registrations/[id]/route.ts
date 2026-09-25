import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/cloudinaryDb";
import nodemailer from "nodemailer";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const db = await getDb();
    
    if (!db.registrations) db.registrations = [];
    
    const registration = db.registrations.find((r: any) => r.id === params.id);
    if (registration) {
      registration.paymentStatus = data.paymentStatus;
      await saveDb(db);

      // Send Email on Approval
      if (data.paymentStatus === "completed" && registration.email) {
        const tournament = db.tournaments?.find((t: any) => t.id === registration.tournamentId);
        const tName = tournament ? tournament.name : "the Cricket Tournament";
        
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.GMAIL_EMAIL,
              pass: process.env.GMAIL_APP_PASSWORD,
            }
          });

          const mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to: registration.email,
            subject: `Registration Approved - ${tName}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h2 style="color: #0ea5e9; text-align: center;">Registration Approved! 🏏</h2>
                  <p style="font-size: 16px; color: #333;">Hi <strong>${registration.fullName}</strong>,</p>
                  <p style="font-size: 16px; color: #333;">Your registration for <strong>${tName}</strong> has been successfully approved by the administration.</p>
                  
                  <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #334155;">Your Details:</h3>
                    <ul style="list-style-type: none; padding: 0; color: #475569;">
                      <li><strong>Name:</strong> ${registration.fullName}</li>
                      ${registration.teamName ? `<li><strong>Team:</strong> ${registration.teamName}</li>` : ''}
                      <li><strong>Role:</strong> ${registration.role}</li>
                      <li><strong>Type:</strong> ${registration.regType}</li>
                    </ul>
                  </div>
                  
                  <p style="font-size: 16px; color: #333;">Thank you for registering. Get ready for some exciting cricket action!</p>
                  <p style="font-size: 14px; color: #64748b; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                    Best regards,<br>Tournament Management Team
                  </p>
                </div>
              </div>
            `
          };

          await transporter.sendMail(mailOptions);
          console.log("Approval email sent to", registration.email);
        } catch (emailError) {
          console.error("Failed to send approval email:", emailError);
          // Don't throw here, registration is already saved
        }
      }
    }
    
    return NextResponse.json(registration);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 });
  }
}
