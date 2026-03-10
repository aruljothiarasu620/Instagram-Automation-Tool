"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            IG
          </div>
          <h1 className="text-xl font-bold">Instagram Automation Tool</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {session.user?.name}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm bg-gray-800 hover:bg-gray-700 transition px-4 py-2 rounded-full"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/40 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-1">
            Welcome back, {session.user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className="text-gray-400 text-sm">
            Logged in as {session.user?.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Connected Accounts", value: "0", icon: "📱", color: "from-blue-800/50 to-blue-900/30 border-blue-700/30" },
            { label: "Active Workflows", value: "0", icon: "⚡", color: "from-purple-800/50 to-purple-900/30 border-purple-700/30" },
            { label: "Comments Handled", value: "0", icon: "💬", color: "from-green-800/50 to-green-900/30 border-green-700/30" },
            { label: "Posts Tracked", value: "0", icon: "📊", color: "from-pink-800/50 to-pink-900/30 border-pink-700/30" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} border rounded-xl p-5`}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connect Instagram */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-purple-600 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
              📱
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Connect Instagram</h3>
              <p className="text-sm text-gray-400">
                Link your Instagram Business account to start automating.
              </p>
            </div>
            <Link href="/dashboard/connect" className="mt-auto bg-purple-600 hover:bg-purple-500 transition text-white rounded-xl px-4 py-2 text-sm font-medium text-center">
              Connect Account
            </Link>
          </div>

          {/* Create Workflow */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-blue-600 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Create Workflow</h3>
              <p className="text-sm text-gray-400">
                Set up automation rules to auto-reply to comments and messages.
              </p>
            </div>
            <Link href="/dashboard/workflows" className="mt-auto bg-blue-600 hover:bg-blue-500 transition text-white rounded-xl px-4 py-2 text-sm font-medium text-center">
              Create Workflow
            </Link>
          </div>

          {/* View Analytics */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-green-600 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">View Analytics</h3>
              <p className="text-sm text-gray-400">
                Track your Instagram engagement, reach, and post performance.
              </p>
            </div>
            <Link href="/dashboard/analytics" className="mt-auto bg-green-600 hover:bg-green-500 transition text-white rounded-xl px-4 py-2 text-sm font-medium text-center">
              View Analytics
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-sm">No activity yet.</p>
            <p className="text-xs mt-1">Connect your Instagram account to get started!</p>
          </div>
        </div>
      </main>
    </div>
  );
}
