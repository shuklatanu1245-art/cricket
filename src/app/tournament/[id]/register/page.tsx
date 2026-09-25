"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Register({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    regType: "Individual",
    teamName: "",
    fullName: "",
    dob: "",
    email: "",
    phone: "",
    whatsapp: "",
    role: "Batsman",
    battingStyle: "Right-hand",
    bowlingStyle: "Right-arm Fast",
    emergencyName: "",
    emergencyPhone: "",
    paymentMethod: "Online",
  });
  
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [govIdFile, setGovIdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadToCloudinary = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: JSON.stringify({ file: reader.result }),
            headers: { "Content-Type": "application/json" }
          });
          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Upload failed (${res.status}): ${errText}`);
          }
          const data = await res.json();
          resolve(data.url);
        } catch (e: any) {
          reject(e);
        }
      };
      reader.onerror = () => reject(new Error("File read error"));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileFile || !govIdFile) return alert("Please upload required documents.");
    
    // Check file size (max 2MB per file to avoid Vercel 4.5MB limit)
    if (profileFile.size > 2 * 1024 * 1024 || govIdFile.size > 2 * 1024 * 1024) {
      return alert("Images are too large! Please upload images smaller than 2MB each.");
    }
    
    setLoading(true);

    try {
      // 1. Upload Images
      const profilePhotoUrl = await uploadToCloudinary(profileFile);
      const govIdUrl = await uploadToCloudinary(govIdFile);

      // 2. Submit Registration
      const res = await fetch("/api/registrations", {
        method: "POST",
        body: JSON.stringify({
          tournamentId: params.id,
          ...formData,
          profilePhotoUrl,
          govIdUrl
        }),
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert("Registration failed: " + (errData.details || errData.error || "Please try again."));
      }
    } catch (error: any) {
      alert("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const [tournament, setTournament] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/tournaments/${params.id}`)
      .then(res => res.json())
      .then(data => setTournament(data));
  }, [params.id]);

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="solid-card p-10 rounded-2xl max-w-lg border border-gray-800">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_#22c55e]">
            <span className="text-4xl text-white">✓</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Registration Successful!</h2>
          <p className="text-gray-400 mb-8 font-light text-lg">Thank you for registering. We will review your application and you will receive a confirmation email once approved.</p>
          <button onClick={() => router.push("/")} className="bg-digital-blue text-white font-bold px-8 py-3.5 rounded-lg hover:bg-digital-blue-hover transition-colors shadow-md w-full">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-2 text-white tracking-tight">Player <span className="text-digital-blue">Registration</span></h1>
      {tournament && (
        <p className="text-center text-xl text-gray-400 mb-10 font-light">
          Registering for: <span className="font-bold text-white">{tournament.name}</span>
          <br/>
          Entry Fee: <span className="text-digital-blue font-bold">₹{tournament.registrationFee}</span>
        </p>
      )}
      
      <form onSubmit={handleSubmit} className="solid-card p-8 md:p-12 rounded-3xl space-y-8">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="input-label">Registration Type</label>
            <select name="regType" value={formData.regType} onChange={handleInputChange} className="input-field">
              <option>Individual</option>
              <option>Team</option>
            </select>
          </div>
          {formData.regType === "Team" && (
            <div>
              <label className="input-label">Team Name</label>
              <input type="text" name="teamName" required value={formData.teamName} onChange={handleInputChange} className="input-field" />
            </div>
          )}
          <div>
            <label className="input-label">Full Name</label>
            <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="input-field" />
          </div>
          <div>
            <label className="input-label">Date of Birth</label>
            <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="input-field" />
          </div>
          <div>
            <label className="input-label">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="input-field" />
          </div>
          <div>
            <label className="input-label">Phone Number</label>
            <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="input-field" />
          </div>
        </div>

        {/* Player Profile */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-800">Player Profile</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="input-label">Primary Role</label>
              <select name="role" value={formData.role} onChange={handleInputChange} className="input-field">
                <option>Batsman</option>
                <option>Bowler</option>
                <option>All-Rounder</option>
                <option>Wicket Keeper</option>
              </select>
            </div>
            <div>
              <label className="input-label">Batting Style</label>
              <select name="battingStyle" value={formData.battingStyle} onChange={handleInputChange} className="input-field">
                <option>Right-hand</option>
                <option>Left-hand</option>
              </select>
            </div>
            <div>
              <label className="input-label">Bowling Style</label>
              <select name="bowlingStyle" value={formData.bowlingStyle} onChange={handleInputChange} className="input-field">
                <option>Right-arm Fast</option>
                <option>Right-arm Spin</option>
                <option>Left-arm Fast</option>
                <option>Left-arm Spin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-800">Documents</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="input-label">Profile Photo</label>
              <input type="file" accept="image/*" required onChange={(e) => setProfileFile(e.target.files?.[0] || null)} className="input-field bg-gray-800" />
            </div>
            <div>
              <label className="input-label">Government ID</label>
              <input type="file" accept="image/*" required onChange={(e) => setGovIdFile(e.target.files?.[0] || null)} className="input-field bg-gray-800" />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-800">Payment Option</h3>
          <div>
            <label className="input-label">Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="input-field max-w-sm">
              <option value="Online">Pay Online Now (UPI / QR)</option>
              <option value="Cash">Pay Cash (Offline)</option>
            </select>
            
            {formData.paymentMethod === "Online" && tournament?.upiId && (
              <div className="mt-8 bg-gray-900 p-8 rounded-2xl border border-digital-blue shadow-[0_0_15px_rgba(37,99,235,0.15)] flex flex-col items-center max-w-md">
                <p className="text-sm text-gray-400 mb-4 text-center leading-relaxed">Scan with PhonePe, GPay, or Paytm<br/>to pay exactly <span className="font-bold text-white text-lg">₹{tournament.registrationFee}</span></p>
                <div className="bg-white p-3 rounded-xl mb-6 shadow-sm">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${tournament.upiId}&pn=TournamentAdmin&am=${tournament.registrationFee}&cu=INR`)}`} 
                    alt="Payment QR Code" 
                    className="w-56 h-56 object-contain" 
                  />
                </div>
                <p className="text-sm text-center text-digital-blue font-medium bg-digital-blue/10 px-4 py-2 rounded-full border border-digital-blue/20">After payment, click Submit Registration.</p>
              </div>
            )}
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-digital-blue text-white font-extrabold py-4 rounded-xl text-lg hover:bg-digital-blue-hover transition-colors shadow-lg mt-10">
          {loading ? "Processing Registration..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}
