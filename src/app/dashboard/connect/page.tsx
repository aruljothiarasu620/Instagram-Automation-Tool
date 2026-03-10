"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ConnectInstagram() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Check URL for callback result
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("result");
    if (result === "success") {
      setError("");
      fetchConnectedAccounts();
    } else if (result === "error") {
      setError("Failed to connect. Please try again.");
    }
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      const res = await fetch("/api/instagram/accounts");
      const data = await res.json();
      if (data.accounts) setAccounts(data.accounts);
      setFetched(true);
    } catch {
      setFetched(true);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchConnectedAccounts();
  }, [status]);

  const handleConnect = () => {
    setLoading(true);
    // Redirect to Facebook OAuth with Instagram permissions
    const params = new URLSearchParams({
      client_id: "869430439464685",
      redirect_uri: `${window.location.origin}/api/instagram/callback`,
      scope: "pages_show_list,instagram_basic,pages_read_engagement",
      response_type: "code",
      state: "connect_instagram",
    });
    window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?${params}`;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
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

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
            📱
          </div>
          <h1 className="text-3xl font-bold mb-3">Connect Instagram Account</h1>
          <p className="text-gray-400">
            Connect a Facebook Page linked to your Instagram Business account.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/40 border border-red-700/50 text-red-300 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Connected Accounts */}
        {accounts.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-lg mb-4 text-green-400">✅ Connected Accounts</h2>
            {accounts.map((acc: any) => (
              <div key={acc.ig_user_id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg">
                  📷
                </div>
                <div>
                  <div className="font-medium">@{acc.ig_username}</div>
                  <div className="text-xs text-gray-400">ID: {acc.ig_user_id}</div>
                </div>
                <span className="ml-auto text-xs bg-green-900/50 text-green-400 border border-green-700/50 px-2 py-1 rounded-full">Connected</span>
              </div>
            ))}
          </div>
        )}

        {/* Requirements */}
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

        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-60 transition text-white rounded-xl px-6 py-4 font-semibold text-base shadow-lg shadow-purple-900/30 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Redirecting to Facebook...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Connect via Facebook
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-600 mt-4">
          You will be redirected to Facebook to authorize access to your Pages and Instagram account.
        </p>
      </main>
    </div>
  );
}
