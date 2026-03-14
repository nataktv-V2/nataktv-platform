import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
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
            href="/home"
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
            href="/home"
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
          href="/home"
          className="bg-accent hover:bg-accent-hover text-white px-10 py-4 rounded-full font-semibold text-lg transition-colors inline-block"
        >
          Get started
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-10 px-6 text-center">
        <p className="text-text-muted text-sm">
          Subscription video streaming for mobile. Subscribe, browse, and watch.
        </p>
        <p className="text-text-muted text-xs mt-4">
          © {new Date().getFullYear()} INDIDINO VENTURES PRIVATE LIMITED. All
          rights reserved.
        </p>
      </footer>
    </main>
  );
}
