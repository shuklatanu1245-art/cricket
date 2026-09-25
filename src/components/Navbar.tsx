"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, User } from "lucide-react"; // We installed lucide-react earlier

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const role = (session?.user as any)?.role;

  return (
    <nav className="bg-[#0B0F19]/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-2xl font-black text-white uppercase tracking-wider">
        CRIC<span className="text-digital-blue">PRO</span>
      </Link>

      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-gray-900 px-4 py-2 rounded-full border border-gray-700"
        >
          <User size={20} />
          <span className="hidden md:inline">{session ? "My Account" : "Menu"}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 flex flex-col z-50">
            {session ? (
              <>
                {role === "admin" && (
                  <Link 
                    href="/admin" 
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 hover:bg-gray-800 text-white transition-colors text-left"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {(role === "admin" || role === "staff") && (
                  <Link 
                    href="/staff" 
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 hover:bg-gray-800 text-white transition-colors text-left"
                  >
                    Staff Dashboard
                  </Link>
                )}
                <hr className="border-gray-700 my-1" />
                <button 
                  onClick={() => { signOut(); setIsOpen(false); }}
                  className="px-4 py-2 hover:bg-red-500/10 text-red-400 transition-colors text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 hover:bg-gray-800 text-white transition-colors text-left"
              >
                Staff / Admin Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
