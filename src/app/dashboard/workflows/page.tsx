"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const TRIGGER_TYPES = ["new_comment", "new_post", "new_follower"];
const ACTION_TYPES = ["auto_reply", "send_email", "save_post"];

export default function Workflows() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", trigger: "new_comment", action: "auto_reply", replyText: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowForm(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2">
          ← Back to Dashboard
        </Link>
        <span className="text-sm text-gray-400">{session?.user?.name}</span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Automation Workflows</h1>
            <p className="text-gray-400 text-sm mt-1">Create rules to automatically respond to Instagram activity.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-500 transition text-white rounded-xl px-4 py-2 text-sm font-medium"
          >
            + New Workflow
          </button>
        </div>

        {/* Empty State */}
        {!showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-lg font-medium mb-2">No workflows yet</h3>
            <p className="text-sm text-gray-500 mb-6">Create your first automation workflow to get started.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-500 transition text-white rounded-xl px-6 py-2 text-sm font-medium"
            >
              Create Workflow
            </button>
          </div>
        )}

        {/* Create Form */}
        {showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-6">New Workflow</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Workflow Name</label>
                <input
                  type="text"
                  placeholder="e.g. Auto-reply to comments"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Trigger</label>
                <select
                  value={form.trigger}
                  onChange={(e) => setForm({ ...form, trigger: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {TRIGGER_TYPES.map((t) => (
                    <option key={t} value={t}>{t.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Action</label>
                <select
                  value={form.action}
                  onChange={(e) => setForm({ ...form, action: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {ACTION_TYPES.map((a) => (
                    <option key={a} value={a}>{a.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              {form.action === "auto_reply" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Reply Text</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Thanks for your comment! 😊"
                    value={form.replyText}
                    onChange={(e) => setForm({ ...form, replyText: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 transition text-white rounded-xl py-2 text-sm font-medium"
                >
                  {saved ? "✓ Saved!" : "Save Workflow"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 transition text-gray-300 rounded-xl py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
