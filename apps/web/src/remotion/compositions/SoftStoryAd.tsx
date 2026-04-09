import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── Props for dynamic script variants ─────────────────────────────────
export type SoftStoryAdProps = {
  hookLine1: string;
  hookLine2: string;
  showTitle: string;
  showImage: string;
  ctaLine1: string;
  ctaLine2: string;
  ctaButton: string;
  hookAudio: string;
  ctaAudio: string;
};

export const defaultProps: SoftStoryAdProps = {
  hookLine1: "Raat ko akeli ho?",
  hookLine2: "Chalo, ek raaz dikhati hoon!",
  showTitle: "Love Shadi Dhokha",
  showImage: "thumbnails/ads/love-shadi-dhokha.jpg",
  ctaLine1: "2 Rupaye mein 100+ Natak",
  ctaLine2: "Download karo Natak TV aaj hi!",
  ctaButton: "Download Natak TV",
  hookAudio: "audio/ads/01-raat-akeli-hook.mp3",
  ctaAudio: "audio/ads/01-raat-akeli-cta.mp3",
};

// ─── Show Reveal (0-5s / frames 0-150) ────────────────────────────────
const ShowReveal: React.FC<{ showImage: string }> = ({ showImage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(frame, [0, 150], [1, 1.15], { extrapolateRight: "clamp" });
  const brightness = interpolate(frame, [0, 10, 120, 150], [0.6, 1, 1, 0.5], { extrapolateRight: "clamp" });

  // ₹2 coin floating in scene — appears at frame 60, bounces, gets "picked up" at frame 130
  const coinAppear = interpolate(frame, [60, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const coinBounce = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 8, stiffness: 120, mass: 0.6 } });
  const coinFloat = Math.sin(frame * 0.08) * 10;
  const coinGlow = 0.4 + Math.sin(frame * 0.12) * 0.2;
  const coinPickup = interpolate(frame, [120, 140], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const coinPickupY = interpolate(frame, [120, 140], [0, -200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const coinPickupScale = interpolate(frame, [120, 140], [1, 1.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Img
        src={staticFile(showImage)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          transform: `scale(${scale})`,
          filter: `brightness(${brightness})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(10,10,12,0.9) 5%, rgba(10,10,12,0.4) 35%, transparent 55%, rgba(10,10,12,0.2) 100%)",
        }}
      />
      {/* Floating ₹2 coin in scene */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 350,
          opacity: coinAppear * coinPickup,
          transform: `scale(${coinBounce * coinPickupScale}) translateY(${coinFloat + coinPickupY}px)`,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "#f97316",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 900,
            color: "#fff",
            boxShadow: `0 4px 40px rgba(249,115,22,${coinGlow}), 0 0 60px rgba(249,115,22,${coinGlow * 0.5})`,
            border: "3px solid rgba(255,255,255,0.3)",
          }}
        >
          ₹2
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Hook Text (0-5s / frames 0-150) ──────────────────────────────────
const HookText: React.FC<{ line1: string; line2: string }> = ({ line1, line2 }) => {
  const frame = useCurrentFrame();

  const line1Opacity = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Y = interpolate(frame, [15, 35], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1FadeOut = interpolate(frame, [120, 140], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const line2Opacity = interpolate(frame, [55, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y = interpolate(frame, [55, 75], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2FadeOut = interpolate(frame, [120, 140], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 280 }}>
      <p
        style={{
          fontSize: 52,
          color: "#fbbf24",
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          textAlign: "center",
          opacity: line1Opacity * line1FadeOut,
          transform: `translateY(${line1Y}px)`,
          textShadow: "0 4px 30px rgba(0,0,0,0.8)",
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        {line1}
      </p>
      <p
        style={{
          fontSize: 38,
          color: "#a1a1aa",
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          textAlign: "center",
          marginTop: 20,
          opacity: line2Opacity * line2FadeOut,
          transform: `translateY(${line2Y}px)`,
          textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        {line2}
      </p>
    </AbsoluteFill>
  );
};

// ─── App UI Mockup (5-7s / frames 0-60 within sequence) ─────────────
const AppUIMockup: React.FC<{ showImage: string }> = ({ showImage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 8], [0, 0.97], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [50, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phone slides up with spring
  const phoneY = spring({ frame, fps, config: { damping: 14, stiffness: 160, mass: 0.7 } });
  const phoneTranslate = interpolate(phoneY, [0, 1], [400, 0]);

  // App screen fades in
  const screenOpacity = interpolate(frame, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Finger tap animation
  const fingerOpacity = interpolate(frame, [22, 26, 34, 38], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fingerScale = interpolate(frame, [26, 30, 32, 34], [1, 0.85, 0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Button pulse after tap
  const btnPulse = frame > 30 ? 1 + Math.sin((frame - 30) * 0.3) * 0.05 : 1;
  const btnColor = frame > 30 ? "#22c55e" : "#f97316";
  const btnText = frame > 30 ? "✓ Welcome!" : "Start Free Trial — ₹2";

  // Success glow
  const successGlow = interpolate(frame, [30, 40], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const thumbs = [
    "thumbnails/ads/gaon-ki-biwi.jpg",
    "thumbnails/ads/kalyanam-to-kadhal.jpg",
    "thumbnails/ads/hey-leela.jpg",
    "thumbnails/ads/ghat-ghat-ka-paani.jpg",
    "thumbnails/ads/love-shadi-dhokha.jpg",
    "thumbnails/ads/love-guru.jpg",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgba(10, 10, 12, ${bgOpacity})`,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Phone frame — 2x size */}
      <div
        style={{
          width: 700,
          height: 1300,
          borderRadius: 70,
          border: "5px solid #333",
          backgroundColor: "#0a0a0c",
          overflow: "hidden",
          transform: `translateY(${phoneTranslate}px)`,
          boxShadow: "0 20px 80px rgba(0,0,0,0.8), 0 0 40px rgba(249,115,22,0.15)",
          position: "relative",
        }}
      >
        {/* Notch */}
        <div style={{ width: 200, height: 36, backgroundColor: "#0a0a0c", borderRadius: "0 0 24px 24px", margin: "0 auto", position: "relative", zIndex: 10 }} />

        {/* Status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 30px 12px", fontSize: 20, color: "#999", fontFamily: "Inter, sans-serif" }}>
          <span>9:41</span>
          <span>●●●● WiFi 🔋</span>
        </div>

        {/* App screen */}
        <div style={{ opacity: screenOpacity, padding: "0 20px" }}>
          {/* App header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 6px 18px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 36, fontWeight: 800, background: "linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "Inter, sans-serif" }}>Natak</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", backgroundColor: "#7c3aed", borderRadius: 6, padding: "3px 10px" }}>TV</span>
            </div>
            <span style={{ fontSize: 30, color: "#999" }}>🔍</span>
          </div>

          {/* Trending section */}
          <p style={{ fontSize: 22, color: "#f97316", fontWeight: 700, marginBottom: 12, fontFamily: "Inter, sans-serif" }}>🔥 Trending Now</p>

          {/* Show grid — 2x3 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {thumbs.map((t, i) => (
              <div key={i} style={{ borderRadius: 14, overflow: "hidden", height: 200, position: "relative" }}>
                <Img src={staticFile(t)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }} />
              </div>
            ))}
          </div>

          {/* CTA button inside app */}
          <div
            style={{
              padding: "22px 36px",
              borderRadius: 40,
              background: btnColor === "#22c55e" ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #f97316, #ea580c)",
              textAlign: "center",
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              transform: `scale(${btnPulse})`,
              boxShadow: btnColor === "#22c55e" ? `0 4px 30px rgba(34,197,94,${successGlow})` : "0 4px 20px rgba(249,115,22,0.4)",
              transition: "background 0.3s",
            }}
          >
            {btnText}
          </div>
        </div>

        {/* Finger tap indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 130,
            left: "50%",
            marginLeft: -30,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.7)",
            opacity: fingerOpacity,
            transform: `scale(${fingerScale})`,
            boxShadow: "0 0 20px rgba(255,255,255,0.5)",
          }}
        />
      </div>

      {/* "Download Now" text below phone */}
      <p style={{ fontSize: 32, color: "#fbbf24", fontWeight: 700, marginTop: 30, fontFamily: "Inter, sans-serif", opacity: interpolate(frame, [15, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Download Natak TV App
      </p>
    </AbsoluteFill>
  );
};

// ─── CTA Section (7-15s / frames 0-240) — Character + Coin + CTA ─────
const CTASection: React.FC<{ line1: string; line2: string; button: string; showImage: string }> = ({ line1, line2, button, showImage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Character image slides in from left
  const charSlide = spring({ frame, fps, config: { damping: 14, stiffness: 120, mass: 0.8 } });
  const charX = interpolate(charSlide, [0, 1], [-400, 0]);
  const charScale = interpolate(frame, [0, 240], [1, 1.05], { extrapolateRight: "clamp" });

  // Coin in character's "hand" area — bounces in
  const coinScale = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 10, stiffness: 180, mass: 0.6 } });
  const coinPulse = frame > 40 ? 1 + Math.sin((frame - 40) * 0.1) * 0.05 : 1;
  const coinGlow = 0.5 + Math.sin(frame * 0.12) * 0.3;

  // Text animations
  const line1Opacity = interpolate(frame, [25, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Y = interpolate(frame, [25, 40], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Opacity = interpolate(frame, [45, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y = interpolate(frame, [45, 60], [15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Button
  const btnScale = spring({ frame: Math.max(0, frame - 70), fps, config: { damping: 10, stiffness: 150, mass: 0.7 } });
  const btnGlow = frame > 100 ? 0.5 + Math.sin((frame - 100) * 0.1) * 0.3 : 0.5;

  return (
    <AbsoluteFill style={{ opacity: bgOpacity }}>
      {/* Character image as background — full bleed */}
      <Img
        src={staticFile(showImage)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          transform: `translateX(${charX}px) scale(${charScale})`,
          filter: "brightness(0.7)",
        }}
      />

      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(10,10,12,0.95) 0%, rgba(10,10,12,0.7) 35%, rgba(10,10,12,0.3) 60%, rgba(10,10,12,0.5) 100%)",
        }}
      />

      {/* ₹2 Coin floating near character */}
      <div
        style={{
          position: "absolute",
          top: 280,
          right: 80,
          width: 160,
          height: 160,
          borderRadius: "50%",
          backgroundColor: "#f97316",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          fontWeight: 900,
          color: "#fff",
          transform: `scale(${coinScale * coinPulse})`,
          boxShadow: `0 4px 50px rgba(249,115,22,${coinGlow}), 0 0 80px rgba(249,115,22,${coinGlow * 0.4})`,
          border: "3px solid rgba(255,255,255,0.3)",
        }}
      >
        ₹2
      </div>

      {/* Logo top center */}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 72, fontWeight: 800, background: "linear-gradient(135deg, #f59e0b, #ef4444, #ec4899, #8b5cf6)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "Inter, sans-serif" }}>Natak</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#fff", backgroundColor: "#7c3aed", borderRadius: 8, padding: "4px 12px" }}>TV</span>
        </div>
      </div>

      {/* Bottom content overlay */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 100 }}>
        {/* CTA text */}
        <p style={{ fontSize: 52, color: "#f4f4f5", fontWeight: 800, fontFamily: "Inter, sans-serif", opacity: line1Opacity, transform: `translateY(${line1Y}px)`, marginBottom: 12, textAlign: "center", paddingLeft: 40, paddingRight: 40, textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}>
          {line1}
        </p>
        <p style={{ fontSize: 36, color: "#fbbf24", fontWeight: 600, opacity: line2Opacity, transform: `translateY(${line2Y}px)`, marginBottom: 50, textAlign: "center", paddingLeft: 40, paddingRight: 40, textShadow: "0 4px 20px rgba(0,0,0,0.9)" }}>
          {line2}
        </p>

        {/* CTA Button */}
        <div style={{ fontSize: 46, fontWeight: 800, color: "#fff", padding: "32px 80px", borderRadius: 999, background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: `0 4px ${30 + btnGlow * 20}px rgba(249,115,22,${btnGlow})`, transform: `scale(${btnScale})` }}>
          {button}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ─────────────────────────────────────────────────
export const SoftStoryAd: React.FC<SoftStoryAdProps> = (props) => {
  const p = { ...defaultProps, ...props };

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0c" }}>
      {/* Background music — Bollywood beat, punchy first 3s then ducked under voice */}
      <Audio
        src={staticFile("audio/ads/bgm-bollywood.mp3")}
        volume={(f) => {
          const t = f / 30;
          if (t < 3) return 0.30;
          return 0.03;
        }}
      />

      {/* Background show image with Ken Burns (0-7s visible) */}
      <Sequence from={0} durationInFrames={210}>
        <ShowReveal showImage={p.showImage} />
      </Sequence>

      {/* Hook text overlay (0-5s) */}
      <Sequence from={0} durationInFrames={150}>
        <HookText line1={p.hookLine1} line2={p.hookLine2} />
      </Sequence>

      {/* App UI mockup — phone with Natak TV app + signup tap (5-7s) */}
      <Sequence from={150} durationInFrames={60}>
        <AppUIMockup showImage={p.showImage} />
      </Sequence>

      {/* CTA section (7-15s) — character + coin + CTA */}
      <Sequence from={210} durationInFrames={240}>
        <CTASection line1={p.ctaLine1} line2={p.ctaLine2} button={p.ctaButton} showImage={p.showImage} />
      </Sequence>

      {/* Audio: Hook voiceover */}
      <Sequence from={10}>
        <Audio src={staticFile(p.hookAudio)} volume={0.9} />
      </Sequence>

      {/* Audio: CTA voiceover — starts after hook */}
      <Sequence from={180}>
        <Audio src={staticFile(p.ctaAudio)} volume={0.95} />
      </Sequence>
    </AbsoluteFill>
  );
};
