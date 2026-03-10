"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ConnectInstagram() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2">
            ← Back to Dashboard
          </Link>
        </div>
        <span className="text-sm text-gray-400">{session?.user?.name}</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
          📱
        </div>
        <h1 className="text-3xl font-bold mb-3">Connect Instagram Account</h1>
        <p className="text-gray-400 mb-10">
          To use Instagram automation, you need to connect a Facebook Page that is linked to an Instagram Business account.
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left mb-6">
          <h2 className="font-semibold text-lg mb-4">Requirements</h2>
          <ul className="space-y-3">
            {[
              "An Instagram Business or Creator account",
              "A Facebook Page linked to your Instagram account",
              "Admin access to the Facebook Page",
            ].map((req) => (
              <li key={req} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-green-400 mt-0.5">✓</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-900/30 border border-blue-700/40 rounded-2xl p-5 text-left mb-8">
          <p className="text-sm text-blue-300">
            <span className="font-semibold text-blue-200">ℹ️ Note:</span> This feature requires your Facebook App to be approved for <code className="bg-blue-900/50 px-1 rounded text-xs">instagram_basic</code> and <code className="bg-blue-900/50 px-1 rounded text-xs">pages_show_list</code> permissions on Meta's platform.
          </p>
        </div>

        <button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition text-white rounded-xl px-6 py-4 font-semibold text-base shadow-lg shadow-purple-900/30"
          onClick={() => alert("Instagram connection will be set up once your Facebook App permissions are approved. Please complete the Facebook App Review process first.")}
        >
          Connect Instagram Account
        </button>
      </main>
    </div>
  );
}
