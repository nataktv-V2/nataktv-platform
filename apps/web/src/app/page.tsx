import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

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
    description: "Monthly subscription with ₹2 trial for 2 days",
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
          <Link
            href="/subscribe"
            className="bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            Subscribe
          </Link>
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
          <Link
            href="/subscribe"
            className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Start watching
          </Link>
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
            "cmmqncn5k000fkr2w09s7l1t9","cmmqncn65000hkr2wv48vqv1x","cmmqncn68000jkr2wanuthpwy",
            "cmmqncn6a000lkr2wfzc4uvkp","cmmqncn6c000nkr2wk2kv3kse","cmmqncn6e000pkr2w95rhl37m",
            "cmmqncn6f000rkr2weg8uo6s9","cmmqncn6g000tkr2wvc0syamo","cmmqo69p90001krkw7ayhvxdv",
            "cmmqo69pc0003krkwbecfc13x","cmmrwzpu8001zkrp0f67lfm8z","cmmrwzpu90021krp0rk1yvpqk",
            "cmmrwzpu90022krp0bsilgdp9","cmmrwzpua0025krp0wwcpye7e","cmmrwzpua0026krp01bo01lii",
            "cmmrwzpua0027krp0a92jt8ix",
            // duplicated for seamless loop
            "cmmqncn5k000fkr2w09s7l1t9","cmmqncn65000hkr2wv48vqv1x","cmmqncn68000jkr2wanuthpwy",
            "cmmqncn6a000lkr2wfzc4uvkp","cmmqncn6c000nkr2wk2kv3kse","cmmqncn6e000pkr2w95rhl37m",
            "cmmqncn6f000rkr2weg8uo6s9","cmmqncn6g000tkr2wvc0syamo",
          ].map((id, i) => (
            <div key={i} className="flex-shrink-0 w-52 sm:w-64 rounded-xl overflow-hidden border border-border-subtle" style={{ aspectRatio: "9/16" }}>
              <Image src={`/thumbnails/${id}.jpg`} alt="Natak TV" width={208} height={370} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 animate-scroll-right">
          {[
            "cmmrwzpub0028krp0epbndka8","cmmrwzpuc0029krp0x3cebhed","cmmrwzpuc002akrp0xc0isp9e",
            "cmmrwzpuc002bkrp0j6uoqq0m","cmmrwzpue0035krp0zobx4hbz","cmmqncn6c000nkr2wk2kv3kse",
            "cmmqo69p90001krkw7ayhvxdv","cmmrwzpu8001zkrp0f67lfm8z","cmmrwzpu90021krp0rk1yvpqk",
            "cmmqncn5k000fkr2w09s7l1t9","cmmqncn65000hkr2wv48vqv1x","cmmqncn6e000pkr2w95rhl37m",
            // duplicated for seamless loop
            "cmmrwzpub0028krp0epbndka8","cmmrwzpuc0029krp0x3cebhed","cmmrwzpuc002akrp0xc0isp9e",
            "cmmrwzpuc002bkrp0j6uoqq0m","cmmrwzpue0035krp0zobx4hbz","cmmqncn6c000nkr2wk2kv3kse",
            "cmmqo69p90001krkw7ayhvxdv","cmmrwzpu8001zkrp0f67lfm8z",
          ].map((id, i) => (
            <div key={i} className="flex-shrink-0 w-52 sm:w-64 rounded-xl overflow-hidden border border-border-subtle" style={{ aspectRatio: "9/16" }}>
              <Image src={`/thumbnails/${id}.jpg`} alt="Natak TV" width={208} height={370} className="w-full h-full object-cover" />
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
            { step: "2", title: "Subscribe", desc: "Start with a ₹2 trial, then ₹199/month." },
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
        <Link
          href="/subscribe"
          className="bg-accent hover:bg-accent-hover text-white px-10 py-4 rounded-full font-semibold text-lg transition-colors inline-block"
        >
          Get started
        </Link>
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
