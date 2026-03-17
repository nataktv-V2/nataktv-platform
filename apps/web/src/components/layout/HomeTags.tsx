"use client";

import { useRouter, useSearchParams } from "next/navigation";

const tags = [
  { label: "All", value: "" },
  { label: "Romance", value: "romance" },
  { label: "Crime", value: "crime" },
  { label: "Comedy", value: "comedy" },
  { label: "Drama", value: "drama" },
  { label: "Hindi", value: "hindi", type: "language" },
  { label: "Haryanvi", value: "haryanvi", type: "language" },
  { label: "Rajasthani", value: "rajasthani", type: "language" },
  { label: "Tamil", value: "tamil", type: "language" },
  { label: "Bhojpuri", value: "bhojpuri", type: "language" },
  { label: "Punjabi", value: "punjabi", type: "language" },
];

export function HomeTags() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") || "";

  const handleClick = (value: string) => {
    if (value) {
      router.push(`/home?tag=${value}`, { scroll: false });
    } else {
      router.push("/home", { scroll: false });
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 py-3">
      {tags.map((tag) => (
        <button
          key={tag.value || "all"}
          onClick={() => handleClick(tag.value)}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeTag === tag.value
              ? "bg-[#f97316] text-white"
              : "bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10"
          }`}
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
}
