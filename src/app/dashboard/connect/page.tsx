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
  const [hasToken, setHasToken] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const handleFetchAccounts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/instagram/accounts");
      const data = await res.json();

      if (data.error === "no_token") {
        setHasToken(false);
        setError("You must log in with Facebook first to connect your Instagram account.");
      } else if (data.error === "fb_error") {
        setError(`Facebook error: ${data.message}`);
      } else if (data.error) {
        setError("Failed to fetch accounts. Please try again.");
      } else if (data.accounts?.length === 0) {
        setError("No Instagram Business accounts found. Make sure your Instagram account is a Business/Creator account and is linked to a Facebook Page.");
        setFetched(true);
      } else {
        setAccounts(data.accounts || []);
        setFetched(true);
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const loggedInWithFacebook = !!(session as any)?.accessToken;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition text-sm">
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
          <p className="text-gray-400 text-sm">
            We fetch your Instagram Business accounts linked to your Facebook Pages.
          </p>
        </div>

        {/* Not logged in with Facebook warning */}
        {!loggedInWithFacebook && (
          <div className="bg-yellow-900/30 border border-yellow-700/40 text-yellow-300 text-sm rounded-xl px-5 py-4 mb-6 text-center">
            ⚠️ You are not logged in with Facebook. Please{" "}
            <Link href="/login" className="underline hover:text-yellow-100">log out and sign in with Facebook</Link>{" "}
            to connect your Instagram account.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/40 border border-red-700/50 text-red-300 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Connected Accounts */}
        {accounts.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-lg mb-4 text-green-400">✅ Found Instagram Accounts</h2>
            {accounts.map((acc: any) => (
              <div key={acc.ig_user_id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg">
                  📷
                </div>
                <div>
                  <div className="font-medium">@{acc.ig_username}</div>
                  <div className="text-xs text-gray-400">{acc.page_name} · {acc.followers?.toLocaleString()} followers</div>
                </div>
                <span className="ml-auto text-xs bg-green-900/50 text-green-400 border border-green-700/50 px-2 py-1 rounded-full">
                  Connected ✓
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Requirements */}
        {!fetched && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 text-left">
            <h2 className="font-semibold text-lg mb-4">Requirements</h2>
            <ul className="space-y-3">
              {[
                "An Instagram Business or Creator account",
                "A Facebook Page linked to your Instagram account",
                "You must be logged in with Facebook (not email/password)",
              ].map((req) => (
                <li key={req} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-green-400 mt-0.5">✓</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action button */}
        {loggedInWithFacebook ? (
          <button
            onClick={handleFetchAccounts}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-60 transition text-white rounded-xl px-6 py-4 font-semibold text-base flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Fetching your Instagram accounts...
              </>
            ) : fetched && accounts.length > 0 ? (
              "Refresh Accounts"
            ) : (
              "Find My Instagram Accounts"
            )}
          </button>
        ) : (
          <Link
            href="/login"
            className="w-full block text-center bg-[#1877F2] hover:bg-[#166fe5] transition text-white rounded-xl px-6 py-4 font-semibold text-base"
          >
            Log in with Facebook to Connect
          </Link>
        )}
      </main>
    </div>
  );
}
