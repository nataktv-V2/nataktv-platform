"use client";

import { useEffect, useState } from "react";

interface Language {
  id: string;
  name: string;
  code: string;
  _count: { videos: number };
}

export default function AdminLanguages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");

  async function fetchLanguages() {
    try {
      const res = await fetch("/api/admin/languages");
      const data = await res.json();
      setLanguages(data);
    } catch {
      setError("Failed to load languages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLanguages();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), code: code.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create language");
        return;
      }
      setName("");
      setCode("");
      await fetchLanguages();
    } catch {
      setError("Failed to create language");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(id: string) {
    setError("");
    try {
      const res = await fetch(`/api/admin/languages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          code: editCode.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update language");
        return;
      }
      setEditingId(null);
      await fetchLanguages();
    } catch {
      setError("Failed to update language");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete language "${name}"?`)) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/languages/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete language");
        return;
      }
      await fetchLanguages();
    } catch {
      setError("Failed to delete language");
    }
  }

  function startEdit(lang: Language) {
    setEditingId(lang.id);
    setEditName(lang.name);
    setEditCode(lang.code);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">
        Languages ({languages.length})
      </h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Add Language Form */}
      <form
        onSubmit={handleAdd}
        className="bg-[#121216] border border-white/10 rounded-xl p-5 mb-6"
      >
        <h2 className="text-sm font-medium text-zinc-400 mb-3">
          Add New Language
        </h2>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hindi"
              className="w-full px-3 py-2 bg-[#0a0a0c] border border-white/10 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#f97316]/50"
              required
            />
          </div>
          <div className="w-32">
            <label className="block text-xs text-zinc-500 mb-1">Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. hi"
              maxLength={5}
              className="w-full px-3 py-2 bg-[#0a0a0c] border border-white/10 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#f97316]/50"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add"}
          </button>
        </div>
      </form>

      {/* Languages List */}
      {languages.length === 0 ? (
        <div className="bg-[#121216] rounded-xl border border-white/5 p-12 text-center">
          <p className="text-zinc-500">No languages yet.</p>
        </div>
      ) : (
        <div className="bg-[#121216] rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-white/5">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Videos</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((lang) => (
                <tr
                  key={lang.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                >
                  {editingId === lang.id ? (
                    <>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 bg-[#0a0a0c] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#f97316]/50"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editCode}
                          onChange={(e) => setEditCode(e.target.value)}
                          maxLength={5}
                          className="w-32 px-2 py-1 bg-[#0a0a0c] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#f97316]/50"
                        />
                      </td>
                      <td className="p-4 text-sm text-zinc-400">
                        {lang._count.videos}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleUpdate(lang.id)}
                            className="px-3 py-1 text-xs bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 text-xs text-zinc-400 hover:text-white border border-white/10 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 text-sm text-white font-medium">
                        {lang.name}
                      </td>
                      <td className="p-4 text-sm text-zinc-400 font-mono">
                        {lang.code}
                      </td>
                      <td className="p-4 text-sm text-zinc-400">
                        {lang._count.videos}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => startEdit(lang)}
                            className="px-3 py-1 text-xs text-zinc-400 hover:text-white border border-white/10 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(lang.id, lang.name)}
                            className="px-3 py-1 text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
