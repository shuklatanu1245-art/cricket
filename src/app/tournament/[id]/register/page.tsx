"use client";

import { useState } from "react";
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
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({ file: reader.result }),
          headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        resolve(data.url);
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileFile || !govIdFile) return alert("Please upload required documents.");
    
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
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="glass-panel p-10 rounded-2xl max-w-lg">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-white">✓</span>
          </div>
          <h2 className="text-3xl font-bold text-electric-blue mb-4">Registration Successful!</h2>
          <p className="text-gray-300 mb-8">Thank you for registering. We will review your application and contact you soon.</p>
          <button onClick={() => router.push("/")} className="bg-electric-blue text-navy font-bold px-8 py-3 rounded-lg hover:bg-neon-green transition">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-electric-blue">Player Registration</h1>
      
      <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-12 rounded-3xl shadow-2xl space-y-8">
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

        <hr className="border-slate-700" />

        {/* Player Profile */}
        <h3 className="text-2xl font-bold text-neon-green">Player Profile</h3>
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

        <hr className="border-slate-700" />

        {/* Documents */}
        <h3 className="text-2xl font-bold text-neon-green">Documents</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="input-label">Profile Photo</label>
            <input type="file" accept="image/*" required onChange={(e) => setProfileFile(e.target.files?.[0] || null)} className="input-field" />
          </div>
          <div>
            <label className="input-label">Government ID</label>
            <input type="file" accept="image/*" required onChange={(e) => setGovIdFile(e.target.files?.[0] || null)} className="input-field" />
          </div>
        </div>

        <hr className="border-slate-700" />

        {/* Payment */}
        <h3 className="text-2xl font-bold text-neon-green">Payment Option</h3>
        <div>
          <label className="input-label">Payment Method</label>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="input-field max-w-sm">
            <option value="Online">Pay Online Now</option>
            <option value="Cash">Pay Cash (Offline)</option>
          </select>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-electric-blue text-navy font-bold py-4 rounded-xl text-lg hover:bg-neon-green transition">
          {loading ? "Processing Registration..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}
