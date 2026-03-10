"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/dashboard");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
      } else {
        setSuccess("Account created! Logging you in...");
        setTimeout(async () => {
          const loginRes = await signIn("credentials", { email, password, redirect: false });
          if (!loginRes?.error) router.push("/dashboard");
        }, 1000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            IG
          </div>
          <h1 className="text-2xl font-bold text-white">Instagram Automation Tool</h1>
          <p className="text-gray-400 text-sm mt-1">Automate your Instagram growth</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === "login" ? "bg-white text-gray-900" : "text-gray-400 hover:text-white"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); setSuccess(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === "register" ? "bg-white text-gray-900" : "text-gray-400 hover:text-white"}`}
            >
              Sign Up
            </button>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="bg-red-900/40 border border-red-700/50 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-900/40 border border-green-700/50 text-green-300 text-sm rounded-xl px-4 py-3 mb-4">
              {success}
            </div>
          )}

          {/* Login Form */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 transition text-white rounded-xl py-3 text-sm font-semibold mt-2"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Vel Murugan"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 transition text-white rounded-xl py-3 text-sm font-semibold mt-2"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-800"></div>
            <span className="text-xs text-gray-500">or continue with</span>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>

          {/* Facebook Button */}
          <button
            onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] transition text-white rounded-xl py-3 text-sm font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          By signing up, you agree to our{" "}
          <span className="text-gray-400 hover:text-white cursor-pointer">Terms of Service</span> and{" "}
          <span className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
