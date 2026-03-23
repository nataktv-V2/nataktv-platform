import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | Natak TV",
  description: "Refund policy for Natak TV subscriptions.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Header */}
      <header className="border-b border-border-subtle">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">
            <span className="bg-gradient-to-r from-brand-yellow via-brand-orange via-brand-pink to-brand-purple bg-clip-text text-transparent">
              Natak
            </span>
            <span className="ml-1 bg-brand-purple text-white text-xs px-1.5 py-0.5 rounded font-semibold">
              TV
            </span>
          </Link>
          <Link href="/" className="text-sm text-text-muted hover:text-accent transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Refund Policy</h1>
        <p className="text-text-muted text-sm mb-8">Last updated: 12th February 2025</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Refund Policy for Natak TV</h2>
            <p className="text-zinc-300 leading-relaxed">
              NatakTV believes in helping its customers as far as possible, and has therefore a liberal
              cancellation policy. Under this policy:
            </p>
          </section>

          <section>
            <p className="text-zinc-300 leading-relaxed">
              Cancellations will be considered only if the request is made within 1 day of buying the subscription.
            </p>
          </section>

          <section>
            <p className="text-zinc-300 leading-relaxed">
              In case of any Refunds approved by the NatakTV, it&apos;ll take 3-5 days for the refund to be
              credited to the end customer.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle mt-12">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-wrap gap-4 text-sm text-text-muted">
          <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-accent transition-colors">Terms & Conditions</Link>
          <Link href="/refund" className="text-accent">Refund Policy</Link>
          <Link href="/delete-account" className="hover:text-accent transition-colors">Delete Account</Link>
        </div>
      </footer>
    </div>
  );
}
