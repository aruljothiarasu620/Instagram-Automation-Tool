"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <h1 className="text-4xl font-extrabold sm:text-5xl tracking-tight text-foreground">
          Instagram Automation Tool
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl max-w-[600px]">
          Connect your Instagram Business account, automate comments, and track your analytics seamlessly in one place.
        </p>

        {session ? (
          <div className="flex flex-col gap-4 text-center sm:text-left border p-6 rounded-lg w-full mt-4">
            <h2 className="text-xl font-semibold">Welcome, {session.user?.name}!</h2>
            <p className="text-sm text-muted-foreground">Logged in with {session.user?.email}</p>
            <div className="flex gap-4 items-center flex-col sm:flex-row mt-2">
              <a
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 px-6 font-medium"
                href="/dashboard"
              >
                Go to Dashboard
              </a>
              <button
                onClick={() => signOut()}
                className="rounded-full border border-solid border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center bg-transparent gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm sm:text-base h-10 px-6 font-medium"
              >
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
            <button
              onClick={() => signIn("facebook")}
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#1877F2] text-white gap-2 hover:bg-[#166fe5] text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 font-medium"
            >
              Log in with Facebook
            </button>
            <a
              className="rounded-full border border-solid border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 font-medium"
              href="/api/v1/health"
            >
              Check API Health
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
