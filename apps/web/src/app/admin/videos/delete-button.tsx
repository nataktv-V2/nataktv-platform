"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteVideoButton({ videoId }: { videoId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this video?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/videos/${videoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
