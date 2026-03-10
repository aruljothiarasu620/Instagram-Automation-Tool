"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const mockData = [
  { label: "Impressions", value: "0", change: "+0%", icon: "👁️", color: "from-blue-800/50 to-blue-900/30 border-blue-700/30" },
  { label: "Reach", value: "0", change: "+0%", icon: "📡", color: "from-purple-800/50 to-purple-900/30 border-purple-700/30" },
  { label: "Profile Visits", value: "0", change: "+0%", icon: "🚶", color: "from-pink-800/50 to-pink-900/30 border-pink-700/30" },
  { label: "Followers Gained", value: "0", change: "+0%", icon: "❤️", color: "from-green-800/50 to-green-900/30 border-green-700/30" },
];

export default function Analytics() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2">
          ← Back to Dashboard
        </Link>
        <span className="text-sm text-gray-400">{session?.user?.name}</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Analytics Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Track your Instagram performance and engagement metrics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {mockData.map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} border rounded-xl p-4`}
            >
              <div className="text-xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              <div className="text-xs text-green-400 mt-1">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
          <h2 className="font-semibold text-lg mb-6">Engagement Over Time</h2>
          <div className="flex flex-col items-center justify-center py-16 text-gray-600">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-sm">No data available yet.</p>
            <p className="text-xs mt-1">Connect your Instagram account to start seeing analytics.</p>
            <Link
              href="/dashboard/connect"
              className="mt-4 text-xs bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl text-white transition"
            >
              Connect Instagram
            </Link>
          </div>
        </div>

        {/* Top Posts Table Placeholder */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-4">Top Performing Posts</h2>
          <div className="text-center py-8 text-gray-600">
            <p className="text-sm">No posts found. Connect your Instagram account to sync posts.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
