"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { videos: number };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create category");
        return;
      }
      setName("");
      setSlug("");
      await fetchCategories();
    } catch {
      setError("Failed to create category");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(id: string) {
    setError("");
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          slug: editSlug.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update category");
        return;
      }
      setEditingId(null);
      await fetchCategories();
    } catch {
      setError("Failed to update category");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"?`)) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete category");
        return;
      }
      await fetchCategories();
    } catch {
      setError("Failed to delete category");
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
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
        Categories ({categories.length})
      </h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Add Category Form */}
      <form
        onSubmit={handleAdd}
        className="bg-[#121216] border border-white/10 rounded-xl p-5 mb-6"
      >
        <h2 className="text-sm font-medium text-zinc-400 mb-3">
          Add New Category
        </h2>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(slugify(e.target.value));
              }}
              placeholder="e.g. Action"
              className="w-full px-3 py-2 bg-[#0a0a0c] border border-white/10 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#f97316]/50"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. action"
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

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="bg-[#121216] rounded-xl border border-white/5 p-12 text-center">
          <p className="text-zinc-500">No categories yet.</p>
        </div>
      ) : (
        <div className="bg-[#121216] rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-white/5">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium">Videos</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                >
                  {editingId === cat.id ? (
                    <>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => {
                            setEditName(e.target.value);
                            setEditSlug(slugify(e.target.value));
                          }}
                          className="w-full px-2 py-1 bg-[#0a0a0c] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#f97316]/50"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="w-full px-2 py-1 bg-[#0a0a0c] border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#f97316]/50"
                        />
                      </td>
                      <td className="p-4 text-sm text-zinc-400">
                        {cat._count.videos}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleUpdate(cat.id)}
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
                        {cat.name}
                      </td>
                      <td className="p-4 text-sm text-zinc-400 font-mono">
                        {cat.slug}
                      </td>
                      <td className="p-4 text-sm text-zinc-400">
                        {cat._count.videos}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => startEdit(cat)}
                            className="px-3 py-1 text-xs text-zinc-400 hover:text-white border border-white/10 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
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
