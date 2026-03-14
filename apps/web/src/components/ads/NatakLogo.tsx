export function NatakLogo({ size = "lg" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: { text: "text-xl", badge: "text-xs px-1.5 py-0.5" },
    md: { text: "text-3xl", badge: "text-sm px-2 py-0.5" },
    lg: { text: "text-5xl", badge: "text-lg px-3 py-1" },
    xl: { text: "text-7xl", badge: "text-2xl px-4 py-1.5" },
  };

  const s = sizes[size];

  return (
    <span className={`${s.text} font-bold`}>
      <span
        style={{
          background: "linear-gradient(to right, #FFC107, #FF6D00, #E91E63, #7B1FA2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Natak
      </span>
      <span
        className={`ml-2 ${s.badge} rounded-md font-semibold`}
        style={{ backgroundColor: "#7B1FA2", color: "#fff" }}
      >
        TV
      </span>
    </span>
  );
}
