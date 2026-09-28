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
    <div className="min-h-screen py-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tighter">
          Player <span className="text-transparent bg-clip-text bg-gradient-to-r from-digital-accent to-digital-blue">Registration</span>
        </h1>
        {tournament && (
          <div className="inline-block bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-full px-6 py-3 shadow-lg">
            <p className="text-gray-300 font-medium">
              Registering for: <span className="font-bold text-white ml-1">{tournament.name}</span>
              <span className="mx-4 text-gray-700">|</span>
              Entry Fee: <span className="text-digital-accent font-black text-lg ml-1">₹{tournament.registrationFee}</span>
            </p>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="solid-card p-6 md:p-12 rounded-3xl space-y-10">
        {/* Basic Info */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-800/80">
            <div className="w-8 h-8 rounded-full bg-digital-blue/20 flex items-center justify-center text-digital-blue">1</div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Basic Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="input-label">Registration Type</label>
              <select name="regType" value={formData.regType} onChange={handleInputChange} className="input-field cursor-pointer">
                <option>Individual</option>
                <option>Team</option>
              </select>
            </div>
            {formData.regType === "Team" && (
              <div>
                <label className="input-label">Team Name</label>
                <input type="text" name="teamName" required value={formData.teamName} onChange={handleInputChange} className="input-field" placeholder="Enter team name" />
              </div>
            )}
            <div>
              <label className="input-label">Full Name</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="input-label">Date of Birth</label>
              <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="input-field" />
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="input-field" placeholder="john@example.com" />
            </div>
            <div>
              <label className="input-label">Phone Number</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="input-field" placeholder="+91 98765 43210" />
            </div>
          </div>
        </div>

        {/* Player Profile */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-800/80">
            <div className="w-8 h-8 rounded-full bg-digital-blue/20 flex items-center justify-center text-digital-blue">2</div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Player Profile</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="input-label">Primary Role</label>
              <select name="role" value={formData.role} onChange={handleInputChange} className="input-field cursor-pointer">
                <option>Batsman</option>
                <option>Bowler</option>
                <option>All-Rounder</option>
                <option>Wicket Keeper</option>
              </select>
            </div>
            <div>
              <label className="input-label">Batting Style</label>
              <select name="battingStyle" value={formData.battingStyle} onChange={handleInputChange} className="input-field cursor-pointer">
                <option>Right-hand</option>
                <option>Left-hand</option>
              </select>
            </div>
            <div>
              <label className="input-label">Bowling Style</label>
              <select name="bowlingStyle" value={formData.bowlingStyle} onChange={handleInputChange} className="input-field cursor-pointer">
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
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-800/80">
            <div className="w-8 h-8 rounded-full bg-digital-blue/20 flex items-center justify-center text-digital-blue">3</div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Required Documents</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0B0F19] p-5 rounded-xl border border-gray-800/80">
              <label className="input-label">Profile Photo (Max 2MB)</label>
              <input type="file" accept="image/*" required onChange={(e) => setProfileFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-digital-blue/10 file:text-digital-blue hover:file:bg-digital-blue/20 transition-colors cursor-pointer" />
            </div>
            <div className="bg-[#0B0F19] p-5 rounded-xl border border-gray-800/80">
              <label className="input-label">Government ID (Max 2MB)</label>
              <input type="file" accept="image/*" required onChange={(e) => setGovIdFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-digital-blue/10 file:text-digital-blue hover:file:bg-digital-blue/20 transition-colors cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-800/80">
            <div className="w-8 h-8 rounded-full bg-digital-blue/20 flex items-center justify-center text-digital-blue">4</div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Payment Details</h3>
          </div>
          <div className="bg-[#0B0F19] p-6 md:p-8 rounded-2xl border border-gray-800/80">
            <label className="input-label mb-3">Select Payment Method</label>
            <div className="grid md:grid-cols-2 gap-4 max-w-lg mb-8">
              <label className={`cursor-pointer flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.paymentMethod === 'Online' ? 'border-digital-blue bg-digital-blue/10 text-digital-blue font-bold shadow-neon' : 'border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700'}`}>
                <input type="radio" name="paymentMethod" value="Online" checked={formData.paymentMethod === 'Online'} onChange={handleInputChange} className="hidden" />
                <span>📱 Pay Online (UPI)</span>
              </label>
              <label className={`cursor-pointer flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.paymentMethod === 'Cash' ? 'border-orange-500 bg-orange-500/10 text-orange-500 font-bold shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700'}`}>
                <input type="radio" name="paymentMethod" value="Cash" checked={formData.paymentMethod === 'Cash'} onChange={handleInputChange} className="hidden" />
                <span>💵 Pay Cash</span>
              </label>
            </div>
            
            {formData.paymentMethod === "Online" && tournament?.upiId && (
              <div className="bg-gray-900/80 p-8 rounded-2xl border border-digital-blue/30 shadow-[0_0_20px_rgba(37,99,235,0.1)] flex flex-col items-center justify-center max-w-lg mx-auto text-center">
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Scan with PhonePe, GPay, or Paytm<br/>to pay exactly <span className="font-black text-white text-xl ml-1 block mt-1">₹{tournament.registrationFee}</span>
                </p>
                <div className="bg-white p-4 rounded-2xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${tournament.upiId}&pn=TournamentAdmin&am=${tournament.registrationFee}&cu=INR`)}`} 
                    alt="Payment QR Code" 
                    className="w-52 h-52 object-contain" 
                  />
                </div>
                <div className="bg-digital-blue/10 text-digital-blue font-medium px-5 py-2.5 rounded-full border border-digital-blue/20 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-digital-blue animate-pulse"></span>
                  After successful payment, submit below
                </div>
              </div>
            )}
            
            {formData.paymentMethod === "Cash" && (
              <div className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/30 text-center max-w-lg mx-auto">
                <p className="text-orange-400 font-medium">You selected offline payment. Your registration will remain pending until you pay the fee at the venue.</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6">
          <button disabled={loading} type="submit" className="w-full bg-digital-blue text-white font-black py-5 rounded-xl text-xl hover:bg-digital-blue-hover transition-all shadow-neon hover:shadow-neon-strong disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider flex justify-center items-center gap-3">
            {loading ? (
              <><span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span> Processing...</>
            ) : "Submit Registration"}
          </button>
        </div>
      </form>
    </div>
  );
}
