import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CapacitorAuthRedirect } from "@/components/auth/CapacitorAuthRedirect";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Natak TV",
  url: "https://nataktv.com",
  description:
    "India's mobile-first streaming platform for short dramas, web series, and original shows.",
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "199",
    priceCurrency: "INR",
    description: "Monthly subscription with free 4-day trial",
  },
  provider: {
    "@type": "Organization",
    name: "INDIDINO VENTURES PRIVATE LIMITED",
    url: "https://nataktv.com",
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <CapacitorAuthRedirect />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">
            <span className="bg-gradient-to-r from-brand-yellow via-brand-orange via-brand-pink to-brand-purple bg-clip-text text-transparent">
              Natak
            </span>
            <span className="ml-1 bg-brand-purple text-white text-sm px-2 py-0.5 rounded-md font-semibold">
              TV
            </span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="#features"
            className="text-text-muted hover:text-text-primary text-sm hidden sm:block"
          >
            What&apos;s on
          </Link>
          <Link
            href="#how-it-works"
            className="text-text-muted hover:text-text-primary text-sm hidden sm:block"
          >
            How it works
          </Link>
          <a
            href="https://app.nataktv.com/home"
            className="bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            Subscribe
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4">
          Streaming that fits your pocket
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
          Drama, series & stories.
          <br />
          <span className="bg-gradient-to-r from-brand-orange to-brand-pink bg-clip-text text-transparent">
            One subscription.
          </span>
        </h1>
        <p className="text-text-muted text-lg max-w-xl mb-8">
          Natak TV is your mobile-first home for short films, web series, and
          original shows. Subscribe from ₹199/month, discover by category, and
          watch in HD — no ads, no hassle.
        </p>
        <div className="flex gap-4">
          <a
            href="https://app.nataktv.com/home"
            className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Start watching
          </a>
          <Link
            href="#features"
            className="border border-border-default text-text-primary px-8 py-3 rounded-full font-semibold hover:bg-bg-surface transition-colors"
          >
            See what&apos;s on
          </Link>
        </div>
      </section>

      {/* Thumbnail Showcase */}
      <section className="py-10 overflow-hidden">
        <div className="flex gap-4 animate-scroll-left">
          {[
            { title: "Shs! Kisiko Batana Mat!", img: "/posters/1.png" },
            { title: "New Dhulhan", img: "/posters/2.png" },
            { title: "Khulja Sim-Sim", img: "/posters/3.png" },
            { title: "Ghat Ghat Ka Paani", img: "/posters/4.png" },
            { title: "Pati Patni Aur Padosan", img: "/posters/5.png" },
            { title: "Dil Ki Baatein", img: "/posters/1.png" },
            { title: "Mohabbat Ke Rang", img: "/posters/2.png" },
            { title: "Anokha Rishta", img: "/posters/3.png" },
            { title: "Pyaar Ka Safar", img: "/posters/4.png" },
            { title: "Sapno Ki Duniya", img: "/posters/5.png" },
            // duplicated for seamless loop
            { title: "Shs! Kisiko Batana Mat!", img: "/posters/1.png" },
            { title: "New Dhulhan", img: "/posters/2.png" },
            { title: "Khulja Sim-Sim", img: "/posters/3.png" },
            { title: "Ghat Ghat Ka Paani", img: "/posters/4.png" },
            { title: "Pati Patni Aur Padosan", img: "/posters/5.png" },
            { title: "Dil Ki Baatein", img: "/posters/1.png" },
            { title: "Mohabbat Ke Rang", img: "/posters/2.png" },
            { title: "Anokha Rishta", img: "/posters/3.png" },
            { title: "Pyaar Ka Safar", img: "/posters/4.png" },
            { title: "Sapno Ki Duniya", img: "/posters/5.png" },
          ].map((item, i) => (
            <div key={i} className="relative flex-shrink-0 w-52 sm:w-64 rounded-xl overflow-hidden border border-white/5 shadow-xl shadow-black/40" style={{ aspectRatio: "2/3" }}>
              <Image src={item.img} alt={item.title} width={256} height={384} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-white text-sm font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 animate-scroll-right">
          {[
            { title: "Ghat Ghat Ka Paani", img: "/posters/4.png" },
            { title: "Pati Patni Aur Padosan", img: "/posters/5.png" },
            { title: "Shs! Kisiko Batana Mat!", img: "/posters/1.png" },
            { title: "Khulja Sim-Sim", img: "/posters/3.png" },
            { title: "Rangeen Zindagi", img: "/posters/2.png" },
            { title: "Jhuki Nazar", img: "/posters/5.png" },
            { title: "New Dhulhan", img: "/posters/2.png" },
            { title: "Dil Se Dil Tak", img: "/posters/1.png" },
            { title: "Mera Humsafar", img: "/posters/3.png" },
            { title: "Ishq Wala Pyaar", img: "/posters/4.png" },
            // duplicated for seamless loop
            { title: "Ghat Ghat Ka Paani", img: "/posters/4.png" },
            { title: "Pati Patni Aur Padosan", img: "/posters/5.png" },
            { title: "Shs! Kisiko Batana Mat!", img: "/posters/1.png" },
            { title: "Khulja Sim-Sim", img: "/posters/3.png" },
            { title: "Rangeen Zindagi", img: "/posters/2.png" },
            { title: "Jhuki Nazar", img: "/posters/5.png" },
            { title: "New Dhulhan", img: "/posters/2.png" },
            { title: "Dil Se Dil Tak", img: "/posters/1.png" },
            { title: "Mera Humsafar", img: "/posters/3.png" },
            { title: "Ishq Wala Pyaar", img: "/posters/4.png" },
          ].map((item, i) => (
            <div key={i} className="relative flex-shrink-0 w-52 sm:w-64 rounded-xl overflow-hidden border border-white/5 shadow-xl shadow-black/40" style={{ aspectRatio: "2/3" }}>
              <Image src={item.img} alt={item.title} width={256} height={384} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-white text-sm font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
        <p className="text-accent text-sm font-medium tracking-wider uppercase mb-2">
          What&apos;s on Natak TV
        </p>
        <h2 className="text-3xl font-bold mb-4">
          Content you&apos;ll actually want to watch
        </h2>
        <p className="text-text-muted mb-10 max-w-lg">
          From short films to full web series — browse by category, search what
          you love, and stream in HD. New titles added regularly.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Short films", desc: "Bite-sized stories that pack a punch." },
            { name: "Web series", desc: "Binge-worthy seasons and episodes." },
            { name: "Drama & theatre", desc: "Staged performances and dramatic storytelling." },
            { name: "Comedy & variety", desc: "Sketch comedy, stand-up clips, and more." },
            { name: "Originals", desc: "Exclusive shows made for Natak TV." },
          ].map((cat) => (
            <div
              key={cat.name}
              className="bg-bg-surface border border-border-subtle rounded-xl p-6 hover:border-border-default transition-colors"
            >
              <h3 className="font-semibold mb-1">{cat.name}</h3>
              <p className="text-text-muted text-sm">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">How it works</h2>
        <p className="text-text-muted mb-10">
          Three steps to start watching.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Sign up", desc: "Create your account in seconds with Google." },
            { step: "2", title: "Subscribe", desc: "Start for ₹2 — 2 days, then ₹199/month." },
            { step: "3", title: "Browse & watch", desc: "Search, filter, and stream in HD quality." },
          ].map((item) => (
            <div key={item.step}>
              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-text-muted text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Start watching today</h2>
        <p className="text-text-muted mb-8">
          Subscribe from ₹199/month. Sign up, pay with Razorpay, and get instant
          access.
        </p>
        <a
          href="https://app.nataktv.com/home"
          className="bg-accent hover:bg-accent-hover text-white px-10 py-4 rounded-full font-semibold text-lg transition-colors inline-block"
        >
          Get started
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
            <Link href="/privacy" className="text-text-muted hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-text-muted hover:text-accent transition-colors">Terms & Conditions</Link>
            <Link href="/refund" className="text-text-muted hover:text-accent transition-colors">Refund Policy</Link>
            <Link href="/delete-account" className="text-text-muted hover:text-accent transition-colors">Delete Account</Link>
          </div>
          <p className="text-text-muted text-sm text-center">
            Subscription video streaming for mobile. Subscribe, browse, and watch.
          </p>
          <p className="text-text-muted text-xs mt-4 text-center">
            © {new Date().getFullYear()} INDIDINO VENTURES PRIVATE LIMITED. All
            rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
